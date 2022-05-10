import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ImageController - upload (e2e)', () => {
  let app: INestApplication;
  let uploadRequest = null;
  const imageName = 'image5';
  const imageType = 'jpeg';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles an image upload request', () => {
    return request(app.getHttpServer())
      .post('/image/upload/request')
      .send({
        imageName,
        contentType: 'jpeg',
      })
      .expect(200)
      .then((res) => {
        const { imageUrl, uploadUrl } = res.body;
        uploadRequest = res.body;
        expect(imageUrl).toBeDefined();
        expect(uploadUrl).toBeDefined();
      });
  });

  it('handles an image upload record', () => {
    return request(app.getHttpServer())
      .post('/image/upload/record')
      .send({
        name: imageName,
        contentType: imageType,
        imageUrl: uploadRequest.imageUrl,
      })
      .expect(200)
      .then((res) => {
        const { id } = res.body;
        expect(id).toBeDefined();
      });
  });
});
