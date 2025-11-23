import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { RMQ_PATTERNS } from '@/pattern';
import { type CreateUserDto } from './schema/user.schema';
import { Payload, Meta } from './decorators/rmq-payload.decorator';
import { type RMQRequestMeta } from '@/interfaces';

@Controller('')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern(RMQ_PATTERNS.USER.TEST.pattern)
  async testMessage(@Payload() data: any, @Meta() meta: RMQRequestMeta) {
    this.logger.log('TEST MESSAGE RECEIVED:', data);
    this.logger.log('Meta:', meta);
    return { success: true, message: 'Test successful' };
  }

  @MessagePattern(RMQ_PATTERNS.USER.CREATE_NEW_USER.pattern)
  async createNewUser(
    @Payload() createUserDto: CreateUserDto,
    @Meta() meta: RMQRequestMeta,
  ) {
    return await this.userService.createNewUserService(createUserDto);
  }
}
