import { Group, GroupSettings, Player } from '../../domain/entities';
import { PlayerType } from '../../domain/enums';
import { IGroupRepository } from '../../domain/interfaces/repositories';
import { DefaultRepository } from './DefaultRepository';

export class GroupRepository
  extends DefaultRepository<Group>
  implements IGroupRepository
{
  constructor() {
    super(Group);
  }

  async create(
    name: string,
    settings?: Partial<GroupSettings>
  ): Promise<Group> {
    return this.useTransaction(async (transaction) => {
      let group = Group.create(name);
      group = await transaction.save(Group, group);

      let groupSettings = GroupSettings.create(group.id, settings);
      groupSettings = await transaction.save(GroupSettings, groupSettings);

      group.settings_id = groupSettings.id;

      return await transaction.save(Group, group);
    });
  }

  async addPlayer(
    groupId: string,
    playerName: string,
    playerType: PlayerType
  ): Promise<Group> {
    return this.useTransaction(async (transaction) => {
      const group = await transaction.findOne(Group, {
        where: { id: groupId },
        relations: ['players'],
      });

      if (!group) throw new Error('Group not found.');

      let player = Player.create(group.id, playerName, playerType);
      player = await transaction.save(Player, player);

      group.addPlayer(player);

      return await transaction.save(Group, group);
    });
  }

  async deletePlayer(groupId: string, playerId: string): Promise<Group> {
    return this.useTransaction(async (transaction) => {
      const group = await transaction.findOne(Group, {
        where: { id: groupId },
        relations: ['players'],
      });

      if (!group) throw new Error('Group not found.');

      const player = await transaction.findOne(Player, {
        where: { id: playerId },
      });

      if (!player) throw new Error('Player not found.');

      if (player.group_id !== groupId) {
        throw new Error('Player does not belong to this group.');
      }

      group.removePlayer(player);

      await transaction.delete(Player, player.id);

      return await transaction.save(Group, group);
    });
  }
}
