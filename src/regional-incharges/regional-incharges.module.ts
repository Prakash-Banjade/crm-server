import { Module } from '@nestjs/common';
import { RegionalInchargesService } from './regional-incharges.service';
import { RegionalInchargesController } from './regional-incharges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionalIncharge } from './entities/regional-incharge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegionalIncharge])],
  controllers: [RegionalInchargesController],
  providers: [RegionalInchargesService],
})
export class RegionalInchargesModule { }
