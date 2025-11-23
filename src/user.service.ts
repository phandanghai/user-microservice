import { Injectable, Logger } from '@nestjs/common';
import { type CreateUserDto } from './schema/user.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor() {}

  async createNewUserService(createNewUser: CreateUserDto) {
    this.logger.log('Creating new user:', createNewUser);
    return createNewUser;
  }
}
