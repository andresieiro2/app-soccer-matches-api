import { Session } from '../../entities';
import { IDefaultRepository } from './IDefaultRepository';

export interface ISessionRepository extends IDefaultRepository<Session> {
  findByGroupId(groupId: string): Promise<Session[]>;
  findActiveByGroupId(groupId: string): Promise<Session | null>;
  endSession(sessionId: string): Promise<void>;
}
