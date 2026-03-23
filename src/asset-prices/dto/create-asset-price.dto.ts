import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsPositive } from 'class-validator';

export class CreateAssetPriceDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  assetId: number;

  @ApiProperty({ example: '2025-03-01' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 150.25 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  closePrice: number;
}
