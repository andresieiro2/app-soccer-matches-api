import { Entity, Column, OneToMany } from 'typeorm';
import { GroupPlayer } from './GroupPlayer';
import { GroupSettings } from './GroupSettings';
import { Session } from './Session';
import { DefaultEntity } from './DefaultEntity';

@Entity('groups')
export class Group extends DefaultEntity {
  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  public readonly name: string;

  // Relationships
  @OneToMany(() => GroupPlayer, (groupPlayer: GroupPlayer) => groupPlayer.group)
  public players?: GroupPlayer[];

  @OneToMany(() => GroupSettings, (settings: GroupSettings) => settings.group)
  public settings?: GroupSettings[];

  @OneToMany(() => Session, (session: Session) => session.group)
  public sessions?: Session[];

  private constructor(id: string, name: string, createdAt: Date) {
    super(id, createdAt);
    this.name = name;
  }

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
