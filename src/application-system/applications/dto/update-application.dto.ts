import { IsEnum, IsOptional } from "class-validator";
import { EApplicationPriority, EApplicationStatus } from "../interface";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateApplicationDto {
    @ApiPropertyOptional({ enum: EApplicationPriority })
    @IsEnum(EApplicationPriority)
    @IsOptional()
    priority?: EApplicationPriority;

    @ApiPropertyOptional({ enum: EApplicationStatus })
    @IsEnum(EApplicationStatus)
    @IsOptional()
    status?: EApplicationStatus;
}
