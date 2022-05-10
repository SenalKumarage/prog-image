import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class UploadRequestBody {
  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  imageName: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  contentType: string;
}

export class UploadRequestResponse {
  @ApiProperty()
  @Expose()
  uploadUrl: string;
  @ApiProperty()
  @Expose()
  imageUrl: string;
}
