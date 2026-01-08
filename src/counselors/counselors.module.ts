import { Module } from '@nestjs/common';
import { CounselorsService } from './counselors.service';
import { CounselorsController } from './counselors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counselor } from './entities/counselor.entity';
import { AccountsModule } from 'src/auth-system/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Counselor
    ]),
    AccountsModule,
  ],
  controllers: [CounselorsController],
  providers: [CounselorsService],
})
export class CounselorsModule { }
