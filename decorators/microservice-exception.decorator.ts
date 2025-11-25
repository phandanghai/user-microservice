import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 * Decorator để tự động convert HttpException thành RpcException
 * với đúng format cho microservice
 */
export function MicroserviceExceptionHandler() {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        if (error instanceof HttpException) {
          // Convert HttpException thành RpcException với đúng format
          const status = error.getStatus();
          const response = error.getResponse();

          let message = error.message;
          let errorName = error.name;

          if (typeof response === 'object' && response !== null) {
            message = (response as any).message || error.message;
            errorName = (response as any).error || error.name;
          }

          throw new RpcException({
            statusCode: status,
            message: message,
            error: errorName,
          });
        }

        // Cho các lỗi khác (Prisma, validation, etc.)
        if (error instanceof Error) {
          throw new RpcException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
            error: error.name || 'InternalServerError',
          });
        }

        // Fallback cho unknown errors
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: 'UnknownError',
        });
      }
    };

    return descriptor;
  };
}
