import { Module } from '@nestjs/common';
import { BinanceController } from './binance.controller';
import { BinanceService } from './binance.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule],
  controllers: [BinanceController],
  providers: [BinanceService]
})
export class BinanceModule {

}
