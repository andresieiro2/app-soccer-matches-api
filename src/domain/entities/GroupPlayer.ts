import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './Group';

@Entity('group_players')
export class GroupPlayer {
  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column({
    type: 'uuid',
    name: 'group_id',
  })
  public readonly groupId: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  public readonly name: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  public readonly createdAt: Date;

  // Relationships
  @ManyToOne(() => Group, (group) => group.players)
  @JoinColumn({ name: 'group_id' })
  public group?: Group;

  private constructor(
    id: string,
    groupId: string,
    name: string,
    createdAt: Date
  ) {
    this.id = id;
    this.groupId = groupId;
    this.name = name;
    this.createdAt = createdAt;
  }

  static create(groupId: string, name: string): GroupPlayer {
    GroupPlayer.validateName(name);

    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new GroupPlayer(id, groupId, name, createdAt);
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Player name cannot be empty');
    }

    if (name.length > 25) {
      throw new Error('Player name cannot exceed 25 characters');
    }
  }
}
