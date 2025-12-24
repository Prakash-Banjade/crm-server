import { Injectable } from "@nestjs/common";
import { InjectMinio } from "./minio.decorator";
import * as Minio from 'minio';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MinioService {
    private readonly _bucketName: string;

    constructor(
        @InjectMinio() private readonly minioClient: Minio.Client,
        private readonly configService: ConfigService
    ) {
        this._bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET_PRIMARY')!;
    }

}