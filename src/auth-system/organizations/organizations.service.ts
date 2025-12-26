import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
    ) { }

    async create() {

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
}
