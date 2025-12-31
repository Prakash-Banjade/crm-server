import { Injectable, NotFoundException } from "@nestjs/common";
import { Brackets, FindOptionsSelect, Repository } from "typeorm";
import { LearningResource } from "./entities/learning-resource.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateLearningResourceDto } from "./dto/create-learning-resource.dto";
import { paginatedRawData } from "src/utils/paginatedData";
import { LearningResourceQueryDto } from "./dto/learning-resource-query.dto";
import { UpdateLearningResourceDto } from "./dto/update-learning-resource.dto";
import { MinioService } from "src/minio/minio.service";

@Injectable()
export class LearningResourcesService {
  constructor(
    @InjectRepository(LearningResource) private readonly learningResourcesRepo: Repository<LearningResource>,
    private readonly minioService: MinioService,
  ) { }

  async create(dto: CreateLearningResourceDto) {
    const parent = dto.parentId
      ? await this.learningResourcesRepo.findOne({ where: { id: dto.parentId }, select: { id: true } })
      : null;

    if (dto.parentId && !parent) throw new NotFoundException('Parent resource not found')

    const files = await Promise.all(dto.files?.map(file => this.minioService.moveFileToPermanent(file)) || [])

    const learningResource = this.learningResourcesRepo.create({
      ...dto,
      parent,
      files,
    });

    await this.learningResourcesRepo.save(learningResource);

    return { message: 'Resource created' }
  }

  async findAll(queryDto: LearningResourceQueryDto) {
    const queryBuilder = this.learningResourcesRepo.createQueryBuilder('lr')
      .orderBy('lr.createdAt', queryDto.order)
      .offset(queryDto.skip)
      .limit(queryDto.take)
      .where(new Brackets(qb => {
        queryDto.q && qb.andWhere('lr.title ILIKE :search', { search: `${queryDto.q}%` })
        queryDto.parentId
          ? qb.andWhere('lr.parentId = :parentId', { parentId: queryDto.parentId })
          : qb.andWhere('lr.parentId IS NULL')
      }))
      .select([
        'lr.id as id',
        'lr.title as title',
        'lr.createdAt as createdAt',
      ])

    return paginatedRawData(queryDto, queryBuilder);
  }

  async findOne(id: string, select?: FindOptionsSelect<LearningResource>) {
    const resource = await this.learningResourcesRepo.findOne({
      where: { id },
      select: select ?? { id: true, title: true, description: true, files: true, createdAt: true }
    });

    if (!resource) throw new NotFoundException('Resource not found');

    return resource;
  }

  async update(id: string, dto: UpdateLearningResourceDto) {
    const existing = await this.findOne(id);

    const newFiles = await this.resolveToPermanent(dto.files || []);

    const removedFiles = existing.files.filter(file => !newFiles.includes(file));

    Object.assign(existing, { ...dto, files: newFiles });

    await this.learningResourcesRepo.save(existing);

    await this.minioService.deleteFiles(removedFiles);

    return { message: 'Resource updated' }
  }

  async remove(id: string) {
    const existing = await this.findOne(id, { files: true });

    await this.learningResourcesRepo.delete({ id });
    await this.minioService.deleteFiles(existing.files);

    return { message: 'Resource deleted' }
  }

  async resolveToPermanent(
    items: string[],
  ): Promise<string[]> {
    return Promise.all(
      items.map(async (item) => {
        if (!item.startsWith("temp/")) {
          return item;
        }

        return this.minioService.moveFileToPermanent(item);
      }),
    )
  }
}