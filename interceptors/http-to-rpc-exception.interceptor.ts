import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ExceptionConverterService {
  /**
   * Convert HttpException to RpcException for microservice communication
   */
  convertToRpcException(error: HttpException): RpcException {
    const status = error.getStatus();
    const response = error.getResponse();

    let message = error.message;
    let errorName = error.name;

    if (typeof response === 'object' && response !== null) {
      message = (response as any).message || error.message;
      errorName = (response as any).error || error.name;
    }

    return new RpcException({
      statusCode: status,
      message: message,
      error: errorName,
    });
  }

  /**
   * Wrapper method to handle exceptions in microservice methods
   */
  handleServiceError(error: any): never {
    if (error instanceof HttpException) {
      throw this.convertToRpcException(error);
    }

    // For other errors, create a generic RpcException
    throw new RpcException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'Internal server error',
      error: 'InternalServerError',
    });
  }
}
