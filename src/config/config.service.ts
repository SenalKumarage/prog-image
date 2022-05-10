import { ConfigType } from './config-type';
import * as mongoDBConf from './config-users.mongodb';
import * as serverConf from './config-users.server';

export const getConfig = (): ConfigType => ({
  db: mongoDBConf.loadConfig(),
  server: serverConf.loadConfig(),
});
