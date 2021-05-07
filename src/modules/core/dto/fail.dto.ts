import { ApiResponseProperty } from "@nestjs/swagger";

export class FailDTO {
    @ApiResponseProperty({ type: Number, example: 400 })
    statusCode: number;

    @ApiResponseProperty({ type: String, example: 'required' })
    message: string | string[];

    @ApiResponseProperty({ type: String, example: 'Bad Request' })
    error: string;

    @ApiResponseProperty({ type: Boolean, example: false })
    success: boolean;

    @ApiResponseProperty({ type: String, example: '/' })
    path: string;

    @ApiResponseProperty({ type: String, example: 'GET' })
    method: string;
}