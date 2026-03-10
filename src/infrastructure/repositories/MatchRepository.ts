import { IMatchRepository } from '../../domain/interfaces/repositories';
import { Match } from '../../domain/entities';
import { IsNull } from 'typeorm';
import { DefaultRepository } from './DefaultRepository';

export class MatchRepository
  extends DefaultRepository<Match>
  implements IMatchRepository
{
  constructor() {
    super(Match);
  }

  async findActiveBySessionId(sessionId: string): Promise<Match | null> {
    return await this.repository.findOne({
      where: { sessionId, endedAt: IsNull() },
    });
  }

  async findBySessionId(sessionId: string): Promise<Match[]> {
    return await this.repository.find({ where: { sessionId } });
  }

  async updateScore(
    id: string,
    homeScore: number,
    challengerScore: number
  ): Promise<void> {
    const match = await this.findById(id);
    if (!match) {
      throw new Error('Match not found.');
    }

    match.updateScore(homeScore, challengerScore);
    await this.save(match);
  }

  async endMatch(id: string): Promise<void> {
    const match = await this.findById(id);
    if (!match) {
      throw new Error('match not found.');
    }
    match.endMatch();
    await this.save(match);
  }
}
