import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { DataSource, FindOptionsSelect, Not } from 'typeorm';
import { Account } from './entities/account.entity';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from 'src/common/repository/base-repository';
import { Role } from 'src/common/types';
import { generateRandomPassword } from 'src/utils/generatePassword';
import bcrypt from "bcryptjs";
import { DEFAULT_ORGANIZATION_NAME, PASSWORD_SALT_COUNT } from 'src/common/CONSTANTS';
import { AuthHelper } from '../auth/helpers/auth.helper';
import { RefreshTokenService } from '../auth/helpers/refresh-tokens.service';
import { LoginDevice } from './entities/login-devices.entity';
import { UpdateAccountDto } from './dto/update-account.dto';
import { WebAuthnCredential } from '../webAuthn/entities/webAuthnCredential.entity';
import { type FastifyRequest } from 'fastify';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { Organization } from '../organizations/entities/organization.entity';
import { Counselor } from 'src/counselors/entities/counselor.entity';
import { Bde } from 'src/bde/entities/bde.entity';

@Injectable({ scope: Scope.REQUEST })
export class AccountsService extends BaseRepository {
  constructor(
    dataSource: DataSource, @Inject(REQUEST) req: FastifyRequest,
    private readonly authHelper: AuthHelper,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly utilitiesService: UtilitiesService,
  ) { super(dataSource, req) }

  async createAccount({
    entity,
    firstName,
    lastName,
    email,
    organizationId
  }: {
    entity: Counselor | Bde,
    firstName: string,
    lastName: string,
    email: string,
    organizationId: string
  }) {
    // check for existing
    const existingAccount = await this.getRepository(Account).findOne({ where: { email }, select: { id: true } });
    if (existingAccount) throw new ConflictException({
      message: 'Duplicate email. Please use different email.',
      field: 'email',
    });

    const key = entity instanceof Counselor ? Role.COUNSELOR : Role.BDE;

    const organization = await this.getRepository(Organization).findOne({ where: { id: organizationId }, select: { id: true, name: true } })
    if (!organization) throw new NotFoundException('Organization not found')

    // only bde user can be added to default organization
    if (key !== Role.BDE && organization.name === DEFAULT_ORGANIZATION_NAME) throw new BadRequestException("Cannot add user to default organization. Please choose another organization.")

    // create account by generating random password
    const password = generateRandomPassword();


    const account = this.getRepository<Account>(Account).create({
      email,
      firstName,
      lastName,
      role: key,
      [key]: entity,
      password,
      prevPasswords: [bcrypt.hashSync(password, PASSWORD_SALT_COUNT)],
      organization,
    });

    account.setLowerCasedFullName();

    const savedAccount = await this.getRepository(Account).save(account);

    // send account confirmation mail to the user
    return this.authHelper.sendEmailConfirmation(savedAccount);
  }

  async createAdminAccount(organization: Organization, dto: { firstName: string, lastName: string, email: string }) {
    const existingAccount = await this.getRepository(Account).findOne({ where: { email: dto.email }, select: { id: true } });
    if (existingAccount) throw new ConflictException({
      message: 'Duplicate email. Please use different email.',
      field: 'email',
    });

    const password = generateRandomPassword();

    const account = this.getRepository<Account>(Account).create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.ADMIN,
      password,
      prevPasswords: [bcrypt.hashSync(password, PASSWORD_SALT_COUNT)],
      organization,
    });

    account.setLowerCasedFullName();

    const createdAccount = await this.getRepository(Account).save(account);

    await this.authHelper.sendEmailConfirmation(createdAccount);

    return createdAccount
  }

  async update(account: Account, dto: UpdateAccountDto) {
    const withDuplicateEmail = await this.getRepository(Account).findOne({ where: { id: Not(account.id), email: dto.email }, select: { id: true } })
    if (withDuplicateEmail) throw new ConflictException({
      message: 'Duplicate email. Please use different email.',
      field: 'email',
    })

    Object.assign(account, dto)

    account.setLowerCasedFullName();

    await this.getRepository(Account).save(account);
  }

  async getDevices() {
    const { accountId } = this.utilitiesService.getCurrentUser();

    const loginDevices = await this.getRepository(LoginDevice).find({
      where: { account: { id: accountId } },
      order: { lastLogin: 'DESC' },
      select: { id: true, deviceId: true, ua: true, firstLogin: true, lastActivityRecord: true },
    });

    this.refreshTokenService.init({});
    const tokens = await this.refreshTokenService.getAll(); // this will return all the refresh tokens of the current user

    return loginDevices
      .map((device: any) => ({
        ...device,
        signedIn: tokens.some((token) => token.deviceId === device.deviceId),
      }));
  }

  async revokeDevice(deviceId: string) {
    const { email, deviceId: currentDeviceId, accountId } = this.utilitiesService.getCurrentUser();

    if (deviceId === currentDeviceId) throw new BadRequestException('Cannot revoke current device');

    const device = await this.getRepository(LoginDevice).findOne({
      where: { deviceId, account: { id: accountId } },
      select: { id: true },
    });

    if (device) {
      await this.getRepository(LoginDevice).save({
        ...device,
        isTrusted: false,
      });
    }

    this.refreshTokenService.init({
      deviceId,
      email: email
    });
    await this.refreshTokenService.remove();

    // remove credentials
    await this.getRepository(WebAuthnCredential).delete({ account: { id: accountId } });

    return { message: 'Device signed out' };
  }

  async get2FaStatus() {
    const { accountId } = this.utilitiesService.getCurrentUser();

    const account = await this.getRepository(Account).findOne({
      where: { id: accountId },
      select: { id: true, twoFaEnabledAt: true }
    });

    if (!account) throw new NotFoundException('No associated account found');

    return {
      twoFaEnabledAt: account.twoFaEnabledAt
    }
  }

  async toggle2Fa(enable2Fa: boolean) {
    const { accountId } = this.utilitiesService.getCurrentUser();

    const account = await this.getRepository(Account).findOne({
      where: { id: accountId },
      select: { id: true, verifiedAt: true, twoFaEnabledAt: true }
    });

    if (!account) throw new NotFoundException('No associated account found');

    account.twoFaEnabledAt = enable2Fa ? new Date() : null;

    await this.getRepository(Account).save(account);

    return;
  }

  async getOrThrow(
    id: string,
    select: FindOptionsSelect<Account> = { id: true }
  ) {
    const account = await this.getRepository(Account).findOne({ where: { id }, select });
    if (!account) throw new NotFoundException('No associated account found');
    return account;
  }
}
