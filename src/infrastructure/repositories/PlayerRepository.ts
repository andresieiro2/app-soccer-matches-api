import { Player } from '../../domain/entities';

import { IPlayerRepository } from '../../domain/interfaces/repositories/IPlayerRepository';
import { DefaultRepository } from './DefaultRepository';

export class PlayerRepository
  extends DefaultRepository<Player>
  implements IPlayerRepository
{
  constructor() {
    super(Player);
  }
}
