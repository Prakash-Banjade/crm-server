import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { AuthUser } from 'src/common/types';
import { StudentsService } from 'src/students/students.service';
import { CoursesService } from 'src/course-system/courses/courses.service';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { ApplicationQueryDto } from './dto/application-query.dto';

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

    const course = await this.coursesService.findCourseByIntake(dto.courseId, dto.intake, { id: true })

    const createdBy = await this.accountsService.getOrThrow(currentUser.accountId);

    const application = this.applicationRepo.create({
      ...dto,
      student,
      course,
      year: dto.year,
      intake: dto.intake,
      createdBy
    });

    await this.applicationRepo.save(application);

    return { message: 'Application created successfully' }
  }

  findAll(queryDto: ApplicationQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.applicationRepo.createQueryBuilder('application')
      .orderBy('application.createdAt', queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)



  }

  findOne(id: number) {
    return `This action returns a #${id} application`;
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
