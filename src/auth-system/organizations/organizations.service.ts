import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { FindOptionsSelect, ILike, Repository } from 'typeorm';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { AuthUser, Role } from 'src/common/types';
import { AccountsService } from '../accounts/accounts.service';
import { paginatedRawData } from 'src/utils/paginatedData';
import { OrganizationQueryDto } from './dto/organization-query.dto';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class OrganizationsService {

    constructor(
        @InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
        private readonly accountsService: AccountsService,
        private readonly minioService: MinioService
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

        const [logo, panCertificate, registrationDocument] = await Promise.all([
            dto.logo ? this.minioService.moveFileToPermanent(dto.logo) : null,
            dto.panCertificate ? this.minioService.moveFileToPermanent(dto.panCertificate) : null,
            dto.registrationDocument ? this.minioService.moveFileToPermanent(dto.registrationDocument) : null,
        ]);

        const newOrganization = this.organizationRepo.create({
            ...dto,
            logo,
            panCertificate,
            registrationDocument,
            createdBy: account,
        });

        await this.organizationRepo.save(newOrganization)

        return { message: 'Organization created successfully' }
    }

    async findAll(queryDto: OrganizationQueryDto, currentUser: AuthUser) {
        const createdById = currentUser.role === Role.SUPER_ADMIN
            ? queryDto.createdById
            : currentUser.accountId;

        const queryBuilder = this.organizationRepo.createQueryBuilder('organization')
            .orderBy(queryDto.sortBy, queryDto.order)
            .offset(queryDto.skip)
            .limit(queryDto.take)
            .leftJoin('organization.createdBy', 'createdBy');

        if (createdById) {
            queryBuilder.andWhere('createdBy.id = :createdById', { createdById });
        }

        queryBuilder.select([
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

        return paginatedRawData(queryDto, queryBuilder);
    }

    async findOne(id: string, select?: FindOptionsSelect<Organization>) {
        const existing = await this.organizationRepo.findOne({
            where: { id },
            select: select ?? {
                id: true,
                name: true,
                contactNumber: true,
                email: true,
                concerningPersonName: true,
                createdAt: true,
                updatedAt: true,
                blacklistedAt: true,
                createdBy: true,
                logo: true,
                panCertificate: true,
                registrationDocument: true,
                address: true,
                bankingDetails: true,
                brandColorPrimary: true,
                brandColorSecondary: true,
                websiteUrl: true,
                panNumber: true,
                vatNumber: true,
            }
        });

        if (!existing) throw new NotFoundException('Organization not found')

        return existing;
    }

    getOptions(queryDto: OrganizationQueryDto, currentUser: AuthUser) {
        const createdById = currentUser.role === Role.SUPER_ADMIN
            ? queryDto.createdById
            : currentUser.accountId;

        const queryBuilder = this.organizationRepo.createQueryBuilder('organization')
            .orderBy("organization.createdAt", queryDto.order)
            .leftJoin('organization.createdBy', 'createdBy')
            .select([
                "organization.id as value",
                "organization.name as label"
            ])

        if (createdById) {
            queryBuilder.andWhere('createdBy.id = :createdById', { createdById });
        }

        return queryBuilder.getRawMany();
    }

    async update(id: string, dto: UpdateOrganizationDto) {
        const existing = await this.organizationRepo.findOne({
            where: { id },
            select: { id: true, name: true, email: true, logo: true, panCertificate: true, registrationDocument: true }
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

        if (dto.logo && (dto.logo !== existing.logo || !existing.logo)) {
            existing.logo && await this.minioService.deleteFile(existing.logo);
            const logo = await this.minioService.moveFileToPermanent(dto.logo);
            dto.logo = logo;
        }

        if (dto.panCertificate && (dto.panCertificate !== existing.panCertificate || !existing.panCertificate)) {
            existing.panCertificate && await this.minioService.deleteFile(existing.panCertificate);
            const logo = await this.minioService.moveFileToPermanent(dto.panCertificate);
            dto.panCertificate = logo;
        }

        if (dto.registrationDocument && (dto.registrationDocument !== existing.registrationDocument || !existing.registrationDocument)) {
            existing.registrationDocument && await this.minioService.deleteFile(existing.registrationDocument);
            const logo = await this.minioService.moveFileToPermanent(dto.registrationDocument);
            dto.registrationDocument = logo;
        }

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
        const existing = await this.organizationRepo.findOne({ where: { id }, select: { id: true, logo: true, panCertificate: true, registrationDocument: true } });
        if (!existing) throw new NotFoundException('Organization not found')

        // delete files from minio
        await Promise.all([
            existing.logo && this.minioService.deleteFile(existing.logo),
            existing.panCertificate && this.minioService.deleteFile(existing.panCertificate),
            existing.registrationDocument && this.minioService.deleteFile(existing.registrationDocument),
        ])

        // delete organization from db
        await this.organizationRepo.delete({ id });

        return { message: 'Organization deleted' }
    }
}
