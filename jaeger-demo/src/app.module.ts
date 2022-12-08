import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [ConfigModule.forRoot(), PhotoModule],
})
export class AppModule {}
