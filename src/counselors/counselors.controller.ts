import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { CounselorsService } from './counselors.service';
import { CreateCounselorDto } from './dto/create-counselor.dto';
import { UpdateCounselorDto } from './dto/update-counselor.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, type AuthUser, Role } from 'src/common/types';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Query } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { CounselorsQueryDto } from './dto/counselors-query.dto';

@ApiBearerAuth()
@ApiTags('Counselors')
@Controller('counselors')
export class CounselorsController {
  constructor(private readonly counselorsService: CounselorsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new counselor' })
  @UseInterceptors(TransactionInterceptor)
  @CheckAbilities({ subject: Role.ADMIN, action: Action.CREATE })
  create(@Body() createCounselorDto: CreateCounselorDto, @CurrentUser() currentUser: AuthUser) {
    return this.counselorsService.create(createCounselorDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all counselors' })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.READ })
  findAll(@Query() queryDto: CounselorsQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.counselorsService.findAll(queryDto, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single counselor' })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: AuthUser) {
    return this.counselorsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a counselor' })
  @UseInterceptors(TransactionInterceptor)
  @CheckAbilities({ subject: Role.ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCounselorDto: UpdateCounselorDto, @CurrentUser() currentUser: AuthUser) {
    return this.counselorsService.update(id, updateCounselorDto, currentUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a counselor' })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: AuthUser) {
    return this.counselorsService.remove(id, currentUser);
  }
}

