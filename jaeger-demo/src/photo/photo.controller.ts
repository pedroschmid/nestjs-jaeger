import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { PhotoService } from './photo.service';

@Controller('/photos')
export class PhotoController {
  constructor(
    @Inject('RABBIT_SERVICE')
    private rabbitService: ClientProxy,
    private readonly httpService: HttpService,
    private photoService: PhotoService,
  ) {}

  @Get()
  async findAll() {
    // Calling Service (SQL)
    const photos = await this.photoService.findAll();

    // Calling External API
    await firstValueFrom(
      this.httpService.get('https://pokeapi.co/api/v2/pokemon/ditto').pipe(
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException(error);
        }),
      ),
    );

    // Calling RabbitMQ
    this.rabbitService.emit('photos', 'Any message :v');

    return photos;
  }

  @EventPattern('photos')
  async receiveMessage(@Payload() payload: any, @Ctx() context: RmqContext) {
    console.log('The message received is: ', payload);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    return payload;
  }
}
