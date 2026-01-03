import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "./entities/student.entity";
import { Repository } from "typeorm";
import { ELevelOfEducation } from "./interface";

@Injectable()
export class StudentsHelperService {
    constructor(
        @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
    ) { }

    async generateStudentId() {
        const currentYear = new Date().getFullYear();

        const lastStudent = await this.studentsRepo
            .createQueryBuilder('student')
            .orderBy('student.createdAt', 'DESC')
            .limit(1)
            .select(['student.id', 'student.refNo'])
            .getOne();

        if (!lastStudent || !lastStudent.refNo) {
            return `${currentYear}-00001`;
        }

        const lastStudentIdParts = lastStudent.refNo?.split('-');
        const lastYear = parseInt(lastStudentIdParts[0], 10);
        const lastCounter = parseInt(lastStudentIdParts[1], 10);

        if (lastYear !== currentYear) {
            return `${currentYear}-00001`; // Reset counter if the year has changed
        }

        const newCounter = (lastCounter + 1).toString().padStart(5, '0');
        return `${currentYear}-${newCounter}`;
    }

    async getStatusMessage(student: Student): Promise<string> {
        const { personalInfo, academicQualification, documents } = student;

        if (
            !personalInfo
            || !personalInfo.backgroundInfo
            || !personalInfo.mailingAddress
            || !personalInfo.permanentAddress
            || !personalInfo.emergencyContact
            || !personalInfo.nationality
            || !personalInfo.passport
        ) return 'Personal info incomplete';

        if (!academicQualification) return 'Academic qualification incomplete';

        const { highestLevelOfEducation, levelOfStudies } = academicQualification;

        const postGraduateCompleted = (
            levelOfStudies?.[ELevelOfEducation.POSTGRADUATE]
            && levelOfStudies?.[ELevelOfEducation.UNDERGRADUATE]
            && levelOfStudies?.[ELevelOfEducation.Grade12]
            && levelOfStudies?.[ELevelOfEducation.Grade10]
        );

        const underGraduateCompleted = (
            levelOfStudies?.[ELevelOfEducation.UNDERGRADUATE]
            && levelOfStudies?.[ELevelOfEducation.Grade12]
            && levelOfStudies?.[ELevelOfEducation.Grade10]
        );

        const grade12Completed = (
            levelOfStudies?.[ELevelOfEducation.Grade12]
            && levelOfStudies?.[ELevelOfEducation.Grade10]
        );

        const grade10Completed = (
            levelOfStudies?.[ELevelOfEducation.Grade10]
        );

        if (
            (highestLevelOfEducation === ELevelOfEducation.POSTGRADUATE && !postGraduateCompleted)
            || (highestLevelOfEducation === ELevelOfEducation.UNDERGRADUATE && !underGraduateCompleted)
            || (highestLevelOfEducation === ELevelOfEducation.Grade12 && !grade12Completed)
            || (highestLevelOfEducation === ELevelOfEducation.Grade10 && !grade10Completed)
        ) {
            return 'Academic qualification incomplete';
        }

        if (!documents) return 'Documents incomplete';

        const { cv, gradeTenMarksheet, gradeTwelveMarksheet, passport, ielts, recommendationLetters } = documents;

        if (!cv || !gradeTenMarksheet || !gradeTwelveMarksheet || !passport || !ielts || !recommendationLetters.length) return 'Documents incomplete';

        return "";
    }

}