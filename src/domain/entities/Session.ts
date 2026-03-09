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
import { Group } from './Group';
import { SessionTeam } from './SessionTeam';
import { SessionPlayer } from './SessionPlayer';
import { Match } from './Match';

@Entity('sessions')
export class Session {
  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column({
    type: 'uuid',
    name: 'group_id',
  })
  public readonly groupId: string;

  @Column({
    type: 'int',
    name: 'max_duration_snapshot',
    nullable: false,
  })
  public readonly maxDurationSnapshot: number;

  @Column({
    type: 'int',
    name: 'max_goals_snapshot',
    nullable: true,
  })
  public readonly maxGoalsSnapshot: number | null;

  @Column({
    type: 'int',
    name: 'max_wins_snapshot',
    nullable: true,
  })
  public readonly maxWinsSnapshot: number | null;

  @Column({
    type: 'varchar',
    enum: DrawResult,
    name: 'draw_rule_snapshot',
  })
  public readonly drawRuleSnapshot: DrawResult;

  @Column({
    type: 'int',
    name: 'team_size_snapshot',
  })
  public readonly teamSizeSnapshot: number;

  @Column({
    type: 'boolean',
    name: 'is_active',
    default: true,
  })
  public isActive: boolean;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  public readonly createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'ended_at',
    nullable: true,
  })
  public endedAt: Date | null;

  @ManyToOne(() => Group, (group) => group.sessions)
  @JoinColumn({ name: 'group_id' })
  public group?: Group;

  @OneToMany(() => SessionTeam, (sessionTeam) => sessionTeam.session)
  public teams?: SessionTeam[];

  @OneToMany(() => SessionPlayer, (sessionPlayer) => sessionPlayer.session)
  public players?: SessionPlayer[];

  @OneToMany(() => Match, (match) => match.session)
  public matches?: Match[];

  private constructor(
    id: string,
    groupId: string,
    maxDurationSnapshot: number,
    maxGoalsSnapshot: number | null,
    maxWinsSnapshot: number | null,
    drawRuleSnapshot: DrawResult,
    teamSizeSnapshot: number,
    createdAt: Date
  ) {
    this.id = id;
    this.groupId = groupId;
    this.maxDurationSnapshot = maxDurationSnapshot;
    this.maxGoalsSnapshot = maxGoalsSnapshot;
    this.maxWinsSnapshot = maxWinsSnapshot;
    this.drawRuleSnapshot = drawRuleSnapshot;
    this.teamSizeSnapshot = teamSizeSnapshot;
    this.isActive = true;
    this.endedAt = null;
    this.createdAt = createdAt;
  }

  static create(
    groupId: string,
    groupSettings: {
      maxMatchDurationMinutes: number;
      maxGoals: number | null;
      maxConsecutiveWins: number | null;
      drawRule: DrawResult;
      teamSize: number;
    }
  ): Session {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new Session(
      id,
      groupId,
      groupSettings.maxMatchDurationMinutes,
      groupSettings.maxGoals,
      groupSettings.maxConsecutiveWins,
      groupSettings.drawRule,
      groupSettings.teamSize,
      createdAt
    );
  }

  endSession(): void {
    if (!this.isActive) {
      throw new Error('Session is already ended');
    }

    this.isActive = false;
    this.endedAt = new Date();
  }
}
