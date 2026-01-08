import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";

export class SupportChatMessagesQueryDto extends QueryDto {
    @ApiProperty()
    @IsUUID()
    @IsOptional()
    supportChatId?: string;
}