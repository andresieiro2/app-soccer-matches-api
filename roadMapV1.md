# 🎯 Soccer Session Manager - RoadMap v1

## 📋 MÉTODOS FALTANTES POR REPOSITORY

### Status Legend:

- ❌ **Não implementado**
- 🔄 **Em progresso**
- ✅ **Implementado**
- ✅ **Testado**

---

## 🏠 **NÍVEL 1: GroupRepository** (Base do Sistema)

### **Gestão de Jogadores:**

- ✅ `addPlayer(groupId: string, playerName: string): Promise<GroupPlayer>`
- ✅ `removePlayer(groupId: string, playerId: string): Promise<void>`

### **Gestão de Configurações:**

- ✅ `updateSettings(groupId: string, settings: Partial<GroupSettings>): Promise<GroupSettings>`

### **Gestão de Sessões (overview):**

- ✅ `getSessions(groupId: string): Promise<Session[]>`
- ✅ `getActiveSession(groupId: string): Promise<Session | null>`

---

## 🎮 **NÍVEL 2: SessionRepository** (Orquestração de Partidas)

### **Gestão de Times:**

- ❌ `addTeam(sessionId: string, teamName: string, color: string): Promise<SessionTeam>`
- ❌ `removeTeam(sessionId: string, teamId: string): Promise<void>`
- ✅ `getTeams(sessionId: string): Promise<SessionTeam[]>`
- ❌ `updateTeamQueue(sessionId: string, teamId: string, position: number): Promise<void>`

### **Gestão de Jogadores na Sessão:**

- ❌ `addGroupPlayer(sessionId: string, groupPlayerId: string): Promise<SessionPlayer>`
- ❌ `addFillPlayer(sessionId: string, fillPlayerName: string): Promise<SessionPlayer>`
- ❌ `removeSessionPlayer(sessionId: string, sessionPlayerId: string): Promise<void>`
- ❌ `getSessionPlayers(sessionId: string): Promise<SessionPlayer[]>`
- ❌ `getSessionPlayersByTeam(sessionId: string, teamId: string): Promise<SessionPlayer[]>`

### **Gestão de Partidas:**

- ❌ `createMatch(sessionId: string, homeTeamId: string, challengerTeamId: string): Promise<Match>`
- ❌ `getCurrentMatch(sessionId: string): Promise<Match | null>`
- ❌ `getMatches(sessionId: string): Promise<Match[]>`

---

## ⚽ **NÍVEL 3: MatchRepository** (Eventos de Jogo)

### **Eventos de Partida:**

- ❌ `addGoal(matchId: string, sessionPlayerId: string, minute?: number): Promise<MatchEvent>`
- ❌ `addYellowCard(matchId: string, sessionPlayerId: string, minute?: number): Promise<MatchEvent>`
- ❌ `addRedCard(matchId: string, sessionPlayerId: string, minute?: number): Promise<MatchEvent>`
- ❌ `getEvents(matchId: string): Promise<MatchEvent[]>`
- ❌ `getEventsByPlayer(sessionPlayerId: string): Promise<MatchEvent[]>`

### **Gestão de Times na Partida:**

- ❌ `addPlayerToTeam(matchId: string, teamId: string, sessionPlayerId: string): Promise<void>`
- ❌ `removePlayerFromTeam(matchId: string, teamId: string, sessionPlayerId: string): Promise<void>`
- ❌ `getTeamPlayers(matchId: string, teamId: string): Promise<SessionPlayer[]>`
- ❌ `swapPlayerBetweenTeams(matchId: string, sessionPlayerId: string, newTeamId: string): Promise<void>`

### **Estatísticas e Relatórios:**

- ❌ `getPlayerStats(sessionPlayerId: string): Promise<PlayerStats>`
- ❌ `getTeamStats(teamId: string, sessionId?: string): Promise<TeamStats>`
- ❌ `getMatchStatistics(matchId: string): Promise<MatchStatistics>`

---

## 🎯 **NÍVEL 4: MatchEventRepository** (Detalhes de Eventos)

### **Gestão Avançada de Eventos:**

- ❌ `updateEvent(eventId: string, updates: Partial<MatchEvent>): Promise<MatchEvent>`
- ❌ `deleteEvent(eventId: string): Promise<void>`
- ❌ `getEventsByType(matchId: string, eventType: MatchEventType): Promise<MatchEvent[]>`
- ❌ `getGoalsByPlayer(sessionPlayerId: string): Promise<MatchEvent[]>`
- ❌ `getCardsByPlayer(sessionPlayerId: string): Promise<MatchEvent[]>`

---

## 📊 **INTERFACES NOVAS NECESSÁRIAS:**

### **Estatísticas:**

```typescript
interface PlayerStats {
  playerId: string;
  playerName: string;
  matchesPlayed: number;
  goals: number;
  yellowCards: number;
  redCards: number;
  wins: number;
  losses: number;
  draws: number;
}

interface TeamStats {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface MatchStatistics {
  matchId: string;
  duration: number; // em minutos
  totalGoals: number;
  totalCards: number;
  homeTeamStats: TeamStats;
  challengerTeamStats: TeamStats;
  events: MatchEvent[];
}
```

---

## 🛣️ **ORDEM DE IMPLEMENTAÇÃO SUGERIDA:**

1. **🏠 GroupRepository** - Base do sistema
2. **🎮 SessionRepository** - Orquestração
3. **⚽ MatchRepository** - Eventos de jogo
4. **📊 MatchEventRepository** - Detalhes
5. **🔧 Services Layer** - Business logic
6. **📡 Controllers** - API endpoints

---

## 📝 **PRÓXIMOS PASSOS:**

### **Para começar:**

1. Escolha uma classe (sugerido: GroupRepository)
2. Implemente um método por vez
3. Teste cada método
4. Marque como ✅ quando funcionar
5. Passe para o próximo

### **Padrão de implementação:**

- Sempre validar inputs
- Usar transações quando necessário
- Tratar erros específicos
- Retornar tipos corretos
- Documentar edge cases

---

_Última atualização: 10/03/2026_
_Status atual: Iniciando implementação_
