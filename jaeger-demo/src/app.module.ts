import { Module } from '@nestjs/common';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [PhotoModule],
})
export class AppModule {}
