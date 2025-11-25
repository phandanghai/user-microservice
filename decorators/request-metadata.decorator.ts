import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestMetadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      deviceId:
        request.headers['deviceid'] || request.headers['deviceId'] || null,
      userAgent: request.headers['user-agent'] || null,
      ipAddress: request.headers['x-forwarded-for'] || request.ip || null,
      timestamp: new Date().toISOString(),
      headers: request.headers,
    };
  },
);
