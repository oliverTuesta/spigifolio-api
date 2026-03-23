import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { MovementType } from '../entities/movement.entity';

export class CreateMovementDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  assetId: number;

  @ApiProperty({ enum: MovementType, example: MovementType.BUY })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ example: '2025-03-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description:
      'Required for BUY and SELL; optional for DIVIDEND (e.g. cash dividend)',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @ApiProperty({ example: 150.25 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 750.5 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  total: number;
}
