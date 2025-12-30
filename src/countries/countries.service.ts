import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { ILike, Not, Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import { CountryQueryDto } from './dto/country-query.dto';
import paginatedData, { paginatedRawData } from 'src/utils/paginatedData';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly minioService: MinioService,
  ) { }

  public readonly _imagePrefix = "countries";

  async create(dto: CreateCountryDto) {
    const duplicate = await this.countryRepository.findOne({ where: { name: ILike(dto.name) }, select: { id: true } });

    if (duplicate) throw new ConflictException("Country already exists");

    const flag = await this.minioService.moveFileToPermanent(dto.flag, this._imagePrefix);

    const country = this.countryRepository.create({
      name: dto.name,
      flag,
      states: dto.states,
    });

    await this.countryRepository.save(country);

    return { message: "Country added successfully" };
  }

  findAll(queryDto: CountryQueryDto) {
    const queryBuilder = this.countryRepository.createQueryBuilder("country")
      .orderBy(queryDto.sortBy, queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take);

    if (queryDto.q) {
      queryBuilder.andWhere("country.name ILIKE :q", { q: `${queryDto.q}%` });
    }

    queryBuilder.select([
      "country.id",
      "country.name",
      "country.flag",
      "country.states",
      "country.createdAt",
    ]);

    return paginatedData(queryDto, queryBuilder);
  }

  getOptions(queryDto: CountryQueryDto) {
    const queryBuilder = this.countryRepository.createQueryBuilder("country")
      .orderBy(queryDto.sortBy, queryDto.order)
      .offset(queryDto.skip)
      .limit(queryDto.take);

    if (queryDto.q) {
      queryBuilder.andWhere("country.name ILIKE :q", { q: `${queryDto.q}%` });
    }

    queryBuilder.select([
      "country.id as value",
      "country.name as label",
      "country.flag as image",
      "country.states as states",
    ]);

    return paginatedRawData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const country = await this.countryRepository.findOne({
      where: { id },
      select: { id: true, name: true, states: true, createdAt: true }
    });

    if (!country) throw new NotFoundException("Country not found");

    return country;
  }

  async update(id: string, dto: UpdateCountryDto) {
    const existing = await this.findOne(id);

    if (dto.name) {
      const duplicate = await this.countryRepository.findOne({
        where: { name: ILike(dto.name), id: Not(id) },
        select: { id: true }
      });

      if (duplicate) throw new ConflictException("Country already exists");
    }

    if (dto.flag && dto.flag !== existing.flag) {
      await this.minioService.deleteFile(existing.flag);
      const flag = await this.minioService.moveFileToPermanent(dto.flag, this._imagePrefix);
      dto.flag = flag;
    }

    Object.assign(existing, dto);

    await this.countryRepository.save(existing);

    return { message: "Country updated successfully" };
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    await this.countryRepository.delete(id);
    await this.minioService.deleteFile(existing.flag);

    return { message: "Country deleted successfully" };
  }
}
