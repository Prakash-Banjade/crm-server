
export type AuthUser = {
    accountId: string;
    email: string;
    role: Role
    deviceId: string;
    organizationId: string | undefined;
    organizationName: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
}

export enum Action {
    MANAGE = 'manage',
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    RESTORE = 'restore',
}

export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    COUNSELOR = 'counselor',
    BDE = 'bde',
    USER = 'user',
}

export enum EFileMimeType {
    IMAGE_JPG = 'image/jpeg',
    IMAGE_PNG = 'image/png',
    IMAGE_WEBP = 'image/webp',
    PDF = 'application/pdf',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    Audio = 'audio/mpeg',
    MP4 = 'video/mp4',
}

export interface IRichText {
    html: string;
    json: any
}

export enum ECommissionStatus {
    SENT_TO_PARTNER = 'sent_to_partner',
    INVOICE_UPLOADED = 'invoice_uploaded',
    REVISIONS_IN_INVOICE_NEEDED = 'revisions_in_invoice_needed',
    INVOICE_UPLOADED_AFTER_CORRECTIONS = 'invoice_uploaded_after_corrections',
    REVISIONS_IN_CN_NEEDED = 'revisions_in_cn_needed',
}

export enum EProgramLevel {
    High_School = 'high_school',
    UG_Diploma_Certificate_Associate_Degree = 'ug_diploma_certificate_associate_degree',
    UG = 'ug',
    PG_Diploma_Certificate = 'pg_diploma_certificate',
    PG = 'pg',
    UG_PG_Accelerated_Degree = 'ug_pg_accelerated_degree',
    PHD = 'phd',
    Foundation = 'foundation',
    Short_Term_Programs = 'short_term_programs',
    Pathway_Programs = 'pathway_programs',
    Twinning_Programmes_UG = 'twinning_programmes_ug',
    Twinning_Programmes_PG = 'twinning_programmes_pg',
    English_Language_Program = 'english_language_program',
    Online_Programmes_Distance_Learning = 'online_programmes_distance_learning',
}

export enum ECourseRequirement {
    PTE = 'pte',
    TOEFL_iBT = 'toefl_ibt',
    IELTS = 'ielts',
    DET = 'det',
    SAT = 'sat',
    ACT = 'act',
    GRE = 'gre',
    GMAT = 'gmat',
    Without_English_Proficiency = 'without_english_proficiency',
    Without_GRE = 'without_gre',
    Without_GMAT = 'without_gmat',
    Without_Maths = 'without_maths',
    STEM_Courses = 'stem_courses',
    Scholarship_Available = 'scholarship_available',
    With_15_Years_Of_Education = 'with_15_years_of_education',
    [`Application_Fee_Waiver_(100%)`] = 'application_fee_waiver_100',
}


export enum EBookingStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum EMonth {
    JANUARY = 'january',
    FEBRUARY = 'february',
    MARCH = 'march',
    APRIL = 'april',
    MAY = 'may',
    JUNE = 'june',
    JULY = 'july',
    AUGUST = 'august',
    SEPTEMBER = 'september',
    OCTOBER = 'october',
    NOVEMBER = 'november',
    DECEMBER = 'december',
}

export enum ELevelOfEducation {
    POSTGRADUATE = 'postgraduate',
    UNDERGRADUATE = 'undergraduate',
    GRADETWELVE = 'grade12',
    GRADETEN = 'grade10',
}

export const programLevelByLevelOfEducation = {
    [ELevelOfEducation.GRADETEN]: [EProgramLevel.High_School],
    [ELevelOfEducation.GRADETWELVE]: [
        EProgramLevel.UG_Diploma_Certificate_Associate_Degree,
        EProgramLevel.UG,
        EProgramLevel.Foundation,
        EProgramLevel.UG_PG_Accelerated_Degree
    ],
    [ELevelOfEducation.UNDERGRADUATE]: [
        EProgramLevel.UG_Diploma_Certificate_Associate_Degree,
        EProgramLevel.UG,
        EProgramLevel.Foundation,
        EProgramLevel.PG_Diploma_Certificate,
        EProgramLevel.PG,
        EProgramLevel.UG_PG_Accelerated_Degree
    ],
    [ELevelOfEducation.POSTGRADUATE]: [
        EProgramLevel.PHD
    ]
}

export enum EBookingType {
    IELTS = 'ielts',
    PTE = 'pte',
}

export enum EBookingSubType {
    GENERAL = 'general',
    ACADEMIC = 'academic',
    UKVI = 'ukvi',
}
