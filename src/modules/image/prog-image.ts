import * as sharp from 'sharp';

export enum ImageType {
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
}

export type ImageOptions = {
  type: ImageType;
  blur?: number;
  rotate?: number;
};

export class ProgImage {
  private imgObj: sharp.Sharp;

  constructor(img: Buffer) {
    this.imgObj = sharp(img);
  }

  public async getImage(): Promise<Buffer> {
    return await this.imgObj.toBuffer();
  }

  public async toFormat(type: ImageType): Promise<void> {
    this.imgObj = await this.imgObj.toFormat(sharp.format[type]);
  }

  public async blur(sigma: number) {
    this.imgObj = await this.imgObj.blur(sigma);
  }

  public async rotate(angle: number) {
    this.imgObj = await this.imgObj.rotate(angle);
  }
}
