import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ENotificationType } from "../entities/notification.entity";
import { AuthUser } from "src/common/types";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ENotificationType)
    type: ENotificationType;

    @IsString()
    @IsNotEmpty()
    url: string;

    currentUser: AuthUser;

    constructor(o: CreateNotificationDto) {
        Object.assign(this, o);
    }
}
