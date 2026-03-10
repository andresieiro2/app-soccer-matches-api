import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { DrawResult } from '../enums';
import { Group } from './Group';
import { DefaultEntity } from './DefaultEntity';

@Entity('group_settings')
export class GroupSettings extends DefaultEntity {
  @Column({
    type: 'uuid',
    name: 'group_id',
  })
  public readonly groupId: string;

  @Column({
    type: 'int',
    name: 'max_match_duration_minutes',
    default: 10,
  })
  public readonly maxMatchDurationMinutes: number;

  @Column({
    type: 'int',
    name: 'max_goals',
    nullable: true,
    default: null,
  })
  public readonly maxGoals: number | null;

  @Column({
    type: 'int',
    name: 'max_consecutive_wins',
    nullable: true,
    default: null,
  })
  public readonly maxConsecutiveWins: number | null;

  @Column({
    type: 'varchar',
    length: 20,
    enum: DrawResult,
    name: 'draw_rule',
    default: DrawResult.HOME_WINS,
  })
  public readonly drawRule: DrawResult;

  @Column({
    type: 'int',
    name: 'team_size',
    default: 5,
  })
  public readonly teamSize: number;

  // Relationships
  @OneToOne(() => Group, (group: Group) => group.settings)
  @JoinColumn({ name: 'group_id' })
  public group?: Group;

  private constructor(
    id: string,
    groupId: string,
    maxMatchDurationMinutes: number,
    maxGoals: number | null,
    maxConsecutiveWins: number | null,
    drawRule: DrawResult,
    teamSize: number,
    createdAt: Date
  ) {
    super(id, createdAt);
    this.groupId = groupId;
    this.maxMatchDurationMinutes = maxMatchDurationMinutes;
    this.maxGoals = maxGoals;
    this.maxConsecutiveWins = maxConsecutiveWins;
    this.drawRule = drawRule;
    this.teamSize = teamSize;
  }

  static create(
    groupId: string,
    settings?: Partial<{
      maxMatchDurationMinutes: number;
      maxGoals: number | null;
      maxConsecutiveWins: number | null;
      drawRule: DrawResult;
      teamSize: number;
    }>
  ): GroupSettings {
    GroupSettings.validateSettings(settings);

    const id = crypto.randomUUID();
    const createdAt = new Date();

    return new GroupSettings(
      id,
      groupId,
      settings?.maxMatchDurationMinutes ?? 10,
      settings?.maxGoals ?? null,
      settings?.maxConsecutiveWins ?? null,
      settings?.drawRule ?? DrawResult.HOME_WINS,
      settings?.teamSize ?? 5,
      createdAt
    );
  }

  private static validateSettings(settings?: Partial<any>): void {
    if (
      settings?.maxMatchDurationMinutes &&
      settings.maxMatchDurationMinutes < 1
    ) {
      throw new Error('Match duration must be at least 1 minute');
    }

    if (
      settings?.teamSize &&
      (settings.teamSize < 2 || settings.teamSize > 11)
    ) {
      throw new Error('Team size must be between 2 and 11 players');
    }
  }
}
