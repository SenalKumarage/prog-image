import 'dotenv/config';

export const fetchEnvVariable = (variable: string, errorMsg: string): any => {
  const envVar = process.env[variable];
  if (envVar === undefined) {
    return console.error(`${variable}: ${errorMsg}`);
  }

  return envVar;
};
