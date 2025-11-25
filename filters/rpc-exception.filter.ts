import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    console.log('🔴 RPC Exception caught:', exception);

    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    // Handle NestJS HttpException
    if (exception?.response) {
      const response = exception.response;
      statusCode = exception.status || response.statusCode || 500;
      message = response.message || exception.message || message;
      code = response.error || 'HTTP_ERROR';
    }
    // Handle RpcException
    else if (exception instanceof RpcException) {
      const error = exception.getError();
      if (typeof error === 'object') {
        statusCode = (error as any).statusCode || 500;
        message = (error as any).message || message;
        code = (error as any).code || 'RPC_ERROR';
      } else {
        message = error as string;
      }
    }
    // Handle standard Error
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Return error object instead of throwing
    // This will be sent back to Gateway via RabbitMQ
    return throwError(() => ({
      success: false,
      statusCode,
      error: {
        code,
        message: Array.isArray(message) ? message : [message],
      },
    }));
  }
}
