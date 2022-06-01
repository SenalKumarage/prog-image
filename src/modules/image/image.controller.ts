import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UploadRecordRequest,
  UploadRecordResponse,
} from 'src/dto/UploadRecord';
import {
  UploadRequestBody,
  UploadRequestResponse,
} from 'src/dto/UploadRequest';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../common/services/s3.service';
import { ImageService } from './image.service';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(
    private s3Service: S3Service,
    private imageService: ImageService,
  ) {}

  @Get(':id')
  // @ApiResponse({ status: 200, type: UserAccount, description: 'Success' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'Get account details' })
  @ApiParam({
    description: 'Image id',
    name: 'id',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    description: 'Image type',
    name: 'type',
    required: true,
    type: 'string',
  })
  @HttpCode(HttpStatus.OK)
  public async getImageId(
    @Param('id') id: string,
    @Query('type') type: string,
    @Res({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    try {
      let data = null;
      const imageRecord = await this.imageService.getById(id);
      // check if the content type exists
      if (imageRecord.contentTypes?.includes(type)) {
        data = (
          await this.s3Service.getImage(`${imageRecord.imageUrl}.${type}`)
        ).Body;
      } else {
        const original = await this.s3Service.getImage(
          `${imageRecord.imageUrl}.${imageRecord.initialType}`,
        );
        data = await this.imageService.convert(original.Body, type);
      }
      res.setHeader('Content-Type', `image/${type}`);
      res.setHeader('Content-Disposition', 'inline;');

      return new StreamableFile(data);
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/upload/request')
  @ApiResponse({
    status: 200,
    type: UploadRequestResponse,
    description: 'Success',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Generate a signed Url to upload the images' })
  @HttpCode(HttpStatus.OK)
  public async requestUpload(
    @Body() input: UploadRequestBody,
  ): Promise<UploadRequestResponse> {
    try {
      const imgKey = `${uuidv4()}/${input.imageName}.${input.contentType}`;
      const signedUrl = await this.s3Service.getSignedUrl(
        imgKey,
        `image/${input.contentType}`,
      );

      return {
        imageUrl: imgKey,
        uploadUrl: signedUrl,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/upload/record')
  @ApiResponse({
    status: 200,
    type: UploadRecordResponse,
    description: 'Success',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Save upload record details' })
  @HttpCode(HttpStatus.OK)
  public async recordUpload(
    @Body() input: UploadRecordRequest,
  ): Promise<UploadRecordResponse> {
    try {
      const id = await this.imageService.save(input);

      return {
        id,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
