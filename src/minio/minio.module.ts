import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioAsyncModuleOptions } from './minio.interface';
import { MINIO_OPTIONS } from './minio.constants';

@Global() // Makes the service available everywhere without importing MinioModule again
@Module({})
export class MinioModule {
    static registerAsync(options: MinioAsyncModuleOptions): DynamicModule {
        const asyncProviders = this.createAsyncProviders(options);

        return {
            module: MinioModule,
            imports: options.imports || [],
            providers: [
                ...asyncProviders,
                MinioService,
            ],
            exports: [MinioService],
        };
    }

    private static createAsyncProviders(options: MinioAsyncModuleOptions): Provider[] {
        return [
            {
                provide: MINIO_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            },
        ];
    }
}