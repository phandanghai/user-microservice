// common/decorators/response-data.decorator.ts
import { SetMetadata, applyDecorators } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_message';
export const RESPONSE_STATUS_CODE = 'response_status_code';

export const ApiResponse = (message: string, statusCode?: number) => {
  return applyDecorators(
    SetMetadata(RESPONSE_MESSAGE, message ?? 'Call Api successfully  !!!'),
    SetMetadata(RESPONSE_STATUS_CODE, statusCode ?? 200),
  );
};
