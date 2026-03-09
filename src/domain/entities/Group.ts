import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { GroupPlayer } from './GroupPlayer';
import { GroupSettings } from './GroupSettings';
import { Session } from './Session';

@Entity('groups')
export class Group {
  @PrimaryColumn('uuid')
  public readonly id: string;

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
  @OneToMany(() => GroupPlayer, (groupPlayer) => groupPlayer.group)
  public players?: GroupPlayer[];

  @OneToMany(() => GroupSettings, (settings) => settings.group)
  public settings?: GroupSettings[];

  @OneToMany(() => Session, (session) => session.group)
  public sessions?: Session[];

  private constructor(id: string, name: string, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
  }

  // Factory Create Method
  static create(name: string): Group {
    Group.validateName(name);

    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new Group(id, name, createdAt);
  }

  // Valid Name Rule
  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Group name cannot be empty');
    }

    if (name.length > 25) {
      throw new Error('Group name cannot exceed 25 characters');
    }
  }
}
