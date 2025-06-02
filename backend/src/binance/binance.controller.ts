import { Controller, Post,Delete, Headers, Req } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { CreateOrder } from './dto/create.order.dto';
import { CloseOrder } from './dto/close.order.dto';
import { Body, Query, Res, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { HttpException } from '@nestjs/common';


@Controller('binance')
export class BinanceController {
    constructor(private readonly binance_service: BinanceService) {
    }

    @Post('create-order')
    async createOrder(@Body() CreateOrder: CreateOrder) {
        console.log('Order created: ', CreateOrder)
        console.log('\n\n')
        return this.binance_service.createBinancePayOrder(CreateOrder);
    }


    @Delete('delete-order')
    async closeOrder(@Query('id') id: string){
        const request = new CloseOrder();
        request.merchantTradeNo = id;
        return this.binance_service.CloseBinancePayOrder(request)
    }


    @Post('webhook')
    async handleWebhook(
      @Headers('Binancepay-Timestamp') timestamp: string,
      @Headers('Binancepay-Nonce') nonce: string,
      @Headers('Binancepay-Signature') signature: string,
      @Req() req: Request,
      @Body() body: any,
      ){
        const rawBody = (req as any).rawBody;
        const payload = `${timestamp}\n${nonce}\n${rawBody}\n`;

        const publicKey = await this.binance_service.getPublicKey();
        console.log(publicKey);
        const isValid = this.binance_service.verifySignature(publicKey, payload, signature);

        if (!isValid) {
            throw new HttpException('signature invalid', HttpStatus.UNAUTHORIZED);
        }

        if (body.bizType === 'PAY' && body.bizStatus === 'PAY_SUCCESS') {
            const parsedData = JSON.parse(body.data);
            console.log('✅ Pay confirmed by Binance:', parsedData.merchantTradeNo);
        }

        if (body.bizType === 'PAY' && body.bizStatus === 'PAY_CLOSE') {
            const parsedData = JSON.parse(body.data);
            console.log('✅ Pay failed confirmed by Binance:', parsedData.merchantTradeNo);
        }

        return { returnCode: 'SUCCESS' };
      }
}
