import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    AccountsModule,
    OrganizationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
