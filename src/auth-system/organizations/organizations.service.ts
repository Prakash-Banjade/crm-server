import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { FindOptionsSelect, ILike, Repository } from 'typeorm';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { AuthUser } from 'src/common/types';
import { AccountsService } from '../accounts/accounts.service';
import { paginatedRawData } from 'src/utils/paginatedData';
import { OrganizationQueryDto } from './dto/organization-query.dto';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
        private readonly accountsService: AccountsService,
    ) { }

    async create(dto: CreateOrganizationDto, currentUser: AuthUser) {
        const existingWithSameName = await this.organizationRepo.findOne({
            where: [
                { name: ILike(dto.name) },
                { email: ILike(dto.email) }
            ]
        });
        if (existingWithSameName) throw new ConflictException('Duplicate Organization name or email found')

        const account = await this.accountsService.getOrThrow(currentUser.accountId);

        const newOrganization = this.organizationRepo.create({
            ...dto,
            createdBy: account,
        });

        await this.organizationRepo.save(newOrganization)

        return { message: 'Organization created successfully' }
    }

    async findAll(queryDto: OrganizationQueryDto) {
        const querybuilder = this.organizationRepo.createQueryBuilder('organization')
            .orderBy(queryDto.sortBy, queryDto.order)
            .offset(queryDto.skip)
            .limit(queryDto.take)
            .leftJoin('organization.createdBy', 'createdBy')
            .select([
                'organization.id as id',
                'organization.name as name',
                'organization.contactNumber as "contactNumber"',
                'organization.email as email',
                'organization.concerningPersonName as "concerningPersonName"',
                'createdBy.lowerCasedFullName as "createdBy"',
                'organization.blacklistedAt as "blacklistedAt"',
                'organization.createdAt as "createdAt"',
                'organization.updatedAt as "updatedAt"',
            ]);

        return paginatedRawData(queryDto, querybuilder);
    }

    async findOne(id: string) {
        const existing = await this.organizationRepo.findOne({ where: { id } });
        if (!existing) throw new NotFoundException('Organization not found')

        return existing;
    }

    getOptions(queryDto: QueryDto) {
        return this.organizationRepo.createQueryBuilder('organization')
            .orderBy("organization.createdAt", queryDto.order)
            .select([
                "organization.id as value",
                "organization.name as label"
            ])
            .getRawMany();
    }

    async update(id: string, dto: UpdateOrganizationDto) {
        const existing = await this.organizationRepo.findOne({
            where: { id },
            select: { id: true, name: true, email: true }
        });
        if (!existing) throw new NotFoundException('Organization not found')

        // check if name or email is taken
        const existingWithSameName = await this.organizationRepo.findOne({
            where: [
                { name: ILike(dto.name || existing.name) },
                { email: ILike(dto.email || existing.email) }
            ],
            select: { id: true }
        });
        if (existingWithSameName && existingWithSameName.id !== id) throw new ConflictException('Duplicate Organization name or email found')

        Object.assign(existing, dto);

        await this.organizationRepo.save(existing);
        return { message: 'Organization updated' }
    }

    async toggleBlock(id: string) {
        const existing = await this.organizationRepo.findOne({ where: { id }, select: { id: true, blacklistedAt: true } });
        if (!existing) throw new NotFoundException('Organization not found')

        if (existing.blacklistedAt) {
            existing.blacklistedAt = null;
            await this.organizationRepo.save(existing);
            return { message: 'Organization unblocked' }
        }

        existing.blacklistedAt = new Date();
        await this.organizationRepo.save(existing);
        return { message: 'Organization blocked' }
    }

    async getOrganization(id: string, select: FindOptionsSelect<Organization>) {
        const existing = await this.organizationRepo.findOne({ where: { id }, select });
        if (!existing) throw new NotFoundException('Organization not found')

        return existing;
    }

    async delete(id: string) {
        await this.organizationRepo.delete({ id });
        return { message: 'Organization deleted' }
    }
}
