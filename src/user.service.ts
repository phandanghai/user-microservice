import { Injectable, Logger } from '@nestjs/common';
import { type CreateUserDto } from '../schema/user.schema';
import { PrismaService } from '../database/prisma.service';
import { hashData } from '@/helper/hash_data.helper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createNewUserService(createUserDto: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    this.logger.log('Use service create new user ...');

    const hashedPassword = await hashData(createUserDto.password);

    return await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findOne({ field, value }: { field: string; value: string }) {
    return await this.prismaService.user.findUnique({
      where: { [field]: value } as any,
    });
  }
}
