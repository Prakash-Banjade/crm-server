import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateCounselorDto } from './dto/create-counselor.dto';
import { UpdateCounselorDto } from './dto/update-counselor.dto';
import { Counselor } from './entities/counselor.entity';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { type FastifyRequest } from 'fastify';
import { BaseRepository } from 'src/common/repository/base-repository';
import { AuthUser, Role } from 'src/common/types';
import paginatedData from 'src/utils/paginatedData';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { UpdateAccountDto } from 'src/auth-system/accounts/dto/update-account.dto';
import { CounselorsQueryDto } from './dto/counselors-query.dto';

@Injectable({ scope: Scope.REQUEST })
export class CounselorsService extends BaseRepository {
  constructor(
    dataSource: DataSource, @Inject(REQUEST) req: FastifyRequest,
    private readonly accountsService: AccountsService
  ) {
    super(dataSource, req);
  }

  async create(dto: CreateCounselorDto, currentUser: AuthUser) {
    if (!currentUser.organizationId) throw new BadRequestException('Please select an organization');

    const createdBy = await this.accountsService.getOrThrow(currentUser.accountId);

    const newCounselor = this.getRepository(Counselor).create({
      ...dto,
      createdBy
    });

    const savedCounselor = this.getRepository(Counselor).create(newCounselor); // no need to save here

    // saving account with counselor entity automatically saves the counselor due to 'cascade: true' in account relation side
    await this.accountsService.createAccount({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      entity: savedCounselor,
      organizationId: currentUser.organizationId
    });

    return { message: "Counselor added successfully" };
  }

  async findAll(queryDto: CounselorsQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.getRepository(Counselor).createQueryBuilder('counselor')
      .orderBy(queryDto.sortBy, queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .leftJoin('counselor.account', 'account')
      .leftJoin('account.organization', 'organization')
      .leftJoin('counselor.createdBy', 'createdBy');

    if (queryDto.q) {
      queryBuilder.andWhere("account.lowerCasedFullName ILIKE :search", { search: `${queryDto.q}%` })
    }

    if (currentUser.organizationId) {
      queryBuilder.andWhere('organization.id = :organizationId', { organizationId: currentUser.organizationId })
    }

    queryBuilder.select([
      'counselor.id',
      'counselor.phoneNumber',
      'counselor.type',
      'counselor.seeAndReceiveApplicationNotifications',
      'counselor.exportApplicationToExcelFile',
      'counselor.showCommissionInfo',
      'counselor.reassignStudents',
      'counselor.hideSensitiveChatContent',
      'counselor.hideCommissionFromPromotionalContent',
      'counselor.createdAt',
      'account.id',
      'account.firstName',
      'account.lastName',
      'account.email',
      'organization.id',
      'organization.name',
      'createdBy.id',
      'createdBy.lowerCasedFullName',
    ])

    return paginatedData(queryDto, queryBuilder)
  }

  async findOne(id: string, currentUser: AuthUser) {
    const existingCounselor = await this.getRepository(Counselor).findOne({
      where: {
        id,
        account: { organization: { id: currentUser.role === Role.SUPER_ADMIN ? undefined : currentUser.organizationId } }
      },
      relations: {
        account: {
          organization: true
        }
      },
      select: {
        id: true,
        phoneNumber: true,
        type: true,
        seeAndReceiveApplicationNotifications: true,
        exportApplicationToExcelFile: true,
        showCommissionInfo: true,
        reassignStudents: true,
        hideSensitiveChatContent: true,
        hideCommissionFromPromotionalContent: true,
        account: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          organization: {
            id: true,
            name: true
          }
        }
      },
    });

    if (!existingCounselor) throw new NotFoundException('Counselor not found');

    return existingCounselor;
  }

  async update(id: string, dto: UpdateCounselorDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    Object.assign(existing, dto);

    await this.getRepository(Counselor).save(existing);

    // update associated account
    await this.accountsService.update(existing.account, new UpdateAccountDto({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
    }))

    return { message: "Counselor updated successfully" };
  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    await this.getRepository(Counselor).remove(existing);

    return { message: "Counselor deleted successfully" };
  }
}
