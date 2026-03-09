import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Session } from './Session';
import { SessionPlayer } from './SessionPlayer';
import { Match } from './Match';

@Entity('session_teams')
export class SessionTeam {
  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column({
    type: 'uuid',
    name: 'session_id',
  })
  public readonly sessionId: string;

  @Column({
    type: 'varchar',
    length: 25,
    name: 'team_name',
  })
  public readonly teamName: string;

  @Column({
    type: 'varchar',
    length: 7,
    name: 'color',
  })
  public readonly color: string;

  @Column({
    type: 'int',
    name: 'queue_position',
  })
  public queuePosition: number;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  public readonly createdAt: Date;

  // Relationships
  @ManyToOne(() => Session, (session) => session.teams)
  @JoinColumn({ name: 'session_id' })
  public session?: Session;

  @OneToMany(() => SessionPlayer, (sessionPlayer) => sessionPlayer.team)
  public players?: SessionPlayer[];

  @OneToMany(() => Match, (match) => match.homeTeam)
  public homeMatches?: Match[];

  @OneToMany(() => Match, (match) => match.challengerTeam)
  public challengerMatches?: Match[];

  private constructor(
    id: string,
    sessionId: string,
    teamName: string,
    color: string,
    queuePosition: number,
    createdAt: Date
  ) {
    this.id = id;
    this.sessionId = sessionId;
    this.teamName = teamName;
    this.color = color;
    this.queuePosition = queuePosition;
    this.createdAt = createdAt;
  }

  static create(
    sessionId: string,
    teamName: string,
    color: string,
    queuePosition: number
  ): SessionTeam {
    SessionTeam.validateTeamName(teamName);
    SessionTeam.validateColor(color);
    SessionTeam.validateQueuePosition(queuePosition);

    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new SessionTeam(
      id,
      sessionId,
      teamName,
      color,
      queuePosition,
      createdAt
    );
  }

  // Update queue position (for team rotation)
  updateQueuePosition(newPosition: number): void {
    SessionTeam.validateQueuePosition(newPosition);
    this.queuePosition = newPosition;
  }

  private static validateTeamName(teamName: string): void {
    if (!teamName || teamName.trim().length === 0) {
      throw new Error('Team name cannot be empty');
    }

    if (teamName.length > 25) {
      throw new Error('Team name cannot exceed 25 characters');
    }
  }

  private static validateColor(color: string): void {
    // Validate hex color format (#RRGGBB)
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    if (!hexColorRegex.test(color)) {
      throw new Error('Color must be a valid hex color format (#RRGGBB)');
    }
  }

  private static validateQueuePosition(position: number): void {
    if (position < 0) {
      throw new Error('Queue position cannot be negative');
    }
  }
}
