import { Inject, Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as Minio from 'minio';
import * as crypto from 'crypto';
import * as path from 'path';
import { MINIO_OPTIONS } from './minio.constants';
import { BufferedFile, UploadedFileResponse, type MinioModuleOptions } from './minio.interface';


@Injectable()
export class MinioService {
    private readonly minioClient: Minio.Client;
    private readonly bucket: string;
    private readonly logger = new Logger(MinioService.name);

    constructor(@Inject(MINIO_OPTIONS) private readonly options: MinioModuleOptions) {
        this.minioClient = new Minio.Client(options);
        this.bucket = options.bucket;
    }

    /**
     * Initializes the bucket if it doesn't exist on application startup
     */
    async onModuleInit() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucket);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucket);

                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { AWS: ['*'] },
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucket}/*`],
                        },
                    ],
                };

                const lifecycleConfig = {
                    Rule: [
                        {
                            ID: 'DeleteTempFiles',
                            Status: 'Enabled',
                            Filter: {
                                Prefix: 'temp/', // ONLY files in the temp folder will be deleted
                            },
                            Expiration: {
                                Days: 1, // Number of days before deletion
                            },
                        },
                    ],
                };

                await this.minioClient.setBucketPolicy(this.bucket, JSON.stringify(policy));
                await this.minioClient.setBucketLifecycle(this.bucket, lifecycleConfig);
                this.logger.log(`Bucket '${this.bucket}' initialized successfully`);
            }

        } catch (error) {
            this.logger.error(`Failed to set bucket policy: ${error.message}`);
        }
    }

    /**
     * Uploads a single file
     */
    async uploadFile(file: BufferedFile, folder: string = 'temp'): Promise<UploadedFileResponse> {
        if (!file) throw new BadRequestException('File is required');

        const timestamp = Date.now();
        const hash = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        const filename = `${folder ? folder + '/' : ''}${timestamp}-${hash}${extension}`;

        try {
            await this.minioClient.putObject(
                this.bucket,
                filename,
                file.buffer,
                file.size,
                { 'Content-Type': file.mimetype }
            );

            return {
                filename,
                originalName: file.originalname,
                url: this.getPublicUrl(filename),
            };
        } catch (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            throw new InternalServerErrorException('Failed to upload file');
        }
    }

    /**
     * Uploads multiple files with rollback (compensation) support.
     * If one fails, it attempts to delete the others to maintain clean state.
     */
    async uploadFiles(files: BufferedFile[], folder: string = 'temp'): Promise<UploadedFileResponse[]> {
        const uploadedFiles: UploadedFileResponse[] = [];

        try {
            // Use Promise.all to upload in parallel for speed
            // Note: For very large numbers of files, use p-limit to throttle concurrency
            const uploadPromises = files.map(file => this.uploadFile(file, folder));
            const results = await Promise.all(uploadPromises);
            return results;
        } catch (error) {
            this.logger.error(`Batch upload failed, attempting rollback...`);
            // Compensation Logic: Delete files that were successfully uploaded before the crash
            if (uploadedFiles.length > 0) {
                await this.deleteFiles(uploadedFiles.map(f => f.filename));
            }
            throw error;
        }
    }

    /**
     * Deletes a single file
     */
    async deleteFile(filename: string): Promise<void> {
        try {
            await this.minioClient.removeObject(this.bucket, filename);
        } catch (error) {
            this.logger.error(`Delete failed for ${filename}: ${error.message}`);
            throw new InternalServerErrorException('Failed to delete file');
        }
    }

    /**
     * Deletes multiple files efficiently
     */
    async deleteFiles(filenames: string[]): Promise<void> {
        try {
            // MinIO client supports removing a list of objects
            await this.minioClient.removeObjects(this.bucket, filenames);
        } catch (error) {
            this.logger.error(`Batch delete failed: ${error.message}`);
            throw new InternalServerErrorException('Failed to delete files');
        }
    }

    /**
     * Generates a temporary access URL (Presigned)
     */
    async getPresignedUrl(filename: string, expirySeconds: number = 3600): Promise<string> {
        return await this.minioClient.presignedGetObject(this.bucket, filename, expirySeconds);
    }

    /**
     * Generates a public URL for a file
     * @param filename The name of the file
     */
    private getPublicUrl(filename: string): string {
        // Logic to construct public URL if your bucket is public
        // Or return a standardized path for your frontend to proxy
        const { endPoint, port, useSSL } = this.options;
        const protocol = useSSL ? 'https' : 'http';
        // Handle localhost vs standard domain
        const host = endPoint === '127.0.0.1' ? `127.0.0.1:${port}` : endPoint;
        return `${protocol}://${host}/${this.bucket}/${filename}`;
    }

    /**
     * Fetches metadata for a specific object
     * @param filename The name of the file
     */
    async getFileMetadata(filename: string) {
        try {
            const stat = await this.minioClient.statObject(this.bucket, filename);
            return {
                size: stat.size,
                contentType: stat.metaData['content-type'], // e.g., 'image/jpeg'
                lastModified: stat.lastModified,
                etag: stat.etag,
                // Custom metadata if you added any during upload
                customMetadata: stat.metaData
            };
        } catch (error) {
            this.logger.error(`Metadata fetch failed: ${error.message}`);
            throw new NotFoundException('File not found');
        }
    }

    /**
     * Moves a temporary file to a permanent location
     * @param tempKey The temporary key of the file
     * @param folder The folder to move the file to
     */
    async moveFileToPermanent(tempKeyOrUrl: string, folder: string = ''): Promise<{ key: string, url: string }> {
        // 1. Extract the key if a full URL was passed
        // This removes everything up to and including the bucket name
        const tempKey = tempKeyOrUrl.includes(this.bucket)
            ? tempKeyOrUrl.split(`${this.bucket}/`)[1]
            : tempKeyOrUrl;

        // 2. Define the new permanent path
        const fileNameOnly = tempKey.split('/').pop();

        if (!fileNameOnly) throw new BadRequestException('Invalid file name');

        // Ensure folder doesn't start or end with extra slashes
        const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '');
        const permanentKey = sanitizedFolder ? `${sanitizedFolder}/${fileNameOnly}` : fileNameOnly;

        try {
            // Copy using the relative keys only
            await this.minioClient.copyObject(
                this.bucket,
                permanentKey,
                `/${this.bucket}/${tempKey}` // Source MUST start with /bucket/key
            );

            await this.minioClient.removeObject(this.bucket, tempKey);
            return {
                key: permanentKey,
                url: this.getPublicUrl(permanentKey)
            };
        } catch (error) {
            this.logger.error(`Move failed: ${error.message}`);
            throw new InternalServerErrorException('Could not move file');
        }
    }

    /**
     * Force deletes a bucket by emptying it first
     */
    async deleteBucket(bucketName: string): Promise<void> {
        try {
            const exists = await this.minioClient.bucketExists(bucketName);
            if (!exists) {
                throw new BadRequestException(`Bucket '${bucketName}' does not exist`);
            }

            // 1. List all objects in the bucket
            const objectsList: string[] = [];
            const objectsStream = this.minioClient.listObjects(bucketName, '', true);

            for await (const obj of objectsStream) {
                objectsList.push(obj.name);
            }

            // 2. Delete all objects if any exist
            if (objectsList.length > 0) {
                await this.minioClient.removeObjects(bucketName, objectsList);
                this.logger.log(`Emptied ${objectsList.length} objects from bucket '${bucketName}'`);
            }

            // 3. Delete the actual bucket
            await this.minioClient.removeBucket(bucketName);
            this.logger.log(`Bucket '${bucketName}' deleted successfully`);
        } catch (error) {
            this.logger.error(`Failed to delete bucket: ${error.message}`);
            throw new InternalServerErrorException(`Could not delete bucket: ${error.message}`);
        }
    }
}