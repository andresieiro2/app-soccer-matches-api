import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { GroupSettings } from './GroupSettings';
import { Session } from './Session';
import { DefaultEntity } from './DefaultEntity';
import { Player } from './Player';

@Entity('groups')
export class Group extends DefaultEntity {
  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  public readonly name: string;

  @Column({
    type: 'uuid',
    name: 'settings_id',
    nullable: true,
    default: null,
  })
  public readonly settings_id: string | null;

  // Relationships
  @OneToOne(() => GroupSettings, (settings: GroupSettings) => settings.group)
  @JoinColumn({ name: 'settings_id' })
  public settings?: GroupSettings;

  @OneToMany(() => Session, (session: Session) => session.group)
  public sessions?: Session[];

  @OneToMany(() => Player, (player: Player) => player.group)
  public players?: Player[];

  private constructor(
    id: string,
    name: string,
    settings_id: string | null,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.name = name;
    this.settings_id = settings_id;
  }

  static create(name: string): Group {
    Group.validateName(name);

    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new Group(id, name, null, createdAt);
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

  addPlayer(player: Player): void {
    if (!this.players) {
      this.players = [];
    }
    this.players.push(player);
  }
}
