import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode = exception.getStatus();

        const errorResponse = exception.getResponse();

        errorResponse['success'] = false;
        errorResponse['timestamp'] = new Date().toISOString();
        errorResponse['path'] = request.path;
        errorResponse['method'] = request.method;

        response.status(statusCode).json(errorResponse);
    }
}