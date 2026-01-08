import { PartialType } from '@nestjs/swagger';
import { CreateRegionalInchargeDto } from './create-regional-incharge.dto';

export class UpdateRegionalInchargeDto extends PartialType(CreateRegionalInchargeDto) {}
