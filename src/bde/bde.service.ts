import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common';
import { CreateBdeDto } from './dto/create-bde.dto';
import { UpdateBdeDto } from './dto/update-bde.dto';
import { Bde } from './entities/bde.entity';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { type FastifyRequest } from 'fastify';
import { BaseRepository } from 'src/common/repository/base-repository';
import paginatedData from 'src/utils/paginatedData';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { UpdateAccountDto } from 'src/auth-system/accounts/dto/update-account.dto';
import { Organization } from 'src/auth-system/organizations/entities/organization.entity';
import { DEFAULT_ORGANIZATION_NAME } from 'src/common/CONSTANTS';
import { BdesQueryDto } from './dto/bdes-query.dto';
import { Account } from 'src/auth-system/accounts/entities/account.entity';

@Injectable({ scope: Scope.REQUEST })
export class BdeService extends BaseRepository {
  constructor(
    dataSource: DataSource, @Inject(REQUEST) req: FastifyRequest,
    private readonly accountsService: AccountsService
  ) {
    super(dataSource, req);
  }

  async create(dto: CreateBdeDto) {
    const newBde = this.getRepository(Bde).create({
      ...dto,
    });

    const savedBde = this.getRepository(Bde).create(newBde); // no need to save here

    // bde are assigned to default organization as super_admin
    const defaultOrganization = await this.getRepository(Organization).findOne({ where: { name: DEFAULT_ORGANIZATION_NAME }, select: { id: true } });
    if (!defaultOrganization) throw new InternalServerErrorException("Default organization not found");

    // saving account with bde entity automatically saves the bde due to 'cascade: true' in account relation side
    await this.accountsService.createAccount({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      entity: savedBde,
      organizationId: defaultOrganization.id
    });

    return { message: "BDE added successfully" };
  }

  async findAll(queryDto: BdesQueryDto) {
    const queryBuilder = this.getRepository(Bde).createQueryBuilder('bde')
      .orderBy(queryDto.sortBy, queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .leftJoin('bde.account', 'account')

    if (queryDto.q) {
      queryBuilder.andWhere("account.lowerCasedFullName ILIKE :search", { search: `${queryDto.q}%` })
    }

    queryBuilder.select([
      'bde.id',
      'bde.phoneNumber',
      'bde.createdAt',
      'account.id',
      'account.firstName',
      'account.lastName',
      'account.email',
    ])

    return paginatedData(queryDto, queryBuilder)
  }

  async findOne(id: string) {
    const existingBde = await this.getRepository(Bde).findOne({
      where: { id },
      relations: {
        account: true,
      },
      select: {
        id: true,
        phoneNumber: true,
        account: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      },
    });

    if (!existingBde) throw new NotFoundException('BDE not found');

    return existingBde;
  }

  async update(id: string, dto: UpdateBdeDto) {
    const existing = await this.findOne(id);

    Object.assign(existing, dto);

    await this.getRepository(Bde).save(existing);

    // update associated account
    await this.accountsService.update(existing.account, new UpdateAccountDto({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
    }))

    return { message: "BDE updated successfully" };
  }

  async remove(id: string) {
    await this.getRepository(Account).delete({
      bde: { id }
    }); // deleting account auto deletes bde

    return { message: "BDE deleted successfully" };
  }
}
