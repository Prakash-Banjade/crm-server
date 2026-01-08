import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { CreateBdeDto } from './dto/create-bde.dto';
import { UpdateBdeDto } from './dto/update-bde.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';
import { Query } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { BdeService } from './bde.service';
import { BdesQueryDto } from './dto/bdes-query.dto';

@ApiBearerAuth()
@ApiTags('Bdes')
@Controller('bdes')
export class BdeController {
  constructor(private readonly bdeService: BdeService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new bde' })
  @UseInterceptors(TransactionInterceptor)
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.CREATE })
  create(@Body() createBdeDto: CreateBdeDto) {
    return this.bdeService.create(createBdeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bdes' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findAll(@Query() queryDto: BdesQueryDto) {
    return this.bdeService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single bde' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bdeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bde' })
  @UseInterceptors(TransactionInterceptor)
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBdeDto: UpdateBdeDto) {
    return this.bdeService.update(id, updateBdeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bde' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bdeService.remove(id);
  }
}

