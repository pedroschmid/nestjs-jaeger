import * as dotenv from 'dotenv';
dotenv.config();

const { PORT, AMQP_ENDPOINT, AMQP_QUEUE_NAME, JAEGER_ENDPOINT } = process.env;

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { initTracing } from './utils/tracing';

async function bootstrap() {
  await initTracing(JAEGER_ENDPOINT);

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [AMQP_ENDPOINT],
      queue: AMQP_QUEUE_NAME,
      noAck: false,
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT || 3000);
}
bootstrap();
