import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../../config/config.service';
import { UploadRecord } from '../../dto/UploadRecord';

export const PROG_IMAGE_MONGODB_CONNECTION = 'progImageMongoDBConnection';

const conf = getConfig();

const mongoConnectionOpts: MongoConnectionOptions = {
  database: conf.db.name,
  authSource: 'admin',
  entities: [UploadRecord],
  host: process.env.NODE_ENV === 'dev' ? 'localhost' : conf.db.host,
  logging: true,
  name: PROG_IMAGE_MONGODB_CONNECTION,
  password: conf.db.password,
  port: conf.db.port,
  ssl: false,
  synchronize: false,
  type: 'mongodb',
  useNewUrlParser: true,
  username: conf.db.user,
};

@Module({
  exports: [TypeOrmModule],
  imports: [
    TypeOrmModule.forRoot(mongoConnectionOpts),
    TypeOrmModule.forFeature([UploadRecord], PROG_IMAGE_MONGODB_CONNECTION),
  ],
})
export class ProgImageDBModule {}
