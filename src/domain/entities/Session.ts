import {
  Entity,
  Column,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Group } from './Group';
import { SessionTeam } from './SessionTeam';
import { Player } from './Player';
import { Match } from './Match';
import { DefaultEntity } from './DefaultEntity';

@Entity('sessions')
export class Session extends DefaultEntity {
  @Column({
    type: 'uuid',
    name: 'group_id',
  })
  public readonly groupId: string;

  @Column({
    type: 'varchar',

    length: 20,
    name: 'name',
  })
  public name: string;

  @Column({
    type: 'boolean',
    name: 'is_active',
    default: true,
  })
  public isActive: boolean;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'ended_at',
    nullable: true,
  })
  public endedAt: Date | null;

  @ManyToOne(() => Group, (group: Group) => group.sessions)
  @JoinColumn({ name: 'group_id' })
  public group?: Group;

  @OneToMany(
    () => SessionTeam,
    (sessionTeam: SessionTeam) => sessionTeam.session
  )
  public teams?: SessionTeam[];

  @OneToMany(() => Player, (Player: Player) => Player.session)
  public players?: Player[];

  @OneToMany(() => Match, (match: Match) => match.session)
  public matches?: Match[];

  private constructor(
    id: string,
    groupId: string,
    name: string,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.groupId = groupId;
    this.name = name;
    this.isActive = true;
    this.endedAt = null;
  }

  static create(groupId: string, name: string): Session {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new Session(id, groupId, name, createdAt);
  }

  endSession(): void {
    if (!this.isActive) {
      throw new Error('Session is already ended');
    }

    this.isActive = false;
    this.endedAt = new Date();
  }

  removeTeam(teamId: string): void {
    if (!this.teams) return;
    this.teams = this.teams?.filter((t) => t.id !== teamId);
  }
}
