import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  MovementsService,
  PaginatedMovementsResult,
} from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { GetMovementsQueryDto } from './dto/get-movements-query.dto';
import { Movement } from './entities/movement.entity';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createMovementDto: CreateMovementDto,
  ): Promise<Movement> {
    return this.movementsService.create(createMovementDto);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: GetMovementsQueryDto,
  ): Promise<PaginatedMovementsResult> {
    return this.movementsService.findByUser(userId, query);
  }
}
