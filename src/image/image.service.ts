import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PROG_IMAGE_MONGODB_CONNECTION } from '../db/prog-image-db.module';
import { UploadRecord, UploadRecordRequest } from '../dto/UploadRecord';
import { MongoRepository } from 'typeorm/repository/MongoRepository';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(UploadRecord, PROG_IMAGE_MONGODB_CONNECTION)
    private readonly imageRepo: MongoRepository<UploadRecord>,
  ) { }

  public async save(input: UploadRecordRequest): Promise<string | undefined> {
    const { insertedId } = await this.imageRepo.insertOne({
      name: input.name,
      imageUrl: input.imageUrl.split('.')[0],
      initialType: input.contentType,
      contentTypes: [input.contentType],
    });

    return insertedId.toString();
  }

  public async getById(id: string): Promise<UploadRecord | undefined> {
    return await this.imageRepo.findOneBy(id);
  }

  public async convert(img: Buffer, type: string): Promise<Buffer> {
    return await sharp(img).toFormat(sharp.format[type]).toBuffer();
  }
}
