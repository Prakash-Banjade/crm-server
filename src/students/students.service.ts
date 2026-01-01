import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { AuthUser } from 'src/common/types';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { StudentQueryDto } from './dto/students-query.dto';
import paginatedData from 'src/utils/paginatedData';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
    private readonly accountsService: AccountsService
  ) { }

  async create(dto: CreateStudentDto, currentUser: AuthUser) {
    const withDuplicateEmail = await this.studentsRepo.findOne({ where: { email: dto.email }, select: { id: true } });
    if (withDuplicateEmail) throw new Error('Email already exists');

    const createdBy = await this.accountsService.getOrThrow(currentUser.accountId);

    const student = this.studentsRepo.create({
      ...dto,
      createdBy,
    });

    await this.studentsRepo.save(student);

    // Todo: send in-app notification

    return { message: 'Student created successfully' }
  }

  findAll(queryDto: StudentQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.studentsRepo.createQueryBuilder('student')
      .orderBy(queryDto.sortBy, queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .leftJoin('student.createdBy', 'createdBy')

    if (queryDto.q) {
      queryBuilder.andWhere('student.fullName ILIKE :search', { search: `${queryDto.q}%` })
    }

    if (currentUser.organizationId) {
      queryBuilder.andWhere('createdBy.organizationId = :organizationId', { organizationId: currentUser.organizationId })
    }

    queryBuilder.select([
      'student.id',
      'student.refNo',
      'student.fullName',
      'student.email',
      'student.createdAt',
      'student.phoneNumber',
      'student.statusMessage',
      'createdBy.id',
      'createdBy.lowerCasedFullName',
    ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const existing = await this.studentsRepo.findOne({
      where: {
        id,
        createdBy: {
          organization: {
            id: currentUser.organizationId
          }
        }
      },
      select: {
        id: true,
        refNo: true,
        firstName: true,
        lastName: true,
        fullName: true,
        email: true,
        createdAt: true,
        phoneNumber: true,
        statusMessage: true,
        personalInfo: true,
        academicQualification: true,
        documents: true,
        workExperiences: true,
      }
    });

    if (!existing) throw new NotFoundException('Student not found');

    return existing;
  }

  async update(id: string, dto: UpdateStudentDto, currentUser: AuthUser) {
    return `This action updates a #${id} student`;
  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.studentsRepo.findOne({
      where: {
        id,
        createdBy: {
          organization: {
            id: currentUser.organizationId
          }
        }
      },
      select: { id: true }
    });

    if (!existing) throw new NotFoundException('Student not found');

    await this.studentsRepo.remove(existing);

    return { message: 'Student deleted successfully' }
  }
}
