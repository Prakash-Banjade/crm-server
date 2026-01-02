import { EGender, EMaritalStatus } from "src/common/types";
import { ECountry } from "src/common/types/country.type";

export interface IStudentAsLead {
    gender: EGender;
    address: string;
    country: ECountry;
    interestedCourse: string;
}

export interface IStudentDocuments {
    cv: string;
    gradeTenMarksheet: string;
    gradeElevenMarksheet?: string;
    gradeTwelveMarksheet: string;
    passport: string;
    ielts: string;
    recommendationLetter: string;
    workExperience?: string;
}

export interface IStudentAddress {
    address1: string;
    address2?: string;
    city: string;
    country: string;
    state: string;
    zipCode: number;
}

export interface IStudentPassport {
    number: string;
    issueDate: string;
    expiryDate: string;
    issueCountry: ECountry;
    cityOfBrith: string;
    countryOfBrith: ECountry;
}

export interface IStudentNationality {
    livingAndStudyingCountry: ECountry;
    otherCountriesCitizenship?: ECountry[];
}

export interface IStudentBackgroundInfo {
    appliedImmigrationCountry?: ECountry;
    medicalCondition?: string;
    visaRefusal?: string;
    criminalRecord?: string;
}

export interface IStudentEmergencyContact {
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
}

export interface IStudentPersonalInfo {
    dob: string;
    gender: EGender;
    maritalStatus: EMaritalStatus;
    mailingAddress?: IStudentAddress;
    permanentAddress?: IStudentAddress;
    passport?: IStudentPassport;
    nationality?: IStudentNationality;
    backgroundInfo?: IStudentBackgroundInfo;
    emergencyContact?: IStudentEmergencyContact;
}

export enum ELevelOfEducation {
    POSTGRADUATE = 'postgraduate',
    UNDERGRADUATE = 'undergraduate',
    GRADETWELVE = 'grade12',
    GRADETEN = 'grade10',
}

export interface IStudentLevelOfStudy {
    levelOfStudy: ELevelOfEducation;
    nameOfBoard: string;
    nameOfInstitution: string
    country: ECountry;
    state: string;
    city: string;
    degreeAwarded: string;
    score: number;
    primaryLanguage: string;
    startDate: string;
    endDate: string;
}

export interface IStudentAcademicQualification {
    countryOfEducation: ECountry;
    highestLevelOfEducation: ELevelOfEducation;
    levelOfStudies: IStudentLevelOfStudy[];
}

export enum EModeOfSalary {
    CASH = 'cash',
    BANK = 'bank',
    CHEQUE = 'cheque',
}

export interface IStudentWorkExperience {
    organization: string;
    position: string;
    jobProfile: string;
    workingFrom: string;
    workingTo?: string;
    modeOfSalary: EModeOfSalary;
    comment?: string;
}