import { ISessionRepository } from '../../domain/interfaces/repositories';
import { Group, Player, Session, SessionTeam } from '../../domain/entities';
import { DefaultRepository } from './DefaultRepository';
import { EntityManager } from 'typeorm';

export class SessionRepository
  extends DefaultRepository<Session>
  implements ISessionRepository
{
  constructor() {
    super(Session, ['group', 'teams', 'players', 'matches']);
  }

  async create(name: string, groupId: string): Promise<Session> {
    return this.useTransaction(async (transaction) => {
      const group = await transaction.findOne(Group, {
        where: { id: groupId },
        relations: ['settings'],
      });

      if (!group) throw new Error('Group not found.');

      const session = Session.create(group?.id, name);

      return transaction.save(Session, session);
    });
  }

  async findByGroupId(groupId: string): Promise<Session[]> {
    return await this.repository.find({
      where: { groupId },
      relations: this.relations,
    });
  }

  async findActiveByGroupId(groupId: string): Promise<Session | null> {
    return await this.repository.findOne({
      where: { groupId, isActive: true },
      relations: this.relations,
    });
  }

  async endSession(sessionId: string): Promise<void> {
    const session = await this.findById(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    session.endSession();
    await this.save(session);
  }

  private async getSessionWithTeams(
    transaction: EntityManager,
    sessionId: string
  ): Promise<Session> {
    const session = await transaction.findOne(Session, {
      where: { id: sessionId },
      relations: this.relations,
    });

    if (!session) throw new Error('Session not found');

    if (!session.teams) throw new Error('Session without any teams');

    return session;
  }

  async addTeam(
    sessionId: string,
    teamName: string,
    teamColor: string,
    players: Player[]
  ): Promise<Session> {
    return this.useTransaction(async (transaction) => {
      const session = await this.getSessionWithTeams(transaction, sessionId);

      const queuePosition = session.teams!.length + 1;

      let team = SessionTeam.create(
        session.id,
        teamName,
        teamColor,
        queuePosition
      );

      team = await transaction.save(SessionTeam, team);

      session.teams!.push(team);

      return await transaction.save(Session, session);
    });
  }

  async removeTeam(sessionId: string, teamId: string): Promise<Session> {
    return this.useTransaction(async (transaction) => {
      const session = await this.getSessionWithTeams(transaction, sessionId);

      session.removeTeam(teamId);

      return await transaction.save(Session, session);
    });
  }

  async updateTeamQueue(
    sessionId: string,
    teamId: string,
    queuePosition: number
  ): Promise<Session> {
    return this.useTransaction(async (transaction) => {
      const session = await this.getSessionWithTeams(transaction, sessionId);

      const team = session.teams!.find((t) => t.id === teamId);
      if (!team) throw new Error('Team not found');

      team.updateQueuePosition(queuePosition);

      return await transaction.save(Session, session);
    });
  }
}
