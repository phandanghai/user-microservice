import { User } from './model.interface';

// Meta thông tin gửi đi trong request
export interface RMQRequestMeta {
  correlationId: string;
  deviceId?: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
}

// Cấu trúc của request gửi đi
export interface RMQRequest<TPayload = unknown> {
  meta: RMQRequestMeta;
  payload: TPayload;
}

// Cấu trúc response trả về từ service
export interface RMQResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: {
    code: string;
    message: string;
  };
}

export interface RMQPatterns {
  USER: {
    TEST: {
      pattern: string;
      payload: null;
      response: unknown;
      description: string;
    };
    CREATE_NEW_USER: {
      pattern: string;
      payload: {
        email: string;
        name: string;
        password: string;
        firstName: string;
        lastName: string;
      };
      response: User;
      description: string;
    };
    GET: {
      pattern: string;
      payload: { userId: string };
      response: User;
      description: string;
    };
  };
}
