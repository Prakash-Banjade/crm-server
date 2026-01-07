import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Brackets, DataSource } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { University } from 'src/universities/entities/university.entity';
import { type FastifyRequest } from 'fastify';
import { BaseRepository } from 'src/common/repository/base-repository';
import { Application } from 'src/application-system/applications/entities/application.entity';
import { Course } from 'src/course-system/courses/entities/course.entity';
import { AuthUser, Role } from 'src/common/types';
import { Organization } from 'src/auth-system/organizations/entities/organization.entity';
import { EApplicationStatus } from 'src/application-system/applications/interface';
import { ConfigService } from '@nestjs/config';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { SupportChatMessage } from 'src/support-chat-system/support-chat-messages/entities/support-chat-message.entity';

@Injectable({ scope: Scope.REQUEST })
export class DashboardService extends BaseRepository {
  env: "development" | "production";

  constructor(
    dataSource: DataSource,
    @Inject(REQUEST) req: FastifyRequest,
    private readonly configService: ConfigService
  ) {
    super(dataSource, req);
    this.env = this.configService.get('NODE_ENV') || "production";
  }

  async getCounts(currentUser: AuthUser) {
    const organizationId = currentUser.role === Role.SUPER_ADMIN ? undefined : currentUser.organizationId;

    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    // Last month is strictly the previous calendar month
    const lastMonthDate = subMonths(today, 1);
    const lastMonthStart = startOfMonth(lastMonthDate);
    const lastMonthEnd = endOfMonth(lastMonthDate);

    const applicationsCountPromise = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .cache(this.env === 'production')
      .getCount();

    const currentMonthApplicationsCountPromise = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('application.createdAt BETWEEN :start AND :end', { start: currentMonthStart, end: currentMonthEnd })
      .cache(this.env === 'production')
      .getCount();

    const lastMonthApplicationsCountPromise = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('application.createdAt BETWEEN :start AND :end', { start: lastMonthStart, end: lastMonthEnd })
      .cache(this.env === 'production')
      .getCount();


    const coursesCountPromise = this.getRepository(Course).createQueryBuilder().cache(this.env === 'production').getCount();

    const universitiesCountPromise = this.getRepository(University).createQueryBuilder().cache(this.env === 'production').getCount();

    const studentsCountPromise = this.getRepository(Student).createQueryBuilder("student")
      .leftJoin("student.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .cache(this.env === 'production')
      .getCount();

    const currentMonthStudentsCountPromise = this.getRepository(Student).createQueryBuilder("student")
      .leftJoin("student.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('student.createdAt BETWEEN :start AND :end', { start: currentMonthStart, end: currentMonthEnd })
      .cache(this.env === 'production')
      .getCount();

    const lastMonthStudentsCountPromise = this.getRepository(Student).createQueryBuilder("student")
      .leftJoin("student.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('student.createdAt BETWEEN :start AND :end', { start: lastMonthStart, end: lastMonthEnd })
      .cache(this.env === 'production')
      .getCount();

    const organizationsCountPromise = this.getRepository(Organization).createQueryBuilder().cache(this.env === 'production').getCount();

    const [
      applicationsCount,
      currentMonthApplicationsCount,
      lastMonthApplicationsCount,
      coursesCount,
      universitiesCount,
      studentsCount,
      currentMonthStudentsCount,
      lastMonthStudentsCount,
      organizationsCount
    ] = await Promise.all([
      applicationsCountPromise,
      currentMonthApplicationsCountPromise,
      lastMonthApplicationsCountPromise,
      coursesCountPromise,
      universitiesCountPromise,
      studentsCountPromise,
      currentMonthStudentsCountPromise,
      lastMonthStudentsCountPromise,
      organizationsCountPromise
    ]);

    return {
      applicationsCount,
      applicationsGrowth: this.calculateGrowth(currentMonthApplicationsCount, lastMonthApplicationsCount),
      coursesCount,
      universitiesCount,
      studentsCount,
      studentsGrowth: this.calculateGrowth(currentMonthStudentsCount, lastMonthStudentsCount),
      organizationsCount
    }
  }

  calculateGrowth(current: number, last: number) {
    if (last === 0) return current > 0 ? 100 : 0;
    return ((current - last) / last) * 100;
  };

  async getApplicationPipeline(currentUser: AuthUser) {
    const organizationId = currentUser.role === Role.SUPER_ADMIN ? undefined : currentUser.organizationId;

    const tatalActiveApplicationsCount = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere(
        'application.status NOT IN (:...statuses)',
        {
          statuses: [
            EApplicationStatus.Case_Closed,
            EApplicationStatus.Visa_Rejected,
            EApplicationStatus.Rejected_On_Gte_Grounds,
            EApplicationStatus.Rejected_By_Institution
          ]
        }
      )
      .cache(this.env === 'production')
      .getCount();

    const applicationsUnderReview = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('application.status = :status', { status: EApplicationStatus.Received_Application_At_Abhyam })
      .cache(this.env === 'production')
      .getCount();

    const applicationsInVisaProcess = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('application.status = :status', { status: EApplicationStatus.Visa_In_Process })
      .cache(this.env === 'production')
      .getCount();

    const applicationsVisaReceived = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('application.status = :status', { status: EApplicationStatus.Visa_Received })
      .cache(this.env === 'production')
      .getCount();

    const applicationsVisaRejected = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('application.status = :status', { status: EApplicationStatus.Visa_Rejected })
      .cache(this.env === 'production')
      .getCount();

    const applicationsInClosure = this.getRepository<Application>(Application).createQueryBuilder('application')
      .leftJoin("application.createdBy", "createdBy")
      .where(new Brackets(qb => {
        if (organizationId) qb.where('createdBy.organizationId = :organizationId', { organizationId });
      }))
      .andWhere('application.status IN (:...statuses)', { statuses: [EApplicationStatus.Deferral_Initiated, EApplicationStatus.Refund_Request_Initiated, EApplicationStatus.Case_Closed] })
      .cache(this.env === 'production')
      .getCount();

    const response = await Promise.all([
      tatalActiveApplicationsCount,
      applicationsUnderReview,
      applicationsInVisaProcess,
      applicationsVisaReceived,
      applicationsVisaRejected,
      applicationsInClosure
    ])

    return {
      totalActiveApplicationsCount: response[0],
      applicationsUnderReview: response[1],
      applicationsInVisaProcess: response[2],
      applicationsVisaReceived: response[3],
      applicationsVisaRejected: response[4],
      applicationsInClosure: response[5]
    }
  }

  async getRecentSupportChatMessages() {
    return this.getRepository(SupportChatMessage).createQueryBuilder("scm")
      .leftJoin("scm.supportChat", "supportChat")
      .leftJoin("scm.sender", "sender")
      .leftJoin("sender.organization", "organization")
      .orderBy("scm.createdAt", "DESC")
      .take(5)
      .where("sender.role != :role", { role: Role.SUPER_ADMIN })
      .select([
        'scm.id as "id"',
        'scm.createdAt as "createdAt"',
        'sender.lowerCasedFullName as "sender"',
        'sender.role as "senderRole"',
        'organization.name as "organizationName"',
        'supportChat.id as "supportChatId"'
      ])
      .getRawMany();
  }
}
