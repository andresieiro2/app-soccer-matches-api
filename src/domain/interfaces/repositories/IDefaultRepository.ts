import { EntityManager } from 'typeorm';

export interface IDefaultRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  useTransaction<R>(
    callback: (manager: EntityManager) => Promise<R>
  ): Promise<R>;
}
