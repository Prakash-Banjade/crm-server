import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { AuthUser, Role } from 'src/common/types';
import { StudentsService } from 'src/students/students.service';
import { CoursesService } from 'src/course-system/courses/courses.service';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { ApplicationQueryDto } from './dto/application-query.dto';
import paginatedData from 'src/utils/paginatedData';
import { EConversationType } from './interface';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private readonly applicationRepo: Repository<Application>,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
    private readonly accountsService: AccountsService,
  ) { }

  async create(dto: CreateApplicationDto, currentUser: AuthUser) {
    const duplicateApplication = await this.applicationRepo.findOne({
      where: {
        student: { id: dto.studentId },
        course: { id: dto.courseId },
        year: dto.year,
        intake: dto.intake
      },
      select: { id: true }
    })

    if (duplicateApplication) throw new ConflictException('Application already exists');

    const student = await this.studentsService.findOne(dto.studentId, currentUser, { id: true, statusMessage: true })
    if (student.statusMessage.length > 0) throw new ForbiddenException('Not allowed to apply yet. ' + student.statusMessage);

    const course = await this.coursesService.findCourseByIntake(dto.courseId, dto.intake)

    const createdBy = await this.accountsService.getOrThrow(currentUser.accountId);

    const application = this.applicationRepo.create({
      ...dto,
      student,
      course,
      year: dto.year,
      intake: dto.intake,
      createdBy,
      ackNo: await this.generateAckNo(),
      conversations: [{ // immediately create a conversation for admin
        type: EConversationType.Admin,
      }]
    });

    await this.applicationRepo.save(application);

    return { message: 'Application created successfully' }
  }

  async generateAckNo() {
    const currentYear = new Date().getFullYear();

    const lastApplication = await this.applicationRepo
      .createQueryBuilder('application')
      .orderBy('application.createdAt', 'DESC')
      .limit(1)
      .select(['application.id', 'application.ackNo'])
      .getOne();

    if (!lastApplication || !lastApplication.ackNo) {
      return `ACK-${currentYear}-00001`;
    }

    const lastApplicationIdParts = lastApplication.ackNo?.split('-');
    const lastYear = parseInt(lastApplicationIdParts[1], 10);
    const lastCounter = parseInt(lastApplicationIdParts[2], 10);

    if (lastYear !== currentYear) {
      return `ACK-${currentYear}-00001`; // Reset counter if the year has changed
    }

    const newCounter = (lastCounter + 1).toString().padStart(5, '0');
    return `ACK-${currentYear}-${newCounter}`;
  }

  findAll(queryDto: ApplicationQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.applicationRepo.createQueryBuilder('application')
      .orderBy('application.createdAt', queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .leftJoin('application.student', 'student')
      .leftJoin('application.createdBy', 'createdBy')
      .leftJoin('application.course', 'course')
      .leftJoin('course.university', 'university')

    if (currentUser.organizationId) {
      queryBuilder.andWhere('createdBy.organizationId = :organizationId', { organizationId: currentUser.organizationId })
    }

    if (queryDto.studentId) {
      queryBuilder.andWhere('student.id = :studentId', { studentId: queryDto.studentId })
    }

    queryBuilder.select([
      'application.id',
      'application.ackNo',
      'application.createdAt',
      'application.intake',
      'application.year',
      'application.status',
      'application.priority',
      'student.id',
      'student.fullName',
      'course.id',
      'course.name',
      'university.id',
      'university.name',
      'createdBy.id',
      'createdBy.lowerCasedFullName',
    ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const existing = await this.applicationRepo.findOne({
      where: {
        id,
        createdBy: {
          organization: { id: currentUser.role === Role.SUPER_ADMIN ? undefined : currentUser.organizationId }
        }
      },
      relations: {
        course: {
          university: { country: true }
        },
        conversations: true
      },
      select: {
        id: true,
        ackNo: true,
        createdAt: true,
        intake: true,
        year: true,
        status: true,
        paymentDocument: true,
        priority: true,
        conversations: {
          id: true,
          createdAt: true,
          type: true,
        },
        course: {
          id: true,
          name: true,
          courseUrl: true,
          university: {
            id: true,
            name: true,
            state: true,
            country: {
              id: true,
              name: true,
            }
          }
        }
      }
    })

    if (!existing) throw new NotFoundException('Application not found')

    return existing;
  }

  async update(id: string, dto: UpdateApplicationDto, currentUser: AuthUser) {
    const existing = await this.applicationRepo.findOne({
      where: {
        id,
        createdBy: {
          organization: { id: currentUser.role === Role.SUPER_ADMIN ? undefined : currentUser.organizationId }
        }
      },
      select: {
        id: true,
        priority: true,
        status: true,
      }
    })

    if (!existing) throw new NotFoundException('Application not found')

    Object.assign(existing, {
      priority: currentUser.role === Role.ADMIN ? dto.priority : existing.priority, // only admin can update priority
      status: currentUser.role === Role.SUPER_ADMIN ? dto.status : existing.status, // only super admin can update status
    })

    await this.applicationRepo.save(existing)

    return { message: 'Application updated' };
  }

  async remove(id: string) {
    await this.applicationRepo.delete(id);
    return { message: 'Application deleted' }
  }
}
