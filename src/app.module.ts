import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './common/guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './db/database.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { AuthSystemModule } from './auth-system/auth-system.module';
import { EnvModule } from './env/env.module';
import { MailModule } from './mail/mail.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MinioModule } from './minio/minio.module';
import { RegionalInchargesModule } from './regional-incharges/regional-incharges.module';
import { CountriesModule } from './countries/countries.module';
import { UniversitiesModule } from './universities/universities.module';
import { CourseSystemModule } from './course-system/course-system.module';
import { BookingsModule } from './bookings/bookings.module';
import { LearningResourcesModule } from './learning-resources/learning-resources.module';
import { CounselorsModule } from './counselors/counselors.module';
import { BdeModule } from './bde/bde.module';
import { StudentsModule } from './students/students.module';
import { ApplicationSystemModule } from './application-system/application-system.module';
import { AbilitiesGuard } from './common/guards/abilities.guard';
import { CaslModule } from './auth-system/casl/casl.module';
import { NotificationSystemModule } from './notification-system/notification-system.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
      isGlobal: true,
      fileSystemStoragePath: 'public',
      autoDeleteFile: false,
      cleanupAfterSuccessHandle: false, // !important
    }),
    ThrottlerModule.forRoot([{
      ttl: 1000, // 5 req per second
      limit: 5,
    }]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [createKeyv(configService.getOrThrow('REDIS_URL'))],
        };
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'wwwroot'),
    }),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
        port: parseInt(configService.getOrThrow('MINIO_PORT')),
        useSSL: configService.get('MINIO_USE_SSL') === 'true',
        accessKey: configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretKey: configService.getOrThrow('MINIO_SECRET_KEY'),
        bucket: configService.getOrThrow('MINIO_BUCKET_PRIMARY'),
      }),
    }),
    UtilitiesModule,
    AuthSystemModule,
    CaslModule,
    MailModule,
    RegionalInchargesModule,
    CountriesModule,
    UniversitiesModule,
    CourseSystemModule,
    BookingsModule,
    LearningResourcesModule,
    CounselorsModule,
    BdeModule,
    StudentsModule,
    ApplicationSystemModule,
    NotificationSystemModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
  ],
})
export class AppModule { }
