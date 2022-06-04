import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';

@Module({
  controllers: [],
  exports: [S3Service],
  imports: [],
  providers: [S3Service],
})
export class CommonModule {}
