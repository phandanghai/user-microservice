import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Payload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();
    // If request has payload property, extract it, otherwise return the whole request
    return request?.payload !== undefined ? request.payload : request;
  },
);

export const Meta = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();
    return request?.meta || {};
  },
);
