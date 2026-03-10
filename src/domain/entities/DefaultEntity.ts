import { PrimaryColumn, CreateDateColumn } from 'typeorm';

export abstract class DefaultEntity {
  @PrimaryColumn('uuid')
  public readonly id: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  public readonly createdAt: Date;

  protected constructor(id: string, createdAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
  }
}
