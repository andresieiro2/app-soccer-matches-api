import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from './DefaultEntity';
import { Player } from './Player';
import { Session } from './Session';
import { SessionTeam } from './SessionTeam';

@Entity('session_team_players')
export class SessionTeamPlayer extends DefaultEntity {
  @Column({
    type: 'uuid',
    name: 'player_id',
  })
  public readonly playerId: string;

  @Column({
    type: 'uuid',
    name: 'session_id',
  })
  public readonly sessionId: string;

  @Column({
    type: 'uuid',
    name: 'team_id',
  })
  public readonly teamId: string;

  // Relationships
  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  public player?: Player;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  public session?: Session;

  @ManyToOne(() => SessionTeam)
  @JoinColumn({ name: 'team_id' })
  public team?: SessionTeam;

  private constructor(
    id: string,
    playerId: string,
    sessionId: string,
    teamId: string,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.playerId = playerId;
    this.sessionId = sessionId;
    this.teamId = teamId;
  }

  static create(
    playerId: string,
    sessionId: string,
    teamId: string
  ): SessionTeamPlayer {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new SessionTeamPlayer(id, playerId, sessionId, teamId, createdAt);
  }
}
