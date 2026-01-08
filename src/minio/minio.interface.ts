import { ModuleMetadata } from '@nestjs/common';
import { ClientOptions } from 'minio';

export interface MinioModuleOptions extends ClientOptions {
    bucket: string;
}

export interface MinioAsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => Promise<MinioModuleOptions> | MinioModuleOptions;
    inject?: any[];
}

export interface BufferedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer | string;
}

export interface UploadedFileResponse {
    filename: string;
    url: string;
    originalName: string;
}