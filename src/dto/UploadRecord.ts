import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('UploadRecord')
export class UploadRecord {
  @ObjectIdColumn()
  @PrimaryGeneratedColumn()
  readonly _id?: string;

  @Column()
  initialType: string[];

  @Column()
  contentTypes: string[];

  @Column()
  name: string;

  @Column()
  imageUrl: string;
}

export class UploadRecordRequest {
  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  imageUrl: string;
}

export class UploadRecordResponse {
  @ApiProperty()
  @Expose()
  id: string;
}
