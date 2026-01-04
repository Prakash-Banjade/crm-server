import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';
import { QueryDto } from 'src/common/dto/query.dto';

@ApiTags("Bookings")
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @ApiOperation({ description: "Create a new booking" })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.CREATE })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ description: "Get all bookings" })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.READ })
  findAll(@Query() queryDto: QueryDto) {
    return this.bookingsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ description: "Get a booking by id" })
  @CheckAbilities({ subject: Role.ADMIN, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ description: "Update a booking by id" })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ description: "Delete a booking by id" })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.remove(id);
  }
}
