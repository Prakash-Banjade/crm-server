import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
    name: string;
}
