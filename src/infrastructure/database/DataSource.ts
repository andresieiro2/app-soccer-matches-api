import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './index';

// Create the DataSource instance
export const AppDataSource = new DataSource(getDatabaseConfig());

// Initialize connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connected successfully');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Close connection (for testing/cleanup)
export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database:', error);
    throw error;
  }
};
