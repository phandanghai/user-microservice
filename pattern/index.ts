import { RMQPatterns } from '@/interfaces';
import { User } from '@/interfaces/model.interface';

export const RMQ_PATTERNS: RMQPatterns = {
  USER: {
    TEST: {
      pattern: 'USER.TEST',
      payload: null,
      response: null,
      description: 'Test request from microservices to rabbitMQ',
    },
    CREATE_NEW_USER: {
      pattern: 'USER.CREATE_NEW_USER',
      payload: {
        email: '',
        name: '',
        password: '',
        firstName: '',
        lastName: '',
      },
      response: {} as any,
      description: 'Create new user in database ....',
    },
    GET: {
      pattern: 'USER.GET',
      payload: { field: '', value: '' },
      response: {} as User,
      description: 'Get user by field and value',
    },
  },
};
