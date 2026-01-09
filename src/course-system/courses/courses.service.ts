import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Brackets, FindOptionsSelect, In, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { UniversitiesService } from 'src/universities/universities.service';
import { CourseQueryDto } from './dto/courses-query.dto';
import paginatedData, { paginatedRawData } from 'src/utils/paginatedData';
import { EMonth, programLevelByLevelOfEducation } from 'src/common/types';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
    private readonly categoriesService: CategoriesService,
    private readonly universitiesService: UniversitiesService,
  ) { }

  async create(createCourseDto: CreateCourseDto) {
    const university = await this.universitiesService.findOne(createCourseDto.universityId, { id: true });
    const category = await this.categoriesService.findOne(createCourseDto.categoryId);

    const course = this.courseRepository.create({
      ...createCourseDto,
      university,
      category
    });

    await this.courseRepository.save(course);

    return { message: 'Course created successfully' }
  }

  findAll(queryDto: CourseQueryDto) {
    const queryBuilder = this.courseRepository.createQueryBuilder('course')
      .orderBy(queryDto.sortBy, queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .leftJoinAndSelect('course.university', 'university')
      .leftJoinAndSelect('university.country', 'country')
      .leftJoinAndSelect('course.category', 'category')
      .where(new Brackets(qb => {
        if (queryDto.q) {
          qb.andWhere('course.name ILIKE :search', { search: `${queryDto.q}%` })
            .orWhere('university.name ILIKE :search', { search: `${queryDto.q}%` })
            .orWhere('category.name ILIKE :search', { search: `${queryDto.q}%` })
        }
      }))
      .andWhere(new Brackets(qb => {
        queryDto.programLevels?.length && qb.andWhere('course.programLevel IN (:...programLevels)', { programLevels: queryDto.programLevels })
        queryDto.universityIds?.length && qb.andWhere('university.id IN (:...universityIds)', { universityIds: queryDto.universityIds })
        queryDto.min_duration && qb.andWhere('course.duration >= :min_duration', { min_duration: queryDto.min_duration })
        queryDto.max_duration && qb.andWhere('course.duration <= :max_duration', { max_duration: queryDto.max_duration })
        queryDto.min_fee && qb.andWhere('course.fee >= :min_fee', { min_fee: queryDto.min_fee })
        queryDto.max_fee && qb.andWhere('course.fee <= :max_fee', { max_fee: queryDto.max_fee })
        queryDto.university?.length && qb.andWhere('university.id IN (:...universityIds)', { universityIds: queryDto.university })
        queryDto.country?.length && qb.andWhere('country.id IN (:...countryIds)', { countryIds: queryDto.country })
        queryDto.grade12?.length && qb.andWhere('course.minGrade12Percentage <= :minGrade12Percentage', { minGrade12Percentage: queryDto.grade12 })
        queryDto.ug?.length && qb.andWhere('course.minUgPercentage <= :minUgPercentage', { minUgPercentage: queryDto.ug })
        queryDto.ielts?.length && qb.andWhere('course.ieltsMinScore <= :ieltsMinScore', { ieltsMinScore: queryDto.ielts })
        queryDto.pte?.length && qb.andWhere('course.pteMinScore <= :pteMinScore', { pteMinScore: queryDto.pte })
      }))

    if (queryDto.intakes?.length) {
      queryBuilder.andWhere('course.intakes && :intakes', { intakes: queryDto.intakes });
    }

    if (queryDto.requirements?.length) {
      queryBuilder.andWhere('course.requirements && :requirements', { requirements: queryDto.requirements });
    }

    queryBuilder.select([
      'course.id',
      'course.name',
      'course.duration',
      'course.fee',
      'course.programLevel',
      'course.requirements',
      'course.intakes',
      'course.hasScholarship',
      'course.university',
      'course.category',
      'course.createdAt',
      'course.updatedAt',
      'course.minGrade12Percentage',
      'course.minUgPercentage',
      'course.minWorkExperience',
      'course.gapAccepted',
      'course.ieltsMinScore',
      'course.pteMinScore',
      'course.ieltsOverall',
      'course.pteOverall',
      'course.applicationFee',
      'course.paymentTerms',
      'course.currency',
      'course.courseUrl',
      'university.id',
      'university.name',
      'university.state',
      'category.id',
      'category.name',
      'country.id',
      'country.name',
    ]);

    return paginatedData(queryDto, queryBuilder);
  }

  getOptions(queryDto: CourseQueryDto) {
    const queryBuilder = this.courseRepository.createQueryBuilder('course')
      .orderBy(queryDto.sortBy, queryDto.order)
      .offset(queryDto.skip)
      .limit(queryDto.take)
      .leftJoin('course.university', 'university');

    if (queryDto.q) {
      queryBuilder.andWhere('course.name ILIKE :search', { search: `${queryDto.q}%` })
    }

    if (queryDto.universityIds?.length) {
      queryBuilder.andWhere('university.id IN (:...universityIds)', { universityIds: queryDto.universityIds })
    }

    queryBuilder.select([
      'course.id as value',
      'course.name as label',
    ])

    return paginatedRawData(queryDto, queryBuilder);
  }

  async findOne(id: string, select?: FindOptionsSelect<Course>) {
    const existing = await this.courseRepository.findOne({
      where: { id },
      relations: { university: true, category: true },
      select: select ?? {
        id: true,
        name: true,
        applicationFee: true,
        commissions: true,
        courseUrl: true,
        description: true,
        duration: true,
        fee: true,
        intakes: true,
        ieltsOverall: true,
        ieltsMinScore: true,
        pteOverall: true,
        pteMinScore: true,
        minWorkExperience: true,
        gapAccepted: true,
        minGrade12Percentage: true,
        minUgPercentage: true,
        paymentTerms: true,
        programLevel: true,
        requirements: true,
        createdAt: true,
        hasScholarship: true,
        currency: true,
        updatedAt: true,
        university: {
          id: true,
          name: true,
        },
        category: {
          id: true,
          name: true,
        },
      }
    })

    if (!existing) throw new NotFoundException('Course not found')

    return existing;
  }

  async update(id: string, dto: UpdateCourseDto) {
    const existing = await this.courseRepository.findOne({
      where: { id },
      relations: { university: true, category: true },
      select: {
        id: true,
        university: { id: true },
        category: { id: true }
      }
    });

    if (!existing) throw new NotFoundException('Course not found');

    if (dto.universityId && dto.universityId !== existing.university.id) {
      const university = await this.universitiesService.findOne(dto.universityId, { id: true });
      existing.university = university;
    }

    if (dto.categoryId && dto.categoryId !== existing.category.id) {
      const category = await this.categoriesService.findOne(dto.categoryId);
      existing.category = category;
    }

    Object.assign(existing, dto);

    await this.courseRepository.save(existing);

    return { message: 'Course updated successfully' }
  }

  async findCourseByIntake(id: string, intake: EMonth) {
    const course = await this.courseRepository.createQueryBuilder('course')
      .where('course.id = :id', { id })
      .andWhere(':intake = ANY(course.intakes)', { intake })
      .select(['course.id', 'course.name'])
      .getOne();

    if (!course) throw new NotFoundException('Course not found')

    return course;
  }

  async remove(id: string) {
    await this.courseRepository.delete(id);
    return { message: 'Course deleted successfully' }
  }
}
