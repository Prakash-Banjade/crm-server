import { Controller, Get, Body, Patch, Param, Delete, Query, UseInterceptors, Post, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/user-query.dto';
import { ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Action, type AuthUser, Role } from 'src/common/types';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@ApiExcludeController()
@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user, particularly ADMIN' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.CREATE })
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findAll(@Query() queryDto: UsersQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.usersService.findAll(queryDto, currentUser);
  }

  @Get('me')
  getMyInfo(@CurrentUser() currentUser: AuthUser) {
    return this.usersService.myDetails(currentUser);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  update(@Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: AuthUser) {
    return this.usersService.update(updateUserDto, currentUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user, particularly ADMIN' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }

}
