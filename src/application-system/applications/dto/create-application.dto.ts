import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";
import { EMonth } from "src/common/types";

export class CreateApplicationDto {
    @ApiProperty()
    @IsUUID()
    studentId: string;

    @ApiProperty()
    @IsUUID()
    courseId: string;

    @ApiProperty()
    @IsEnum(Array.from({ length: 4 }).map((_, i) => new Date().getFullYear() + i)) // upto 3 years from now
    year: number;

    @ApiProperty()
    @IsEnum(EMonth)
    intake: EMonth;
}
