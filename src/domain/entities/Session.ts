import {
  Entity,
  Column,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DrawResult } from '../enums';
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
    length: 20,
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
    maxDurationSnapshot: number,
    maxGoalsSnapshot: number | null,
    maxWinsSnapshot: number | null,
    drawRuleSnapshot: DrawResult,
    teamSizeSnapshot: number,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.groupId = groupId;
    this.maxDurationSnapshot = maxDurationSnapshot;
    this.maxGoalsSnapshot = maxGoalsSnapshot;
    this.maxWinsSnapshot = maxWinsSnapshot;
    this.drawRuleSnapshot = drawRuleSnapshot;
    this.teamSizeSnapshot = teamSizeSnapshot;
    this.isActive = true;
    this.endedAt = null;
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
