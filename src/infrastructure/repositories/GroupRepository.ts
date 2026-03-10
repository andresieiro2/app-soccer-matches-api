import { Group } from '../../domain/entities';
import { IGroupRepository } from '../../domain/interfaces/repositories';
import { DefaultRepository } from './DefaultRepository';

export class GroupRepository
  extends DefaultRepository<Group>
  implements IGroupRepository
{
  constructor() {
    super(Group);
  }
}
