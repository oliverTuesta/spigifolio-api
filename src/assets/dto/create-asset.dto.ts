import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { AssetType } from '../entities/asset.entity';

export class CreateAssetDto {
  @ApiProperty({ example: 'AAPL' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  ticker: string;

  @ApiProperty({ example: 'Apple Inc.' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AssetType, example: AssetType.STOCK })
  @IsEnum(AssetType)
  type: AssetType;
}
