import { DBConfig } from './config-type';
import { fetchEnvVariable } from './util';

const host = fetchEnvVariable(
  `PROGIMG_MONGODB_HOST`,
  'no host provided for User MongoDb',
);

const port = fetchEnvVariable(
  `PROGIMG_MONGODB_PORT`,
  'no host provided for User MongoDb',
);

const user = fetchEnvVariable(
  `PROGIMG_MONGODB_USER`,
  'no host provided for User MongoDb',
);

const password = fetchEnvVariable(
  `PROGIMG_MONGODB_PASS`,
  'no host provided for User MongoDb',
);

const name = fetchEnvVariable(
  `PROGIMG_MONGODB_DB`,
  'no host provided for User MongoDb',
);

const loadConfig = (): DBConfig => {
  return {
    host,
    port,
    user,
    password,
    name,
  };
};

export { loadConfig };
