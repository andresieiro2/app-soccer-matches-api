import { Group, GroupSettings } from '../../entities';
import { PlayerType } from '../../enums';
import { IDefaultRepository } from './IDefaultRepository';

export interface IGroupRepository extends IDefaultRepository<Group> {
  create(name: string, settings?: Partial<GroupSettings>): Promise<Group>;
  addPlayer(
    groupId: string,
    playerName: string,
    playerType: PlayerType
  ): Promise<Group>;
}
