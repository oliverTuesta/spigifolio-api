import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetPrice } from '../asset-prices/entities/asset-price.entity';
import { Holding } from '../holdings/entities/holding.entity';
import { User } from '../users/entities/user.entity';

export interface PortfolioHoldingRow {
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  avgBuyPrice: number;
  unrealizedGain: number;
  unrealizedGainPct: number;
}

export interface PortfolioSummary {
  totalBalance: number;
  monthlyProfitability: number;
  totalAssets: number;
  holdings: PortfolioHoldingRow[];
}

export interface PortfolioChartResult {
  chartData: { date: string; value: number }[];
}

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Holding)
    private readonly holdingRepository: Repository<Holding>,
    @InjectRepository(AssetPrice)
    private readonly assetPriceRepository: Repository<AssetPrice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private num(value: string | number): number {
    return typeof value === 'number' ? value : Number(value);
  }

  private formatYmd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private firstDayOfMonth(year: number, monthIndex: number): string {
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
  }

  private lastDayOfMonth(year: number, monthIndex: number): string {
    const last = new Date(year, monthIndex + 1, 0);
    return this.formatYmd(last);
  }

  async getSummary(userId: number): Promise<PortfolioSummary> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const holdings = await this.holdingRepository.find({
      where: { user: { id: userId } },
      relations: ['asset'],
    });

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfCurrentMonthStr = this.formatYmd(startOfCurrentMonth);

    let totalBalance = 0;
    let balanceLastMonth = 0;
    const rows: PortfolioHoldingRow[] = [];

    for (const h of holdings) {
      const qty = this.num(h.quantity);
      const avgBuy = this.num(h.avgBuyPrice);

      const latest = await this.assetPriceRepository
        .createQueryBuilder('p')
        .innerJoin('p.asset', 'asset')
        .where('asset.id = :assetId', { assetId: h.asset.id })
        .orderBy('p.date', 'DESC')
        .getOne();

      const currentPrice = latest ? this.num(latest.closePrice) : 0;
      const totalValue = qty * currentPrice;
      totalBalance += totalValue;

      const priceBeforeMonth = await this.assetPriceRepository
        .createQueryBuilder('p')
        .innerJoin('p.asset', 'asset')
        .where('asset.id = :assetId', { assetId: h.asset.id })
        .andWhere('p.date < :start', { start: startOfCurrentMonthStr })
        .orderBy('p.date', 'DESC')
        .getOne();

      const refPrice = priceBeforeMonth
        ? this.num(priceBeforeMonth.closePrice)
        : 0;
      balanceLastMonth += qty * refPrice;

      const unrealizedGain = qty * (currentPrice - avgBuy);
      const costBasis = qty * avgBuy;
      const unrealizedGainPct =
        costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;

      rows.push({
        ticker: h.asset.ticker,
        name: h.asset.name,
        type: h.asset.type,
        quantity: qty,
        currentPrice,
        totalValue,
        avgBuyPrice: avgBuy,
        unrealizedGain,
        unrealizedGainPct,
      });
    }

    const monthlyProfitability =
      balanceLastMonth > 0
        ? ((totalBalance - balanceLastMonth) / balanceLastMonth) * 100
        : 0;

    return {
      totalBalance,
      monthlyProfitability,
      totalAssets: holdings.length,
      holdings: rows,
    };
  }

  async getChart(userId: number): Promise<PortfolioChartResult> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const holdings = await this.holdingRepository.find({
      where: { user: { id: userId } },
      relations: ['asset'],
    });

    const now = new Date();
    const chartData: { date: string; value: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = monthDate.getFullYear();
      const monthIndex = monthDate.getMonth();
      const start = this.firstDayOfMonth(year, monthIndex);
      const end = this.lastDayOfMonth(year, monthIndex);

      let value = 0;
      for (const h of holdings) {
        const qty = this.num(h.quantity);
        const priceRow = await this.assetPriceRepository
          .createQueryBuilder('p')
          .innerJoin('p.asset', 'asset')
          .where('asset.id = :assetId', { assetId: h.asset.id })
          .andWhere('p.date >= :start', { start })
          .andWhere('p.date <= :end', { end })
          .orderBy('p.date', 'DESC')
          .getOne();

        const price = priceRow ? this.num(priceRow.closePrice) : 0;
        value += qty * price;
      }

      chartData.push({ date: start, value });
    }

    return { chartData };
  }
}
