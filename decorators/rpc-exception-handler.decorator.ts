import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';

interface HttpException {
  getStatus: () => number;
  getResponse?: () => string | object;
  message: string;
  stack?: string;
}

/** Type guard cho NestJS HttpException */
function isHttpException(err: unknown): err is HttpException {
  return (
    typeof err === 'object' &&
    err !== null &&
    'getStatus' in err &&
    typeof (err as HttpException).getStatus === 'function' &&
    'message' in err
  );
}

/** Type guard cho AxiosError */
function isAxiosError(err: unknown): err is AxiosError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'isAxiosError' in err &&
    (err as { isAxiosError?: boolean }).isAxiosError === true
  );
}

@Injectable()
export class HttpToRpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        console.log('err inteceptor', err);

        const stack = err instanceof Error ? err.stack : undefined;

        if (isHttpException(err)) {
          const statusCode = err.getStatus();
          const response =
            typeof err.getResponse === 'function'
              ? err.getResponse()
              : err.message;

          console.log('🔴 HTTP Exception caught:', { statusCode, response });

          // Return error object instead of throwing RpcException
          return throwError(() => ({
            success: false,
            statusCode,
            error: {
              code:
                typeof response === 'object' && 'error' in response
                  ? response.error
                  : 'HTTP_ERROR',
              message:
                typeof response === 'object' && 'message' in response
                  ? response.message
                  : err.message,
            },
            trace: stack,
          }));
        }

        if (isAxiosError(err)) {
          const responseData = err.response?.data;
          let message = err.message;

          if (
            responseData &&
            typeof responseData === 'object' &&
            'message' in responseData &&
            typeof (responseData as { message: unknown }).message === 'string'
          ) {
            message = (responseData as { message: string }).message;
          }

          return throwError(() => ({
            success: false,
            statusCode: err.response?.status ?? 500,
            error: {
              code: 'AXIOS_ERROR',
              message,
            },
            trace: stack,
          }));
        }

        if (err instanceof Error) {
          return throwError(() => ({
            success: false,
            statusCode: 500,
            error: {
              code: 'INTERNAL_ERROR',
              message: err.message,
            },
            trace: err.stack,
          }));
        }

        return throwError(() => ({
          success: false,
          statusCode: 500,
          error: {
            code: 'UNKNOWN_ERROR',
            message: `Unhandled exception: ${String(err)}`,
          },
        }));
      }),
    );
  }
}

export function HttpToRpcError() {
  return UseInterceptors(HttpToRpcErrorInterceptor);
}
