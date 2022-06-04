import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [ImageModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
