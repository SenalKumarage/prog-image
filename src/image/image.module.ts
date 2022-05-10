import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ProgImageDBModule } from 'src/db/prog-image-db.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  controllers: [ImageController],
  exports: [],
  imports: [CommonModule, ProgImageDBModule],
  providers: [ImageService],
})
export class ImageModule {}
