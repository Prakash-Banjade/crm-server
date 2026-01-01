import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, type AuthUser, Role } from 'src/common/types';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { StudentQueryDto } from './dto/students-query.dto';

@ApiBearerAuth()
@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a student' })
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.CREATE })
  create(@Body() dto: CreateStudentDto, @CurrentUser() currentUser: AuthUser) {
    return this.studentsService.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
  findAll(@Query() queryDto: StudentQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.studentsService.findAll(queryDto, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student' })
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: AuthUser) {
    return this.studentsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStudentDto, @CurrentUser() currentUser: AuthUser) {
    return this.studentsService.update(id, dto, currentUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: AuthUser) {
    return this.studentsService.remove(id, currentUser);
  }
}
