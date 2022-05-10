import { ServerConfig } from './config-type';
import { fetchEnvVariable } from './util';

const port = fetchEnvVariable('PORT', 'no port has provided');

const accessKeyId = fetchEnvVariable(
  'ACCESS_KEY_ID',
  'no accessKeyId has provided',
);

const secretAccessKey = fetchEnvVariable(
  'SECRET_ACCESS_KEY',
  'no secretAccessKey has provided',
);

const region = fetchEnvVariable('REGION', 'no region has provided');

const loadConfig = (): ServerConfig => {
  return {
    port,
    accessKeyId,
    secretAccessKey,
    region,
  };
};

export { loadConfig };
