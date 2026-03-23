import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HoldingsService } from './holdings.service';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';
import { Holding } from './entities/holding.entity';

@Controller('holdings')
export class HoldingsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createHoldingDto: CreateHoldingDto): Promise<Holding> {
    return this.holdingsService.create(createHoldingDto);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Holding[]> {
    return this.holdingsService.findByUser(userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHoldingDto: UpdateHoldingDto,
  ): Promise<Holding> {
    return this.holdingsService.update(id, updateHoldingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.holdingsService.remove(id);
  }
}
