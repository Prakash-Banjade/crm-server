import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionalInchargeDto } from './dto/create-regional-incharge.dto';
import { UpdateRegionalInchargeDto } from './dto/update-regional-incharge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionalIncharge } from './entities/regional-incharge.entity';
import { ILike, Repository } from 'typeorm';
import { QueryDto } from 'src/common/dto/query.dto';
import paginatedData from 'src/utils/paginatedData';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class RegionalInchargesService {
  constructor(
    @InjectRepository(RegionalIncharge) private readonly regionalInchargeRepo: Repository<RegionalIncharge>,
    private readonly minioService: MinioService,
  ) { }

  public readonly _imagePrefix = "regional-incharges";

  async create(dto: CreateRegionalInchargeDto) {
    const duplicate = await this.regionalInchargeRepo.findOne({
      where: [
        { email: ILike(dto.email) },
        { phone: ILike(dto.phone) }
      ],
      select: { id: true }
    });

    if (duplicate) throw new ConflictException('Duplicate email or phone');

    const profileImage = dto.profileImage
      ? await this.minioService.moveFileToPermanent(dto.profileImage, this._imagePrefix)
      : null;

    const regionalIncharge = this.regionalInchargeRepo.create({
      ...dto,
      profileImage,
    });
    await this.regionalInchargeRepo.save(regionalIncharge);

    return { message: 'Regional Incharge created' };
  }

  findAll(queryDto: QueryDto) {
    const queryBuilder = this.regionalInchargeRepo.createQueryBuilder('regionalIncharge');

    queryBuilder
      .orderBy("regionalIncharge.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take);

    if (queryDto.q) {
      queryBuilder.andWhere('regionalIncharge.name ILIKE :q', { q: `%${queryDto.q}%` });
    }

    queryBuilder.select([
      'regionalIncharge.id',
      'regionalIncharge.name',
      'regionalIncharge.email',
      'regionalIncharge.phone',
      'regionalIncharge.profileImage',
      'regionalIncharge.createdAt',
    ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existing = await this.regionalInchargeRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        createdAt: true,
      }
    });

    if (!existing) throw new NotFoundException('Regional Incharge not found');

    return existing;
  }

  async update(id: string, dto: UpdateRegionalInchargeDto) {
    const existing = await this.findOne(id);

    const duplicate = await this.regionalInchargeRepo.findOne({
      where: [
        { email: ILike(dto.email || existing.email) },
        { phone: ILike(dto.phone || existing.phone) }
      ],
      select: { id: true }
    });

    if (duplicate && duplicate.id !== id) throw new ConflictException('Duplicate email or phone');

    if (dto.profileImage && (dto.profileImage !== existing.profileImage || !existing.profileImage)) {
      existing.profileImage && await this.minioService.deleteFile(existing.profileImage);
      const profileImage = await this.minioService.moveFileToPermanent(dto.profileImage, this._imagePrefix);
      dto.profileImage = profileImage;
    }

    Object.assign(existing, dto);
    await this.regionalInchargeRepo.save(existing);

    return { message: 'Regional Incharge updated' };
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    await this.regionalInchargeRepo.delete(id);
    existing.profileImage && await this.minioService.deleteFile(existing.profileImage);

    return { message: 'Regional Incharge deleted' };
  }
}
