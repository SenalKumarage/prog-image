import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PROG_IMAGE_MONGODB_CONNECTION } from '../db/prog-image-db.module';
import { UploadRecord, UploadRecordRequest } from '../../dto/UploadRecord';
import { MongoRepository } from 'typeorm/repository/MongoRepository';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../common/services/s3.service';
import { UploadRequestResponse } from 'src/dto/UploadRequest';
import { ImageOptions, ProgImage } from './prog-image';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(UploadRecord, PROG_IMAGE_MONGODB_CONNECTION)
    private readonly imageRepo: MongoRepository<UploadRecord>,
    private s3Service: S3Service,
  ) {}

  /**
   * This method will check if the requested content type is there in the DB,
   * if it's there it will fetch from the s3 bucket.
   * @param id Unique id of the image
   * @param type Content type needed
   * @returns Streamable file
   */
  public async getImage(
    id: string,
    options: ImageOptions,
  ): Promise<StreamableFile> {
    const imageRecord = await this.imageRepo.findOneBy(id);
    if (!imageRecord) {
      throw new NotFoundException('Image not found');
    }
    // TODO: Implement a message queue and upload newly processed images
    const imgKey = `${imageRecord.imageUrl}.${imageRecord.initialType}`;
    let data = (await this.s3Service.getImage(imgKey)).Body;
    data = await this.processImage(data, options);

    return new StreamableFile(data);
  }

  /**
   * This will request a signed url from s3 to upload the image
   * @param name Image name
   * @param contentType Content type of the image
   * @returns Image upload url response
   */
  public async requestImageUpload(
    name: string,
    contentType: string,
  ): Promise<UploadRequestResponse> {
    const imgKey = `${uuidv4()}/${name}.${contentType}`;
    const signedUrl = await this.s3Service.getSignedUrl(
      imgKey,
      `image/${contentType}`,
    );

    return {
      imageUrl: imgKey,
      uploadUrl: signedUrl,
    };
  }

  /**
   * This will record the uploaded image meta-data
   * @param input Image record
   * @returns Image id
   */
  public async save(input: UploadRecordRequest): Promise<string | undefined> {
    const { insertedId } = await this.imageRepo.insertOne({
      name: input.name,
      imageUrl: input.imageUrl.split('.')[0],
      initialType: input.contentType,
      contentTypes: [input.contentType],
    });

    return insertedId.toString();
  }

  private async processImage(
    img: Buffer,
    options: ImageOptions,
  ): Promise<Buffer> {
    const progImg = new ProgImage(img);

    // Format to image type
    await progImg.toFormat(options.type);

    // Blur
    if (options.blur) {
      await progImg.blur(options.blur);
    }

    return await progImg.getImage();
  }
}
