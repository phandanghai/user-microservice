import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const GetInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const requestInfo = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      headers: request.headers,
      query: request.query,
      params: request.params,
      body: request.body,
      ip: request.headers['x-forwarded-for'] || request.ip || null,
      userAgent: request.headers['user-agent'],
    };

    return requestInfo;
  },
);
