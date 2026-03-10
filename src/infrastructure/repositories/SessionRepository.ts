import { ISessionRepository } from '../../domain/interfaces/repositories';
import { Session } from '../../domain/entities';
import { DefaultRepository } from './DefaultRepository';

export class SessionRepository
  extends DefaultRepository<Session>
  implements ISessionRepository
{
  constructor() {
    super(Session);
  }

  async findByGroupId(groupId: string): Promise<Session[]> {
    return await this.repository.find({ where: { groupId } });
  }

  async findActiveByGroupId(groupId: string): Promise<Session | null> {
    return await this.repository.findOne({
      where: { groupId, isActive: true },
    });
  }

  async endSession(sessionId: string): Promise<void> {
    const session = await this.repository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new Error('Session not found');
    }

    session.endSession();
    await this.repository.save(session);
  }
}
