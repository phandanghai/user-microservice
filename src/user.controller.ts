import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { RMQ_PATTERNS } from '@/pattern';
import { UserValidationSchema } from '../schema/user.schema';
import { Payload } from '../decorators/rmq-payload.decorator';
import { ZodValidationPipe } from '@/zod/zod.validation.pipe';
import { HttpToRpcError } from '@/decorators/rpc-exception-handler.decorator';

@Controller('')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly userService: UserService) {}

  @HttpToRpcError()
  @MessagePattern(RMQ_PATTERNS.USER.TEST.pattern)
  async testMessage() {
    throw new BadRequestException('Test failed from user service');
  }

  // TODO
  @MessagePattern('USER.CREATE_NEW_USER')
  async createNewUser(
    @Payload(new ZodValidationPipe(UserValidationSchema))
    createUserDto: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    this.logger.log(
      'User Controller send request to service to create new user ...',
    );
    return this.userService.createNewUserService({ ...createUserDto });
  }

  @MessagePattern(RMQ_PATTERNS.USER.GET.pattern)
  @HttpToRpcError()
  async getDetailUser(
    @Payload() { field, value }: { field: string; value: string },
  ) {
    this.logger.log(
      'User Controller send request to service get detail user ...',
    );
    return await this.userService.findOne({ field, value });
  }
}
