import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetPriceDto } from './create-asset-price.dto';

export class UpdateAssetPriceDto extends PartialType(CreateAssetPriceDto) {}
