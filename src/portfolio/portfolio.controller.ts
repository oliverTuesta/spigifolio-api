import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  PortfolioChartResult,
  PortfolioService,
  PortfolioSummary,
} from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':userId/summary')
  async getSummary(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PortfolioSummary> {
    return this.portfolioService.getSummary(userId);
  }

  @Get(':userId/chart')
  async getChart(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PortfolioChartResult> {
    return this.portfolioService.getChart(userId);
  }
}
