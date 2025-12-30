import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { ILike, Not, Repository } from 'typeorm';
import paginatedData, { paginatedRawData } from 'src/utils/paginatedData';
import { UniversityQueryDto } from './dto/university-query.dto';
import { CountriesService } from 'src/countries/countries.service';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
    private readonly countriesService: CountriesService,
  ) { }

  async create(dto: CreateUniversityDto) {
    const duplicate = await this.universityRepository.findOne({ where: { name: ILike(dto.name) }, select: { id: true } });

    if (duplicate) throw new ConflictException("University already exists");

    const country = await this.countriesService.findOne(dto.countryId);

    // check if state is valid
    if (!country.states.includes(dto.state)) throw new BadRequestException("Invalid state");

    const university = this.universityRepository.create({
      ...dto,
      country,
    });

    await this.universityRepository.save(university);

    return { message: "University added successfully" };
  }

  findAll(queryDto: UniversityQueryDto) {
    const queryBuilder = this.universityRepository.createQueryBuilder("university")
      .orderBy(queryDto.sortBy, queryDto.order)
      .leftJoin("university.country", "country")
      .skip(queryDto.skip)
      .take(queryDto.take);

    if (queryDto.q) {
      queryBuilder.andWhere("university.name ILIKE :q", { q: `${queryDto.q}%` });
    }

    queryBuilder.select([
      "university.id",
      "university.name",
      "university.description",
      "country.id",
      "country.name",
      "country.states",
      "country.flag",
      "university.state",
      "university.commission",
      "university.createdAt",
    ]);

    return paginatedData(queryDto, queryBuilder);
  }

  getOptions(queryDto: UniversityQueryDto) {
    const queryBuilder = this.universityRepository.createQueryBuilder("university")
      .orderBy(queryDto.sortBy, queryDto.order)
      .offset(queryDto.skip)
      .limit(queryDto.take);

    if (queryDto.q) {
      queryBuilder.andWhere("university.name ILIKE :q", { q: `${queryDto.q}%` });
    }

    queryBuilder.select([
      "university.id as value",
      "university.name as label",
    ]);

    return paginatedRawData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const university = await this.universityRepository.findOne({
      where: { id },
      relations: {
        country: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        state: true,
        commission: true,
        createdAt: true,
        country: {
          id: true,
          name: true,
        }
      }
    });

    if (!university) throw new NotFoundException("University not found");

    return university;
  }

  async update(id: string, dto: UpdateUniversityDto) {
    const existing = await this.universityRepository.findOne({
      where: { id },
      relations: { country: true },
      select: {
        id: true,
        country: { id: true, states: true }
      }
    });

    if (!existing) throw new NotFoundException("University not found");

    if (dto.name) {
      const duplicate = await this.universityRepository.findOne({
        where: { name: ILike(dto.name), id: Not(id) },
        select: { id: true }
      });

      if (duplicate) throw new ConflictException("University already exists");
    }

    const country = (dto.countryId && dto.countryId !== existing.country.id)
      ? await this.countriesService.findOne(dto.countryId)
      : existing.country;

    // check if state is valid
    if (!country.states.includes(dto.state || existing.state)) throw new BadRequestException("Invalid state");

    Object.assign(existing, {
      ...dto,
      country,
    });

    await this.universityRepository.save(existing);

    return { message: "University updated successfully" };
  }

  async remove(id: string) {
    await this.universityRepository.delete(id);

    return { message: "University deleted successfully" };
  }
}
