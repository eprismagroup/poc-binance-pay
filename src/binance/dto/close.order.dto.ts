import { ApiProperty } from "@nestjs/swagger";

export class CloseOrder{
    @ApiProperty({
        description: 'ID of the order',
        example: '123456789454541212',
        required: true,
    })
    merchantTradeNo: string;
}