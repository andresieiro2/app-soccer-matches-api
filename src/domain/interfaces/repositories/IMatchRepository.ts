import { Match } from '../../entities';
import { IDefaultRepository } from './IDefaultRepository';

export interface IMatchRepository extends IDefaultRepository<Match> {
  findActiveBySessionId(sessionId: string): Promise<Match | null>;
  findBySessionId(sessionId: string): Promise<Match[]>;
  updateScore(
    matchId: string,
    homeScore: number,
    challengerScore: number
  ): Promise<void>;
  endMatch(matchId: string): Promise<void>;
}
