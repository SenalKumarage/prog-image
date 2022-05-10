export interface ConfigType {
  db: DBConfig;
  server: ServerConfig;
}

export interface DBConfig {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly name: string;
}

export interface ServerConfig {
  readonly port: number;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region: string;
}
