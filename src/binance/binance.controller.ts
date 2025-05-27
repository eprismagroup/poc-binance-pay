import { Controller, Post,Delete, Headers, Req } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { CreateOrder } from './dto/create.order.dto';
import { CloseOrder } from './dto/close.order.dto';
import { Body, Query, Res, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { HttpException } from '@nestjs/common';


@Controller('binance')
export class BinanceController {
    private apiSecret: string;
    private apiKey: string;
    constructor(private readonly binance_service: BinanceService) {
        this.apiSecret = this.binance_service.checkEnvConfig('BINANCE_API_KEY');
        this.apiKey = this.binance_service.checkEnvConfig('BINANCE_API_SECRET');
    }

    @Post('create-order')
    async createOrder(@Body() CreateOrder: CreateOrder) {
        console.log('asdasd')
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
      @Headers('Binancepay-Certificate-SN') certificateSn: string,
      @Req() req: Request,
      @Body() body: any,
      ){

        const payload = timestamp + "\n" + nonce + "\n" + body + "\n"
        const certPublic = this.binance_service.getPublicKey(certificateSn);
        console.log(certPublic)
        // const rawBody = (req as any).rawBody?.toString(); // asegura que es string
        // if (!timestamp || !nonce || !signature) {
        //   throw new HttpException('Missing headers or body', HttpStatus.BAD_REQUEST);
        // }
        // const payload = `${timestamp}\n${nonce}\n${rawBody}\n`;
        // const decodedSignature = Buffer.from(signature, 'base64')

        // const isVerified = crypto.verify(
        //   'sha256',
        //   Buffer.from(payload, 'utf8'),
        //   {
        //     key: this.apiKey,
        //     padding: crypto.constants.RSA_PKCS1_PADDING,
        //   },
        //   decodedSignature,
        // );

        // if (!isVerified) {
        //   console.warn('❌ Firma no válida');
        //   throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
        // }
        // console.log('✅ Webhook firmado correctamente recibido');
        // console.log('📦 Payload:', body);

        // // Parsear campo "data"
        // let parsedData;
        // try {
        //   parsedData = JSON.parse(body.data);
        // } catch (err) {
        //   console.error('❌ Error al parsear campo data:', err);
        //   throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
        // }

        // if (body.bizType === 'PAY' && body.bizStatus === 'PAY_SUCCESS') {
        //   console.log('💰 Pago exitoso recibido:', parsedData);

        //   // Aquí va tu lógica para registrar el pago, etc.
        //   // Ejemplo:
        //   // await this.ordersService.markAsPaid(parsedData.merchantTradeNo);
        // }

        // return { status: 'success' };
      }
}
