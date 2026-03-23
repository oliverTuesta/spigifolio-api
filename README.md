# Spigifolio

Spigifolio is the backend for a personal investment portfolio dashboard. It is built with NestJS and connects to a PostgreSQL database. The goal was to simulate the kind of API a fintech company would build to power an investment product: portfolio summaries, asset positions, and transaction history. The frontend lives in a separate repository: [spigifolio-web](https://github.com/oliverTuesta/spigifolio-web).
---

## Screenshot

<img width="1584" height="1238" alt="image" src="https://github.com/user-attachments/assets/2280f579-78c4-48c2-b7ef-6b264ba1b7d9" />

---

## Tech Stack

- NestJS with TypeScript
- PostgreSQL
- class-validator for DTO validation
- Swagger for API documentation

---

## Features

- Portfolio summary with total balance, monthly return percentage, and number of active positions
- Movement history with pagination and filters by transaction type and date range
- Clean modular backend structure following NestJS conventions
- Environment-based configuration

---

## Database Schema

<img width="1718" height="1120" alt="image" src="https://github.com/user-attachments/assets/2acc6a67-f0a5-47f4-97c2-2db1bafad5b0" />

The database has five tables. `assets` stores the available financial instruments (stocks, ETFs, bonds, crypto) and `asset_prices` holds their historical closing prices, which is what drives the portfolio chart. `users` is straightforward account information. `holdings` ties a user to their current positions, storing quantity and average purchase price so unrealized gains can be calculated at query time. `movements` is the transaction log, recording every buy, sell, and dividend event with a `CHECK` constraint on the type column.

---

## Seed Data

A SQL seed file is included at `database/seed.sql`. It populates the `assets` table with a representative set of instruments across four categories: stocks (GOOGL, BAP, META), ETFs (SPY, QQQ, VTI), bonds (TLT, BND), and crypto (BTC, ETH). It also inserts approximately six months of weekly closing prices for each asset, which is enough to render a meaningful chart without bloating the database.

To load the seed data after running your migrations:

```bash
psql -U your_user -d your_database -f database/seed.sql
```

---

## Docker

The project includes a Dockerfile based on the official Node.js 20 image. It installs dependencies, builds the NestJS app, and runs the compiled output from `dist/main` on port 3000. To build and run it:

```bash
docker build -t spigifolio-backend .
docker run -p 3000:3000 --env-file .env spigifolio-backend
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

```bash
cp .env.example .env
# Fill in your database credentials in .env
npm install
npm run start:dev
```

Once the server is running, go to `/api` and use the Swagger UI to create a user first. The `id` returned in the response is what you will need to pass to the other endpoints.

---

## API

The project includes Swagger UI. Once the server is running, visit `/api` to browse and test all available endpoints interactively.

---

## Notes

This project was built as a learning exercise and a portfolio piece. It is not connected to any real brokerage or market data provider. Prices in the seed file are approximations based on historical data and are not meant to be financially accurate.
