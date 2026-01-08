import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateSupportChatMessageDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(500, { message: 'Message must be at most 500 characters long' })
    content: string;

    // needed when super admin is replying to the chat
    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    supportChatId?: string;
}
