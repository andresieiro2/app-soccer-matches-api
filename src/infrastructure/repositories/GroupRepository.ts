import { Group, Player } from '../../domain/entities';
import { PlayerType } from '../../domain/enums';
import { IGroupRepository } from '../../domain/interfaces/repositories';
import { DefaultRepository } from './DefaultRepository';
import { PlayerRepository } from './PlayerRepository';

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
}
