const { AMQP_ENDPOINT, AMQP_QUEUE_NAME } = process.env;

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '../database/database.module';
import { PhotoController } from './photo.controller';
import { photoProvider } from './photo.provider';
import { PhotoService } from './photo.service';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    ClientsModule.register([
      {
        name: 'RABBIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [AMQP_ENDPOINT],
          queue: AMQP_QUEUE_NAME,
          noAck: false,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [PhotoController],
  providers: [...photoProvider, PhotoService],
})
export class PhotoModule {}
