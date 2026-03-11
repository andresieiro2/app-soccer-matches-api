import {
  Repository,
  ObjectLiteral,
  EntityTarget,
  EntityManager,
} from 'typeorm';
import { AppDataSource } from '../database/DataSource';
import { IDefaultRepository } from '../../domain/interfaces/repositories';

export class DefaultRepository<
  T extends ObjectLiteral,
> implements IDefaultRepository<T> {
  protected repository: Repository<T>;

  private relations: string[] = [];

  constructor(entity: EntityTarget<T>, relations: string[] = []) {
    this.repository = AppDataSource.getRepository(entity);
    this.relations = relations;
  }

  async findById(id: string): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as any,
      relations: this.relations,
    });
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find({
      relations: this.relations,
    });
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async useTransaction<R>(
    callback: (manager: EntityManager) => Promise<R>
  ): Promise<R> {
    return this.repository.manager.transaction(callback);
  }
}
