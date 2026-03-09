import { DataSourceOptions } from 'typeorm';
import * as entities from '../../domain/entities';

export const developmentConfig: DataSourceOptions = {
  type: 'sqlite',
  database: './data/database.sqlite',
  entities: Object.values(entities),
  synchronize: true, // Auto-create tables (only for development)
  logging: true, // Show SQL queries in console
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};
