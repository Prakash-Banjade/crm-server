import { Module } from '@nestjs/common';
import { SupportChatService } from './support-chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportChat } from './entities/support-chat.entity';
import { SupportChatController } from './support-chat.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SupportChat])],
    controllers: [SupportChatController],
    providers: [SupportChatService],
    exports: [SupportChatService]
})
export class SupportChatModule { }
