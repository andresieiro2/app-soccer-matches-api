import { DataSourceOptions } from 'typeorm';
import * as entities from '../../domain/entities';

export const productionConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'soccer_matches',
  entities: Object.values(entities),
  synchronize: false, // Never auto-create in production
  logging: false,
  migrations: ['dist/infrastructure/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
