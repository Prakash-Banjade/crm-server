import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { QueryDto } from 'src/common/dto/query.dto';
import paginatedData, { paginatedRawData } from 'src/utils/paginatedData';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  async create(dto: CreateCategoryDto) {
    const duplicate = await this.categoryRepository.findOne({ where: { name: ILike(dto.name) }, select: { id: true } })
    if (duplicate) throw new ConflictException('Category already exists');

    await this.categoryRepository.save(dto);

    return { message: 'Category created successfully' }
  }

  findAll(queryDto: QueryDto) {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .orderBy('category.createdAt', queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take);

    if (queryDto.q) {
      queryBuilder.andWhere('category.name ILIKE :q', { q: `${queryDto.q}%` });
    }

    queryBuilder.select([
      'category.id',
      'category.name',
      'category.createdAt',
    ]);

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existing = await this.categoryRepository.findOne({ where: { id }, select: ['id', 'name'] })
    if (!existing) throw new NotFoundException('Category not found')
    return existing
  }

  async getOptions(queryKey: QueryDto) {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .orderBy('category.createdAt', queryKey.order)
      .offset(queryKey.skip)
      .limit(queryKey.take);

    if (queryKey.q) {
      queryBuilder.andWhere('category.name ILIKE :q', { q: `${queryKey.q}%` });
    }

    queryBuilder.select([
      'category.id as value',
      'category.name as label',
    ]);

    return paginatedRawData(queryKey, queryBuilder);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findOne(id)

    if (dto.name !== existing.name) {
      const duplicate = await this.categoryRepository.findOne({ where: { name: ILike(dto.name) }, select: { id: true } })
      if (duplicate) throw new ConflictException('Category already exists');
    }

    await this.categoryRepository.update(id, dto)
    return { message: 'Category updated successfully' }
  }

  async remove(id: string) {
    await this.categoryRepository.delete(id)
    return { message: 'Category deleted successfully' }
  }
}
