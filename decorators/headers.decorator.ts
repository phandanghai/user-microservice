import { HeaderRequestProps } from '@/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetHeaders = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): HeaderRequestProps => {
    const request = ctx.switchToHttp().getRequest();

    return {
      trace_id: request.trace_id as string,
      correlation_id: request.correlation_id as string,
      parent_request_id: request.parent_request_id as string,
      origin_service: request.origin_service as string,
      request_id: request.request_id as string,
      latency_ms: request.latency_ms as string,
      latency_ms_high_res: request.latency_ms_high_res as string,
      internal_latency_ms: request.internal_latency_ms as string,
      internal_latency_ms_high_res:
        request.internal_latency_ms_high_res as string,
    };
  },
);
