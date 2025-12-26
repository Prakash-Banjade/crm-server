import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './auth-system/users/entities/user.entity';
import { Account } from './auth-system/accounts/entities/account.entity';
import { Organization } from './auth-system/organizations/entities/organization.entity';
import { PASSWORD_SALT_COUNT } from './common/CONSTANTS';
import { Role } from './common/types';
import bcrypt from 'bcryptjs';
import { defaultBankingDetails } from './auth-system/organizations/interface';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async seed() {
    if (this.configService.get('NODE_ENV') === 'production') return;

    const userRepo = this.dataSource.getRepository(User);
    const accountRepo = this.dataSource.getRepository(Account);
    const organizationRepo = this.dataSource.getRepository(Organization);

    // Create default organization
    const organization = organizationRepo.create({
      name: "Default",
      email: "default@gmail.com",
      bankingDetails: defaultBankingDetails,
    });
    await organizationRepo.save(organization);

    // Create super admin
    const account = accountRepo.create({
      email: "prakash@gmail.com",
      password: "Prakash@221",
      firstName: "Prakash",
      lastName: "Banjade",
      role: Role.SUPER_ADMIN,
      prevPasswords: [bcrypt.hashSync("Prakash@221", PASSWORD_SALT_COUNT)],
      user: userRepo.create({}),
      verifiedAt: new Date(),
    })
    account.setLowerCasedFullName();
    await accountRepo.save(account);

    return '✅ Seeding completed';
  }
}
