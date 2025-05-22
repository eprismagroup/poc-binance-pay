import { Controller, Post,Delete } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { CreateOrder } from './dto/create.order.dto';
import { CloseOrder } from './dto/close.order.dto';
import { Body, Query } from '@nestjs/common';
@Controller('binance')
export class BinanceController {
    constructor(private readonly binance_service: BinanceService) {}

    @Post('create-order')
    async createOrder(@Body() CreateOrder: CreateOrder) {
        return this.binance_service.createBinancePayOrder(CreateOrder);
    }
    @Delete('delete-order')
    async closeOrder(@Query('id') id: string){
        const request = new CloseOrder();
        request.merchantTradeNo = id;
        return this.binance_service.CloseBinancePayOrder(request)
    }
}
