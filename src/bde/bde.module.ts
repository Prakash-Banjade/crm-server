import { Module } from '@nestjs/common';
import { BdeService } from './bde.service';
import { BdeController } from './bde.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bde } from './entities/bde.entity';
import { AccountsModule } from 'src/auth-system/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bde]),
    AccountsModule,
  ],
  controllers: [BdeController],
  providers: [BdeService],
})
export class BdeModule { }
