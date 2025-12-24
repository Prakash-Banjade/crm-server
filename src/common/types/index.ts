
export type AuthUser = {
    accountId: string;
    email: string;
    role: Role
    deviceId: string;
    organizationId: string;
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