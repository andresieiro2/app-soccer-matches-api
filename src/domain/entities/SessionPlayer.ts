import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PlayerType } from '../enums';
import { Session } from './Session';
import { SessionTeam } from './SessionTeam';
import { GroupPlayer } from './GroupPlayer';
import { MatchEvent } from './MatchEvent';
import { DefaultEntity } from './DefaultEntity';

@Entity('session_players')
export class SessionPlayer extends DefaultEntity {
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

  @Column({
    type: 'uuid',
    name: 'group_player_id',
    nullable: true,
  })
  public readonly groupPlayerId: string | null;

  @Column({
    type: 'varchar',
    length: 25,
    name: 'fill_player_name',
    nullable: true,
  })
  public readonly fillPlayerName: string | null;

  @Column({
    type: 'varchar',
    enum: PlayerType,
    name: 'player_type',
  })
  public readonly playerType: PlayerType;

  // Relationships
  @ManyToOne(() => Session, (session: Session) => session.players)
  @JoinColumn({ name: 'session_id' })
  public session?: Session;

  @ManyToOne(
    () => SessionTeam,
    (sessionTeam: SessionTeam) => sessionTeam.players
  )
  @JoinColumn({ name: 'team_id' })
  public team?: SessionTeam;

  @ManyToOne(() => GroupPlayer, { nullable: true })
  @JoinColumn({ name: 'group_player_id' })
  public groupPlayer?: GroupPlayer;

  @OneToMany(
    () => MatchEvent,
    (matchEvent: MatchEvent) => matchEvent.sessionPlayer
  )
  public events?: MatchEvent[];

  private constructor(
    id: string,
    sessionId: string,
    teamId: string,
    groupPlayerId: string | null,
    fillPlayerName: string | null,
    playerType: PlayerType,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.sessionId = sessionId;
    this.teamId = teamId;
    this.groupPlayerId = groupPlayerId;
    this.fillPlayerName = fillPlayerName;
    this.playerType = playerType;
  }

  // Create group player in session
  static createGroupPlayer(
    sessionId: string,
    teamId: string,
    groupPlayerId: string
  ): SessionPlayer {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new SessionPlayer(
      id,
      sessionId,
      teamId,
      groupPlayerId,
      null,
      PlayerType.GROUP_PLAYER,
      createdAt
    );
  }

  // Create fill player in session
  static createFillPlayer(
    sessionId: string,
    teamId: string,
    fillPlayerName: string
  ): SessionPlayer {
    SessionPlayer.validateFillPlayerName(fillPlayerName);

    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new SessionPlayer(
      id,
      sessionId,
      teamId,
      null,
      fillPlayerName,
      PlayerType.FILL_PLAYER,
      createdAt
    );
  }

  // Get player display name
  getPlayerName(): string {
    if (this.playerType === PlayerType.GROUP_PLAYER) {
      // In real scenario, this would come from GroupPlayer relationship
      return 'Group Player'; // TODO: Get actual name from GroupPlayer
    }

    return this.fillPlayerName!;
  }

  // Check if player is fill player
  isFillPlayer(): boolean {
    return this.playerType === PlayerType.FILL_PLAYER;
  }

  private static validateFillPlayerName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Fill player name cannot be empty');
    }

    if (name.length > 25) {
      throw new Error('Fill player name cannot exceed 25 characters');
    }
  }
}
