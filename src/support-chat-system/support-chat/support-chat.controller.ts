import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SupportChatService } from "./support-chat.service";
import { CheckAbilities } from "src/common/decorators/abilities.decorator";
import { Action, Role } from "src/common/types";
import { QueryDto } from "src/common/dto/query.dto";

@ApiBearerAuth()
@ApiTags('Support Chat')
@Controller('support-chat')
export class SupportChatController {
    constructor(
        private readonly supportChatService: SupportChatService
    ) { }

    @Get()
    @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
    getAll(@Query() queryDto: QueryDto) {
        return this.supportChatService.getAll(queryDto);
    }

    @Get(":id")
    @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
    findOne(@Param("id", ParseUUIDPipe) id: string) {
        return this.supportChatService.findOne(id);
    }
}
