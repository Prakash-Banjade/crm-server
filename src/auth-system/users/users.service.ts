import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Brackets, DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from 'src/common/repository/base-repository';
import { type FastifyRequest } from 'fastify';
import { UsersQueryDto } from './dto/user-query.dto';
import { paginatedRawData } from 'src/utils/paginatedData';
import { User } from './entities/user.entity';
import { userSelectCols } from './helpers/user-select-cols';
import { AuthUser, Role } from 'src/common/types';
import { Account } from '../accounts/entities/account.entity';
import { ImagesService } from 'src/file-management/images/images.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AccountsService } from '../accounts/accounts.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends BaseRepository {
  constructor(
    datasource: DataSource, @Inject(REQUEST) req: FastifyRequest,
    private readonly imagesService: ImagesService,
    private readonly accountsService: AccountsService,
    private readonly organizationsService: OrganizationsService,
  ) { super(datasource, req) }

  async create(createUserDto: CreateUserDto) {
    const organization = await this.organizationsService.getOrganization(createUserDto.organizationId, { id: true });

    const account = await this.accountsService.createAdminAccount(organization, {
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName
    });

    const user = this.getRepository(User).create({
      account,
    });

    await this.getRepository(User).save(user);

    return { message: 'Admin created' }
  }

  async findAll(queryDto: UsersQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.getRepository(User).createQueryBuilder('user');

    const organizationId = currentUser.role === Role.SUPER_ADMIN ? queryDto.organizationId : currentUser.organizationId;

    queryBuilder
      .orderBy("user.createdAt", queryDto.order)
      .offset(queryDto.skip)
      .limit(queryDto.take)
      .leftJoin("user.account", "account")
      .leftJoin("account.organization", "organization")
      .leftJoin("account.profileImage", "profileImage")
      .where(new Brackets(qb => {
        queryDto.q && qb.andWhere("account.lowerCasedFullName ILIKE :search", { search: `${queryDto.q}%` });
        organizationId && qb.andWhere('organization.id = :organizationId', { organizationId });
      }))
      .select([
        'user.id as userId',
        'profileImage.url as "profileImageUrl"',
        'account.lowerCasedFullName as "fullName"',
        'account.email as email',
        'account.role as role',
        'user.createdAt as "createdAt"',
      ])

    return paginatedRawData(queryDto, queryBuilder);
  }

  async findOne(id: string): Promise<User> {
    const existing = await this.getRepository(User).findOne({
      where: { id },
      relations: {
        account: true,
      },
      select: userSelectCols,
    })
    if (!existing) throw new NotFoundException('User not found');

    return existing;
  }

  async getUserByAccountId(accountId: string): Promise<User> {
    const user = await this.getRepository(User).findOne({
      where: {
        account: { id: accountId }
      },
      relations: {
        account: true
      },
      select: userSelectCols,
    })
    if (!user) throw new NotFoundException('User not found')

    return user;
  }

  async myDetails(currentUser: AuthUser) {
    return this.getRepository(Account).createQueryBuilder('account')
      .leftJoin('account.profileImage', 'profileImage')
      .leftJoin('account.organization', 'organization')
      .where('account.id = :id', { id: currentUser.accountId })
      .select([
        'account.id as id',
        'account.email as email',
        'account.firstName as "firstName"',
        'account.lastName as "lastName"',
        'account.role as role',
        'profileImage.url as "profileImageUrl"',
        'organization.name as "organizationName"',
      ])
      .getRawOne();
  }

  async update(updateUserDto: UpdateUserDto, currentUser: AuthUser) {
    const existingUser = await this.getUserByAccountId(currentUser.accountId);
    const existingAccount = await this.getRepository(Account).findOne({
      where: { id: currentUser.accountId },
      relations: { profileImage: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: { id: true },
        verifiedAt: true
      }
    });
    if (!existingAccount) throw new InternalServerErrorException('Unable to update the associated profile. Please contact support.');

    const profileImage = (updateUserDto.profileImageId && (existingAccount.profileImage?.id !== updateUserDto.profileImageId || !existingAccount.profileImage))
      ? await this.imagesService.findOne(updateUserDto.profileImageId)
      : existingAccount.profileImage;

    // update user
    Object.assign(existingUser, {
      ...updateUserDto,
    });

    await this.getRepository(User).save(existingUser);

    Object.assign(existingAccount, {
      firstName: updateUserDto.firstName || existingAccount.firstName,
      lastName: updateUserDto.lastName || existingAccount.lastName,
      profileImage
    })

    await this.getRepository(Account).save(existingAccount);

    return { message: 'Profile Updated' }
  }

  async delete(id: string) {
    const account = await this.getRepository(Account).findOne({
      where: { user: { id } },
      select: { id: true }
    });
    if (!account) throw new NotFoundException('User not found');

    // delete the account
    await this.getRepository(Account).remove(account);

    return { message: 'Admin removed' }
  }
}
