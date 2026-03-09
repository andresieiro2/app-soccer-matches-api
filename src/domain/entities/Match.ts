import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DrawResult } from '../enums';
import { Session } from './Session';
import { SessionTeam } from './SessionTeam';
import { MatchEvent } from './MatchEvent';

@Entity('matches')
export class Match {
  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column({
    type: 'uuid',
    name: 'session_id',
  })
  public readonly sessionId: string;

  @Column({
    type: 'int',
    name: 'sequence_number',
  })
  public readonly sequencvarcharber: number;

  @Column({
    type: 'uuid',
    name: 'home_team_id',
  })
  public readonly homeTeamId: string;

  @Column({
    type: 'uuid',
    name: 'challenger_team_id',
  })
  public readonly challengerTeamId: string;

  @Column({
    type: 'int',
    name: 'home_score',
    default: 0,
  })
  public homeScore: number;

  @Column({
    type: 'int',
    name: 'challenger_score',
    default: 0,
  })
  public challengerScore: number;

  @Column({
    type: 'varchar',
    enum: DrawResult,
    name: 'draw_result',
    nullable: true,
  })
  public drawResult: DrawResult | null;

  @CreateDateColumn({
    type: 'datetime',
    name: 'started_at',
  })
  public readonly startedAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'ended_at',
    nullable: true,
  })
  public endedAt: Date | null;

  // Relationships
  @ManyToOne(() => Session, (session) => session.matches)
  @JoinColumn({ name: 'session_id' })
  public session?: Session;

  @ManyToOne(() => SessionTeam, (sessionTeam) => sessionTeam.homeMatches)
  @JoinColumn({ name: 'home_team_id' })
  public homeTeam?: SessionTeam;

  @ManyToOne(() => SessionTeam, (sessionTeam) => sessionTeam.challengerMatches)
  @JoinColumn({ name: 'challenger_team_id' })
  public challengerTeam?: SessionTeam;

  @OneToMany(() => MatchEvent, (matchEvent) => matchEvent.match)
  public events?: MatchEvent[];

  private constructor(
    id: string,
    sessionId: string,
    sequencvarcharber: number,
    homeTeamId: string,
    challengerTeamId: string,
    startedAt: Date
  ) {
    this.id = id;
    this.sessionId = sessionId;
    this.sequencvarcharber = sequencvarcharber;
    this.homeTeamId = homeTeamId;
    this.challengerTeamId = challengerTeamId;
    this.homeScore = 0;
    this.challengerScore = 0;
    this.drawResult = null;
    this.startedAt = startedAt;
    this.endedAt = null;
  }

  static create(
    sessionId: string,
    sequencvarcharber: number,
    homeTeamId: string,
    challengerTeamId: string
  ): Match {
    Match.validateTeamIds(homeTeamId, challengerTeamId);

    const id = crypto.randomUUID();
    const startedAt = new Date();

    return new Match(
      id,
      sessionId,
      sequencvarcharber,
      homeTeamId,
      challengerTeamId,
      startedAt
    );
  }

  // End match (can be draw or normal finish)
  endMatch(drawResult?: DrawResult): void {
    if (this.endedAt !== null) {
      throw new Error('Match is already ended');
    }

    this.endedAt = new Date();
    this.drawResult = drawResult || null;
  }

  // Check if match is active
  isActive(): boolean {
    return this.endedAt === null;
  }

  // Check if match ended in draw
  isDraw(): boolean {
    return this.homeScore === this.challengerScore && this.endedAt !== null;
  }

  // Get winner team ID (null if draw or ongoing)
  getWinnerTeamId(): string | null {
    if (!this.endedAt || this.isDraw()) {
      return null;
    }

    return this.homeScore > this.challengerScore
      ? this.homeTeamId
      : this.challengerTeamId;
  }

  // Update scores (called by match events)
  updateScore(homeScore: number, challengerScore: number): void {
    if (!this.isActive()) {
      throw new Error('Cannot update score of ended match');
    }

    if (homeScore < 0 || challengerScore < 0) {
      throw new Error('Scores cannot be negative');
    }

    this.homeScore = homeScore;
    this.challengerScore = challengerScore;
  }

  private static validateTeamIds(
    homeTeamId: string,
    challengerTeamId: string
  ): void {
    if (homeTeamId === challengerTeamId) {
      throw new Error('Home team and challenger team must be different');
    }
  }
}
