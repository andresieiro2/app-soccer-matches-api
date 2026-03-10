import { Group } from '../../entities';
import { PlayerType } from '../../enums';
import { IDefaultRepository } from './IDefaultRepository';

export interface IGroupRepository extends IDefaultRepository<Group> {
  addPlayer(
    groupId: string,
    playerName: string,
    playerType: PlayerType
  ): Promise<Group>;
}
