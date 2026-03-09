import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MatchEventType } from '../enums';
import { Match } from './Match';
import { SessionPlayer } from './SessionPlayer';

@Entity('match_events')
export class MatchEvent {
  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column({
    type: 'uuid',
    name: 'match_id',
  })
  public readonly matchId: string;

  @Column({
    type: 'uuid',
    name: 'session_player_id',
  })
  public readonly sessionPlayerId: string;

  @Column({
    type: 'varchar',
    enum: MatchEventType,
    name: 'event_type',
  })
  public readonly eventType: MatchEventType;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  public readonly createdAt: Date;

  // Relationships
  @ManyToOne(() => Match, (match) => match.events)
  @JoinColumn({ name: 'match_id' })
  public match?: Match;

  @ManyToOne(() => SessionPlayer, (sessionPlayer) => sessionPlayer.events)
  @JoinColumn({ name: 'session_player_id' })
  public sessionPlayer?: SessionPlayer;

  private constructor(
    id: string,
    matchId: string,
    sessionPlayerId: string,
    eventType: MatchEventType,
    createdAt: Date
  ) {
    this.id = id;
    this.matchId = matchId;
    this.sessionPlayerId = sessionPlayerId;
    this.eventType = eventType;
    this.createdAt = createdAt;
  }

  static create(
    matchId: string,
    sessionPlayerId: string,
    eventType: MatchEventType
  ): MatchEvent {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new MatchEvent(id, matchId, sessionPlayerId, eventType, createdAt);
  }

  // Check if event affects score
  isScoreEvent(): boolean {
    return this.eventType === MatchEventType.GOAL;
  }

  // Check if event is disciplinary
  isDisciplinaryEvent(): boolean {
    return (
      this.eventType === MatchEventType.YELLOW_CARD ||
      this.eventType === MatchEventType.RED_CARD
    );
  }

  // Check if event prevents future events (red card)
  preventsPlayerEvents(): boolean {
    return this.eventType === MatchEventType.RED_CARD;
  }
}
