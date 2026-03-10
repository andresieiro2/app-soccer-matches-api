import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MatchEventType } from '../enums';
import { Match } from './Match';
import { SessionPlayer } from './SessionPlayer';
import { DefaultEntity } from './DefaultEntity';

@Entity('match_events')
export class MatchEvent extends DefaultEntity {
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

  // Relationships
  @ManyToOne(() => Match, (match: Match) => match.events)
  @JoinColumn({ name: 'match_id' })
  public match?: Match;

  @ManyToOne(
    () => SessionPlayer,
    (sessionPlayer: SessionPlayer) => sessionPlayer.events
  )
  @JoinColumn({ name: 'session_player_id' })
  public sessionPlayer?: SessionPlayer;

  private constructor(
    id: string,
    matchId: string,
    sessionPlayerId: string,
    eventType: MatchEventType,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.matchId = matchId;
    this.sessionPlayerId = sessionPlayerId;
    this.eventType = eventType;
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
