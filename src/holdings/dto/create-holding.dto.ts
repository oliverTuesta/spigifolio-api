import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateHoldingDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  assetId: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 100.5 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  avgBuyPrice: number;
}
