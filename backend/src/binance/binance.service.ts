import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrder } from './dto/create.order.dto';
import { CloseOrder } from './dto/close.order.dto';

@Injectable()
export class BinanceService {
  private apiKey: string;
  private apiSecret: string;


  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.checkEnvConfig('BINANCE_API_KEY');
    this.apiSecret = this.checkEnvConfig('BINANCE_API_SECRET');
  }

  
  checkEnvConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`This variable is requeried: ${key}`);
    }
    return value;
  }


  async getPublicKey() {
      const timestamp = Date.now().toString(); 
      const nonce = uuidv4().replace(/-/g, ''); //ID not repeteable
      const payload = {};
      const payloadStr = JSON.stringify(payload);
      const signature = this.signPayload(payloadStr, timestamp, nonce);
      const header = this.assignHeader(timestamp, nonce, signature);

      const response = await axios.post(`https://bpay.binanceapi.com/binancepay/openapi/certificates`,
      payload,
      {
      headers: header
    });

    return response.data.data[0].certPublic;
  }


  verifySignature(publicKey: string, payload: string, signature: string): boolean {
    try {
      const isValid = crypto.verify(
        'RSA-SHA256',
        Buffer.from(payload, 'utf8'),
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(signature, 'base64')
      );

      return isValid;
    } catch (err) {
      console.error('❌ Error al verificar la firma:', err);
      return false;
    }
  }


  private signPayload(payload: any, timestamp: any, nonce: string): string {
    const dataToSign = `${timestamp}\n${nonce}\n${payload}\n`;
    return crypto.createHmac("sha512", this.apiSecret).update(dataToSign).digest("hex").toUpperCase();
  }


  private generateMerchantTradeNo(): string {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
    return `${timestamp}${randomSuffix}`;
  }


  private assignHeader(timestamp: string, nonce: string, signature: string) {
    const headers = {
      "Content-Type": "application/json",
      "BinancePay-Timestamp": timestamp,
      "BinancePay-Nonce": nonce,
      "BinancePay-Certificate-SN": this.apiKey,
      "BinancePay-Signature": signature,
    };
    return headers;
  }


  async CloseBinancePayOrder(closeOrderRequest: CloseOrder){
    const timestamp = Date.now().toString(); 
    const nonce = uuidv4().replace(/-/g, ''); //ID not repeteable

    const payload = {
      "merchantTradeNo": closeOrderRequest.merchantTradeNo,
      "prepayId": null
    }
    const payloadStr = JSON.stringify(payload);
    const signature = this.signPayload(payloadStr, timestamp, nonce);
    const header = this.assignHeader(timestamp, nonce, signature);

    try{
      const response = await axios.post(
        'https://bpay.binanceapi.com/binancepay/openapi/order/close',
        payload,
        { headers: header }
      )

      const data = response.data;
      if (data.status === 'SUCCESS') {
        return {
          statusCode: 200,
          message: 'Orden cancelada correctamente',
          data: data.data
        };
      } else {
        return {
          statusCode: 400,
          message: 'Error al cancelar la orden',
          error: data
        };
      }
    }catch(error){
      return {
        statusCode: 500,
        message: "Error in the request: ",
        error: error.response?.data || error.message
      };
    }
  }


  async createBinancePayOrder(orderRequest: CreateOrder) {
    const timestamp = Date.now().toString(); 
    const nonce = uuidv4().replace(/-/g, ''); //ID not repeteable
    const merchantTradeNo = this.generateMerchantTradeNo();
    
    const payload = {
      env: {
        terminalType: "WEB",
      },
      merchantTradeNo: merchantTradeNo,
      orderAmount: orderRequest.orderAmount,
      currency: orderRequest.currency,
      description: orderRequest.description,
      goodsDetails: [
        {
          goodsType: "01",
          goodsCategory: "D000",
          referenceGoodsId: "7876763A3B",
          goodsName: "Ice Cream",
          goodsDetail: "Greentea ice cream cone",
        },
      ],
    };

    const payloadStr = JSON.stringify(payload);
    const signature = this.signPayload(payloadStr, timestamp, nonce);
    const header = this.assignHeader(timestamp, nonce, signature)
    
    try {
      const response = await axios.post(
        'https://bpay.binanceapi.com/binancepay/openapi/v3/order',
        payload,
        { headers: header }
      );

      const data = response.data;
      if (data.status === "SUCCESS") {
        return {
          statusCode: 201,
          message: "Order create successfully.",
          checkoutUrl: data.data.checkoutUrl,
          orderId: data.data.orderId,
          tradeNo: merchantTradeNo
        };
      } else {
        return {
          statusCode: 400,
          message: "Error in create the order",
          error: data
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error in the request: ",
        error: error.response?.data || error.message
      };
    }
  }

}