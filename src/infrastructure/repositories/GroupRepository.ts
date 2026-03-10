import { Group, Player } from '../../domain/entities';
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

  async addPlayer(
    groupId: string,
    playerName: string,
    playerType: PlayerType
  ): Promise<Group> {
    return await this.useTransaction(async (transaction) => {
      const group = await transaction.findOne(Group, {
        where: { id: groupId },
        relations: ['players'],
      });

      if (!group) throw new Error('Group not found.');

      try {
        const player = Player.create(group.id, playerName, playerType);
        const savedPlayer = await transaction.save(Player, player);

        group.addPlayer(savedPlayer);

        return await transaction.save(Group, group);
      } catch (error: any) {
        throw new Error(`Failed to add player: ${error.message}`);
      }
    });
  }

  async deletePlayer(groupId: string, playerId: string): Promise<Group> {
    return await this.useTransaction(async (transaction) => {
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

      try {
        group.removePlayer(player);

        await transaction.delete(Player, player.id);

        return await transaction.save(Group, group);
      } catch (error: any) {
        throw new Error(`Failed to remove player: ${error.message}`);
      }
    });
  }
}
