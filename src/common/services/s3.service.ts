import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { getConfig } from '../../config/config.service';

const conf = getConfig();

@Injectable()
export class S3Service {
  private s3 = null;
  constructor() {
    this.s3 = new S3({
      accessKeyId: conf.server.accessKeyId,
      secretAccessKey: conf.server.secretAccessKey,
      region: conf.server.region,
    });
  }
  public async getSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<any> {
    const params = {
      Bucket: 'prog-image-1',
      Key: fileName,
      ContentType: contentType,
    };

    return await this.s3.getSignedUrl('putObject', params);
  }

  public async getImage(fileName: string): Promise<any> {
    const params = {
      Bucket: 'prog-image-1',
      Key: fileName,
    };

    return await this.s3.getObject(params).promise();
  }
}
