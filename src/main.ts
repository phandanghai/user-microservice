import { NestFactory } from '@nestjs/core';
import { AppModule } from './user.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  app.useLogger(logger);

  // 🔹 Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'https://finance-nextjs-phi.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'deviceId',
      'User-Agent',
      'x-forwarded-for',
    ],
  });

  const rabbitmqUrl = configService.get<string>('RABBITMQ_URL');
  logger.log(`Connecting to RabbitMQ: ${rabbitmqUrl}`);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'user_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  logger.log('User microservice started successfully');

  await app.listen(3001);
  logger.log('User service listening on port 3001');
}

bootstrap().catch((err) => {
  // Catch unhandled errors in bootstrap to prevent floating promises
  console.error('Bootstrap failed', err);
  process.exit(1);
});
