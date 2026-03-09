import { DataSourceOptions } from 'typeorm';
import { developmentConfig } from './development';
import { productionConfig } from './production';

const environment = process.env.NODE_ENV || 'development';

export const getDatabaseConfig = (): DataSourceOptions => {
  switch (environment) {
    case 'production':
      return productionConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

export { developmentConfig, productionConfig };
