import { ClientProxy } from '@nestjs/microservices';
import {
  firstValueFrom,
  timeout,
  retry,
  catchError,
  throwError,
  TimeoutError,
} from 'rxjs';
import {
  RMQRequestMeta,
  RMQRequest,
  RMQResponse,
  RMQPatterns,
} from '@/interfaces';
import { randomUUID } from 'crypto';

// ------------------------
// 1) Utility types
// ------------------------

type FlattenPatterns<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? {
        [SK in keyof T[K] as `${K & string}.${SK & string}`]: T[K][SK];
      }
    : never;
}[keyof T];

type PatternKeys<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? {
        [SK in keyof T[K]]: `${K & string}.${SK & string}`;
      }[keyof T[K]]
    : never;
}[keyof T];

// ------------------------
// 2) Error classifier
// ------------------------

interface RMQErrorDetail {
  type: string;
  message: string;
  raw: any;
}

const classifyRMQError = (error: any): RMQErrorDetail => {
  if (error instanceof TimeoutError) {
    return { type: 'TIMEOUT', message: 'Request timed out', raw: error };
  }

  if (!error?.message) {
    return {
      type: 'UNKNOWN_ERROR',
      message: 'Unknown error occurred',
      raw: error,
    };
  }

  const msg = error.message;

  if (msg.includes('ECONNREFUSED'))
    return {
      type: 'CONNECTION_REFUSED',
      message: 'Cannot connect to RabbitMQ server',
      raw: error,
    };

  if (msg.includes('ENOTFOUND'))
    return {
      type: 'DNS_NOT_FOUND',
      message: 'Host not found (DNS)',
      raw: error,
    };

  if (msg.includes('ECONNRESET'))
    return {
      type: 'CONNECTION_RESET',
      message: 'Connection reset by RabbitMQ',
      raw: error,
    };

  if (msg.includes('ERR_INVALID_URL'))
    return {
      type: 'INVALID_URL',
      message: 'RabbitMQ URL is invalid',
      raw: error,
    };

  if (msg.includes('Channel closed'))
    return {
      type: 'CHANNEL_CLOSED',
      message: 'AMQP channel was unexpectedly closed',
      raw: error,
    };

  if (msg.includes('ACCESS_REFUSED'))
    return {
      type: 'AUTH_FAILED',
      message: 'Invalid RabbitMQ username/password',
      raw: error,
    };

  if (msg.includes('NOT_FOUND - no queue'))
    return {
      type: 'QUEUE_NOT_FOUND',
      message: 'Queue does not exist',
      raw: error,
    };

  if (msg.includes('no route'))
    return {
      type: 'ROUTE_NOT_FOUND',
      message: 'Routing key does not match',
      raw: error,
    };

  if (msg.includes('PRECONDITION_FAILED'))
    return {
      type: 'PRECONDITION_FAILED',
      message: 'Queue configuration mismatch',
      raw: error,
    };

  if (msg.includes('expired'))
    return {
      type: 'TTL_EXPIRED',
      message: 'Message TTL expired before delivery',
      raw: error,
    };

  if (msg.includes('RESOURCE_LOCKED'))
    return {
      type: 'RESOURCE_LOCKED',
      message: 'RabbitMQ resource locked',
      raw: error,
    };

  if (msg.includes('serialization'))
    return {
      type: 'SERIALIZATION_ERROR',
      message: 'Failed to serialize payload',
      raw: error,
    };

  if (msg.includes('frame error'))
    return { type: 'FRAME_ERROR', message: 'Invalid AMQP frame', raw: error };

  return {
    type: 'UNCLASSIFIED_ERROR',
    message: msg,
    raw: error,
  };
};

// ------------------------
// 3) Helper class
// ------------------------

export class RabbitMQHelper {
  constructor(private readonly client: ClientProxy) {}

  async send<P extends PatternKeys<RMQPatterns> | string>(
    pattern: P,
    payload: P extends PatternKeys<RMQPatterns>
      ? FlattenPatterns<RMQPatterns> extends infer F
        ? P extends keyof F
          ? F[P] extends { payload: infer Payload }
            ? Payload
            : never
          : never
        : never
      : any,
    meta?: RMQRequestMeta,
    timeoutMs = 1000,
    retryCount = 1,
  ): Promise<
    RMQResponse<
      P extends PatternKeys<RMQPatterns>
        ? FlattenPatterns<RMQPatterns> extends infer F
          ? P extends keyof F
            ? F[P] extends { response: infer Response }
              ? Response
              : never
            : never
          : never
        : any
    >
  > {
    const finalMeta = meta || { correlationId: randomUUID() };
    const request: RMQRequest<any> = { payload, meta: finalMeta };

    try {
      return await firstValueFrom(
        this.client.send(pattern, request).pipe(
          timeout(timeoutMs),
          retry({ count: retryCount, delay: 1000 }),

          catchError((err) => {
            const classified = classifyRMQError(err);
            return throwError(() => classified);
          }),
        ),
      );
    } catch (error) {
      classifyRMQError(error);

      // Ngược lại → Unclassified
      throw {
        type: 'UNCLASSIFIED_ERROR',
        message: error?.message || 'Unknown error',
        raw: error,
        pattern,
      };
    }
  }
}
