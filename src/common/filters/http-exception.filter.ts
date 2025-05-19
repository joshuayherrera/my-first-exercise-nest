import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response, Request } from 'express';

@Catch() //Catch all exceptions
export class GlobalHttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: 'Oops! Something went wrong.'
        };

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                errorResponse.message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                Object.assign(errorResponse, exceptionResponse);
            }
        } else {
            console.error(
                `Unhandled Exception: ${status} ${request.method} ${request.url}`,
                exception instanceof Error ? exception.stack : exception,
            )
        }

        console.warn(`[ERROR HANDLER] Path: ${errorResponse.path}, Method: ${errorResponse.method}, Status: ${errorResponse.statusCode}, Message: ${JSON.stringify(errorResponse.message)}`);
        response.status(status).json(errorResponse);
    }
}