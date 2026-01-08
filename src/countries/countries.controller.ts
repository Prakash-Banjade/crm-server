import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';
import { CountryQueryDto } from './dto/country-query.dto';

@ApiTags('Countries')
@ApiBearerAuth()
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new country' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.CREATE })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findAll(@Query() queryDto: CountryQueryDto) {
    return this.countriesService.findAll(queryDto);
  }

  @Get('options')
  @ApiOperation({ summary: 'Get all countries for select options' })
  getOptions(@Query() queryDto: CountryQueryDto) {
    return this.countriesService.getOptions(queryDto);
  }

  @Get('states/:countryId')
  @ApiOperation({ summary: 'Get states of a country' })
  getStates(@Param('countryId', ParseUUIDPipe) countryId: string) {
    return this.countriesService.getStates(countryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a country by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a country by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a country by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.countriesService.remove(id);
  }
}
