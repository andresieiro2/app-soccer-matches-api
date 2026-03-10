import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PlayerType } from '../enums';
import { Session } from './Session';
import { SessionTeam } from './SessionTeam';
import { MatchEvent } from './MatchEvent';
import { DefaultEntity } from './DefaultEntity';
import { Group } from './Group';

@Entity('players')
export class Player extends DefaultEntity {
  @Column({
    type: 'uuid',
    name: 'group_id',
    nullable: true,
  })
  public readonly group_id: string | null;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 25,
  })
  public readonly name: string;

  @Column({
    type: 'varchar',
    enum: PlayerType,
    name: 'player_type',
    length: 20,
  })
  public readonly playerType: PlayerType;

  // Relationships
  @ManyToOne(() => Session, (session: Session) => session.players, {
    nullable: true,
  })
  @JoinColumn({ name: 'session_id' })
  public session?: Session;

  @ManyToOne(
    () => SessionTeam,
    (sessionTeam: SessionTeam) => sessionTeam.players
  )
  @JoinColumn({ name: 'team_id' })
  public team?: SessionTeam;

  @ManyToOne(() => Group, (group: Group) => group.players, {
    nullable: true,
  })
  @JoinColumn({ name: 'group_id' })
  public group?: Group;

  @OneToMany(
    () => MatchEvent,
    (matchEvent: MatchEvent) => matchEvent.sessionPlayer
  )
  public events?: MatchEvent[];

  private constructor(
    id: string,
    group_id: string | null,
    name: string,
    playerType: PlayerType,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.group_id = group_id;
    this.name = name;
    this.playerType = playerType;
  }

  // Create player in group
  static create(
    group_id: string,
    name: string,
    playerType: PlayerType
  ): Player {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    const type =
      playerType === PlayerType.GROUP_PLAYER
        ? PlayerType.GROUP_PLAYER
        : PlayerType.FILL_PLAYER;

    return new Player(id, group_id, name, type, createdAt);
  }

  // Check if player is fill player
  isFillPlayer(): boolean {
    return this.playerType === PlayerType.FILL_PLAYER;
  }
}
