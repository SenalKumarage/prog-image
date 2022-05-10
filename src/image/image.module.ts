import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ProgImageDBModule } from '../db/prog-image-db.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  controllers: [ImageController],
  exports: [],
  imports: [CommonModule, ProgImageDBModule],
  providers: [ImageService],
})
export class ImageModule {}
