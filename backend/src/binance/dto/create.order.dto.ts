import { ApiProperty } from "@nestjs/swagger";

export class CreateOrder{
    @ApiProperty({
        description: 'Amount of the order',
        example: 0.10,
        required: true,
    })
    orderAmount: number;
    
    @ApiProperty({
        description: 'Crypto Payment (USDT, BUSD, etc.)',
        example: 'USDT',
        required: true,
    })
    currency: string;

    @ApiProperty({
        description: 'Description of the order',
        example: 'Example Buy',
        required: true,
    })
    description: string;
}