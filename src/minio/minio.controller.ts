import { BadRequestException, Controller, Delete, Post, Query, Req } from '@nestjs/common';
import { MinioService } from './minio.service';
import { type FastifyRequest } from 'fastify';
import { BufferedFile } from './minio.interface';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('files')
@ApiBearerAuth()
@ApiTags('Files')
export class MinioController {
    constructor(private readonly minioService: MinioService) { }

    @Post('upload')
    @ApiOperation({ description: 'Upload files to MinIO' })
    @ApiConsumes('multipart/form-data')
    async uploadFiles(@Req() req: FastifyRequest) {
        // Check if the request is multipart
        if (!req.isMultipart()) {
            throw new BadRequestException('Request is not multipart');
        }

        const files: BufferedFile[] = [];

        // Iterate over the multipart parts
        for await (const part of req.parts()) {
            if (part.type === 'file') {
                // IMPORTANT: Buffer the stream into memory 
                // For extremely large files (500MB+), you should pipe the stream directly to MinIO, 
                // but for standard uploads, buffering allows for easier handling.
                const buffer = await part.toBuffer();

                files.push({
                    fieldname: part.fieldname,
                    originalname: part.filename,
                    encoding: part.encoding,
                    mimetype: part.mimetype,
                    buffer: buffer,
                    size: buffer.length,
                });
            }
        }

        if (files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        return await this.minioService.uploadFiles(files);
    }

    @Delete()
    @ApiOperation({ description: 'Delete files from MinIO' })
    async deleteFiles(@Query("files") files: string[]) {
        await this.minioService.deleteFiles(files);
        return { message: 'Files deleted successfully' };
    }
}
