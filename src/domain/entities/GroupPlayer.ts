import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from './Group';
import { DefaultEntity } from './DefaultEntity';

@Entity('group_players')
export class GroupPlayer extends DefaultEntity {
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

  // Relationships
  @ManyToOne(() => Group, (group: Group) => group.players)
  @JoinColumn({ name: 'group_id' })
  public group?: Group;

  private constructor(
    id: string,
    groupId: string,
    name: string,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.groupId = groupId;
    this.name = name;
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
