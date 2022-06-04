import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { ImageService } from './image.service';
import { ImageType } from './prog-image';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get(':id')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiOperation({ summary: 'Get image' })
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
  @ApiQuery({
    description: 'Sigma value for image blur',
    name: 'blur',
    required: false,
    type: 'number',
  })
  @HttpCode(HttpStatus.OK)
  public async getImageId(
    @Param('id') id: string,
    @Query('type') type: ImageType,
    @Query('blur', ParseIntPipe) blur: number,
    @Res({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    try {
      res.setHeader('Content-Type', `image/${type}`);
      res.setHeader('Content-Disposition', 'inline;');

      return this.imageService.getImage(id, { type, blur });
    } catch (error) {
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
      return this.imageService.requestImageUpload(
        input.imageName,
        input.contentType,
      );
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
      return {
        id: await this.imageService.save(input),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
