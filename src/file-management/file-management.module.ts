import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';
import { FilesModule } from './files/files.module';
import { MinioModule } from './minio/minio.module';

@Module({
    imports: [
        ImagesModule,
        FilesModule,
        MinioModule,
    ],
})
export class FileManagementModule { }
