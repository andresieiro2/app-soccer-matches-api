# Soccer Session Manager ⚽

## 🏆 Overview

**Soccer Session Manager** is a robust application for managing informal soccer matches ("pickup games"). The system allows organizing sessions, managing teams and players, recording real-time match events, applying configurable complex rules, and exporting detailed statistics.

**Design Principles:**
- ✨ **Simplicity** - Intuitive interface for organizers
- 🔧 **Flexibility** - Configurable rules per group
- 📊 **Historical Accuracy** - Immutable and auditable data
- 🎮 **Manual Control** - User has full control over edits

## 🎯 Project Goals

### **Core Features**
- ✅ **Group Management** - Multiple independent groups
- ✅ **Match Sessions** - Organization of game days
- ✅ **Dynamic Teams** - Team management within sessions
- ✅ **Dual Player System** - Fixed (`session_player`) and temporary (`fill_player`)
- ✅ **Real-time Events** - Goals, cards, assists with timestamps
- ✅ **Advanced Rules** - Automatic rotation, consecutive win limits
- ✅ **Smart Queue** - Automatic rotation for 3+ teams
- ✅ **Clean Statistics** - Automatic exclusion of temporary players
- ✅ **Professional Export** - XLS reports for analysis

### **Advanced Features**
- 🔄 **Timeline Editing** - Insert/remove/reorder matches
- ⚖️ **Draw Rules** - Multiple configurable strategies
- 🚫 **Ejection System** - Automatic control of ejected players
- 📈 **Immutable Snapshots** - Fixed rules per session
- 🎯 **Rigorous Validations** - Prevent inconsistent data

## 🛠️ Tech Stack

### Core
- **TypeScript** - Primary language
- **Node.js** - Runtime
- **TypeORM** - ORM for persistence
- **SQLite** - Initial database (with abstraction for migration)

### Development
- **Visual Studio Code** - Recommended IDE
- **Jest** - Unit testing
- **ESLint + Prettier** - Code quality

### Future
- **REST API** - Service layer
- **React/React Native** - Mobile interface
- **PostgreSQL** - Database migration

## 🏗️ Architecture & Data Model

### Clean Architecture Principles

```
┌─────────────────┐
│   Presentation  │  ← CLI/Web/API
├─────────────────┤
│   Application   │  ← Use Cases & Services
├─────────────────┤
│     Domain      │  ← Entities & Business Rules
├─────────────────┤
│ Infrastructure  │  ← Repositories & External
└─────────────────┘
```

### Entity Relationship Diagram (ER)

```
┌─────────────────┐    1:N    ┌─────────────────┐
│     GROUP       ├──────────►│  GROUP PLAYER   │
├─────────────────┤           ├─────────────────┤
│ id (PK)         │           │ id (PK)         │
│ name            │           │ groupId (FK)    │
│ createdAt       │           │ name            │
└─────────────────┘           │ createdAt       │
         │                    └─────────────────┘
         │ 1:1
         ▼
┌─────────────────┐    1:N    ┌─────────────────┐
│ GROUP SETTINGS  ├──────────►│     SESSION     │
├─────────────────┤           ├─────────────────┤
│ id (PK)         │           │ id (PK)         │
│ groupId (FK)    │           │ groupId (FK)    │
│ teamSize        │           │ *Snapshots...   │
│ maxDuration...  │           │ startedAt       │
│ maxGoals        │           │ endedAt         │
│ maxConsWins     │           └─────────────────┘
│ drawRule        │                    │
└─────────────────┘                    │ 1:N
                                       ▼
┌─────────────────┐    1:N    ┌─────────────────┐
│  SESSION TEAM   ├──────────►│     MATCH       │
├─────────────────┤           ├─────────────────┤
│ id (PK)         │           │ id (PK)         │
│ sessionId (FK)  │           │ sessionId (FK)  │
│ teamName        │           │ sequenceNumber  │
│ queuePosition   │           │ homeTeamId (FK) │
│ createdAt       │           │ challTeamId(FK) │
└─────────────────┘           │ homeScore       │
         │                    │ challengerScore │
         │ 1:N                │ drawResult      │
         ▼                    │ startedAt       │
┌─────────────────┐           │ endedAt         │
│ SESSION PLAYER  │           └─────────────────┘
├─────────────────┤                    │
│ id (PK)         │                    │ 1:N
│ sessionId (FK)  │                    ▼
│ groupPlayerId   │           ┌─────────────────┐
│ sessionTeamId   │           │  MATCH EVENT    │
│ playerType      │           ├─────────────────┤
│ checkInAt       │           │ id (PK)         │
│ checkOutAt      │           │ matchId (FK)    │
└─────────────────┘           │ sessionPlayerId │
                              │ assistPlayerId  │
                              │ eventType       │
                              │ createdAt       │
                              └─────────────────┘
```

**Key Relationships:**
- `Group` → `GroupPlayer` (1:N) - Permanent group players
- `Group` → `GroupSettings` (1:1) - Global configuration
- `Group` → `Session` (1:N) - Game sessions
- `Session` → `SessionTeam` (1:N) - Session teams
- `Session` → `SessionPlayer` (1:N) - Participating players
- `Session` → `Match` (1:N) - Session matches
- `Match` → `MatchEvent` (1:N) - Match events

### Directory Structure

```
src/
├── domain/
│   ├── entities/           # Entidades do domínio
│   │   ├── Group.ts
│   │   ├── GroupPlayer.ts
│   │   ├── GroupSettings.ts
│   │   ├── Session.ts
│   │   ├── SessionTeam.ts
│   │   ├── SessionPlayer.ts
│   │   ├── Match.ts
│   │   └── MatchEvent.ts
│   ├── enums/              # Enumerações
│   │   ├── PlayerType.ts
│   │   ├── MatchEventType.ts
│   │   └── DrawResult.ts
│   ├── interfaces/         # Contratos de repositórios
│   └── services/           # Serviços de domínio
├── application/
│   ├── use-cases/          # Casos de uso
│   │   ├── session/
│   │   ├── match/
│   │   └── statistics/
│   └── services/           # Serviços de aplicação
├── infrastructure/
│   ├── repositories/       # Implementações concretas
│   │   ├── typeorm/
│   │   └── in-memory/      # Para testes
│   ├── persistence/        # Configuração de banco
│   └── external/           # Serviços externos
├── presentation/
│   ├── cli/                # Interface linha de comando
│   ├── web/                # Interface web (futuro)
│   └── api/                # REST API (futuro)
└── config/                 # Configurações
```

## 🏪 Domínio & Entidades

### **Entidades Fundamentais**

#### **Group** (Agregado Raiz)
```typescript
class Group {
  id: string
  name: string
  players: GroupPlayer[]        // Jogadores permanentes
  settings: GroupSettings       // Configurações do grupo
  sessions: Session[]           // Histórico de sessões
  createdAt: Date
}
```

#### **GroupSettings** (Configuração Global)
```typescript
class GroupSettings {
  id: string
  groupId: string
  teamSize: number                    // Ex: 5 (futsal), 11 (campo)
  maxMatchDurationMinutes: number     // Ex: 15, 20, 30 min
  maxGoals: number                    // Ex: 3, 5 gols
  maxConsecutiveWins: number          // Ex: 2, 3 vitórias seguidas
  drawRule: DrawRule                  // Como resolver empates
}
```

#### **Session** (Agregado Raiz - Sessão de Jogo)
```typescript
class Session {
  id: string
  groupId: string
  teams: SessionTeam[]
  players: SessionPlayer[]
  matches: Match[]
  
  // 📸 SNAPSHOT DE REGRAS (Imutável durante a sessão)
  teamSizeSnapshot: number
  maxMatchDurationMinutesSnapshot: number
  maxGoalsSnapshot: number
  maxConsecutiveWinsSnapshot: number
  drawRuleSnapshot: DrawRule
  
  startedAt: Date
  endedAt?: Date
  isActive: boolean
}
```

#### **SessionTeam** (Time da Sessão)
```typescript
class SessionTeam {
  id: string
  sessionId: string
  teamName: string
  queuePosition: number     // Usado apenas para 3+ times
  createdAt: Date
}
```

#### **SessionPlayer** (Jogador na Sessão)
```typescript
class SessionPlayer {
  id: string
  sessionId: string
  sessionTeamId: string
  groupPlayerId?: string    // NULL para fill players
  playerType: PlayerType    // 'session_player' | 'fill_player'
  checkInAt: Date
  checkOutAt?: Date
}
```

#### **Match** (Agregado Raiz - Partida)
```typescript
class Match {
  id: string
  sessionId: string
  sequenceNumber: number    // Posição na timeline
  homeTeamId: string
  challengerTeamId: string
  
  // 📊 SCORES CALCULADOS AUTOMATICAMENTE
  homeScore: number         // Derivado de eventos 'goal'
  challengerScore: number   // Derivado de eventos 'goal'
  drawResult?: DrawResult   // 'home_stays' | 'challenger_stays'
  
  events: MatchEvent[]
  startedAt: Date
  endedAt?: Date
}
```

#### **MatchEvent** (Evento da Partida)
```typescript
class MatchEvent {
  id: string
  matchId: string
  sessionPlayerId: string   // Quem fez a ação
  assistPlayerId?: string   // Quem deu assistência (só para gols)
  eventType: MatchEventType // 'goal' | 'yellow_card' | 'red_card'
  createdAt: Date          // Ordem cronológica dos eventos
}
```

### **Enumerações Importantes**

```typescript
enum PlayerType {
  SESSION_PLAYER = 'session_player',    // Jogador oficial do grupo
  FILL_PLAYER = 'fill_player'           // Jogador temporário
}

enum MatchEventType {
  GOAL = 'goal',
  YELLOW_CARD = 'yellow_card',
  RED_CARD = 'red_card'
}

enum DrawRule {
  HOME_STAYS = 'home_stays',            // Time da casa fica
  CHALLENGER_STAYS = 'challenger_stays', // Time visitante fica
  MANUAL_SELECTION = 'manual_selection', // Usuário escolhe
  COIN_TOSS = 'coin_toss'               // Sorteio automático
}
```

## ⚙️ Regras de Negócio Detalhadas

### **📋 1. Configuração e Snapshots**

#### **Regras de Configuração Global (GroupSettings)**
- `teamSize`: Tamanho fixo dos times (ex: 5 para futsal, 11 para campo)
- `maxMatchDurationMinutes`: Duração máxima das partidas
- `maxGoals`: Número de gols para finalizar partida
- `maxConsecutiveWins`: Limite de vitórias consecutivas
- `drawRule`: Como resolver empates em sistemas de rotação

#### **Sistema de Snapshots Imutáveis**
```typescript
// ✅ Ao criar sessão: regras são copiadas e "congeladas"
const session = new Session({
  teamSizeSnapshot: group.settings.teamSize,
  maxGoalsSnapshot: group.settings.maxGoals,
  // ... outros snapshots
});

// ❌ Mudanças futuras no grupo NÃO afetam sessões existentes
group.settings.maxGoals = 10;  // Não afeta sessões já criadas
```

### **👥 2. Sistema Dual de Jogadores**

#### **Session Players (Jogadores Oficiais)**
- ✅ Referência a `GroupPlayer` existente
- ✅ Incluídos em estatísticas permanentes
- ✅ Incluídos em exportações XLS
- ✅ Podem trocar de time em futuras sessões
- ✅ Histórico permanente no grupo

#### **Fill Players (Jogadores Temporários)**
```typescript
// Exemplo de fill players na interface
interface TeamDisplay {
  players: [
    "João Silva",      // session_player
    "Maria Santos",    // session_player
    "completa 1",      // fill_player
    "completa 2"       // fill_player
  ]
}
```

**Características dos Fill Players:**
- ❌ **NÃO** referenciam `GroupPlayer`
- ✅ Podem marcar gols e dar assistências
- ✅ Podem receber cartões
- ❌ **NÃO** aparecem em estatísticas permanentes
- ❌ **NÃO** são exportados para XLS
- ❌ **NÃO** se tornam jogadores permanentes
- 🔒 Fixos ao time onde foram criados

### **🔄 3. Fluxos de Partida**

#### **Cenário: 2 Times**
```
Time A ⚽ Time B
      ↓ (Partida termina)
Time A ⚽ Time B  (Mesmos times, sem rotação)
```

**Regras:**
- ❌ Sem sistema de fila
- ❌ Sem regras de rotação  
- ❌ Regras de empate não se aplicam
- ✅ Partida termina e reinicia com mesmos times

#### **Cenário: 3+ Times (Sistema de Rotação)**
```
Quadra: [Time A] vs [Time B]
Fila:   Time C → Time D → Time E

1. Time A vence Time B
2. Time B sai da quadra
3. Time C entra para jogar contra Time A
4. Time B vai para o final da fila

Resultado:
Quadra: [Time A] vs [Time C]  
Fila:   Time D → Time E → Time B
```

**Regras de Rotação:**
- ✅ Fila automática baseada em `queuePosition`
- ✅ Time vencedor permanece na quadra
- ✅ Time perdedor vai para final da fila
- ✅ Próximo time da fila entra
- ✅ Empates resolvidos por `drawRule`

### **⚖️ 4. Regras de Empate (3+ Times)**

#### **DrawRule: HOME_STAYS**
```
Time Casa (A) [2] x [2] Time Visitante (B)
→ Time A permanece, Time B sai
→ Próximo: Time A vs Time C
```

#### **DrawRule: CHALLENGER_STAYS**
```
Time Casa (A) [2] x [2] Time Visitante (B)  
→ Time B permanece, Time A sai
→ Próximo: Time B vs Time C
```

#### **DrawRule: MANUAL_SELECTION**
```
Time Casa (A) [2] x [2] Time Visitante (B)
→ Interface pergunta: "Quem permanece?"
→ Usuário escolhe A ou B
```

#### **DrawRule: COIN_TOSS**
```
Time Casa (A) [2] x [2] Time Visitante (B)
→ Sistema sorteia automaticamente
→ Resultado salvo como drawResult
```

### **🏆 5. Regra de Vitórias Consecutivas**

#### **Cenário: 3 Times**
```
Inicial:
Quadra: [Time A] vs [Time B]
Fila:   Time C

Time A atinge maxConsecutiveWins:
→ Time A sai (forçado)
→ Time B também sai  
→ Próxima: Time C vs Time ? (próximo da fila)
```

#### **Cenário: 4+ Times**
```
Inicial:
Quadra: [Time A] vs [Time B]
Fila:   Time C → Time D

Time A atinge maxConsecutiveWins:
→ Ambos times saem da quadra
→ Próxima: Time C vs Time D
→ Fila fica: Time A → Time B (ambos no final)
```

### **📝 6. Eventos e Validações**

#### **Eventos de Gol**
```typescript
// ✅ Gol válido
const golEvent = {
  eventType: 'goal',
  sessionPlayerId: 'player-123',    // Time A
  assistPlayerId: 'player-456'      // Time A (mesmo time)
};

// ❌ Validações que falham
const golInvalido = {
  sessionPlayerId: 'player-123',    // Time A  
  assistPlayerId: 'player-789'      // Time B (time diferente)
};
```

**Regras de Validação:**
- ✅ Assistência deve ser do mesmo time do gol
- ❌ Assistência não pode ser do próprio jogador
- ✅ Jogador deve estar em um dos times da partida
- ❌ Jogadores expulsos não podem registrar eventos

#### **Sistema de Cartões**
```typescript
// Timeline automática de cartões
[
  { eventType: 'yellow_card', playerId: 'player-123', timestamp: '10:00' },
  { eventType: 'yellow_card', playerId: 'player-123', timestamp: '15:00' },
  { eventType: 'red_card', playerId: 'player-123', timestamp: '15:01' }  // AUTO
]
```

**Regras:**
- ✅ Dois amarelos = vermelho automático
- ✅ Jogador expulso fica inelegível para novos eventos
- ✅ Interface deve esconder jogadores expulsos
- ❌ Validação é apenas na UI, não no domínio

### **🛠️ 7. Timeline e Edição Histórica**

#### **Operações Permitidas**
```typescript
// ✅ Inserir partida no meio da timeline
matches.insertAt(position: 2, newMatch);

// ✅ Deletar partida histórica  
matches.deleteAt(position: 3);

// ✅ Mover partida
matches.move(from: 5, to: 2);

// ✅ Apenas sequenceNumber é recalculado
updateSequenceNumbers(); // 1, 2, 3, 4, 5...
```

**Princípio Fundamental:**
- ✅ **Apenas** `sequenceNumber` é recalculado
- ❌ **Nenhuma** lógica de rotação é recalculada
- ✅ Usuário tem **controle manual total**
- ❌ Sistema **não** recomputa histórico automaticamente

### **📊 8. Cálculo de Scores**

#### **Derivação Automática**
```typescript
// Match NÃO armazena scores diretamente
class Match {
  // ❌ homeScore: number  // Não existe como campo
  
  // ✅ Score calculado via eventos
  get homeScore(): number {
    return this.events
      .filter(e => e.eventType === 'goal')
      .filter(e => e.sessionPlayer.sessionTeam === this.homeTeam)
      .length;
  }
}
```

**Regras Fundamentais:**
- ✅ Scores **sempre** derivados de eventos de gol
- ❌ Scores **nunca** editados manualmente
- ✅ Consistência garantida automaticamente
- ✅ Auditoria completa via events

## 📊 Estatísticas e Exportação Avançada

### **Inclusão/Exclusão de Dados**

#### **✅ Incluídos nas Estatísticas**
```typescript
const validPlayers = sessionPlayers.filter(
  player => player.playerType === PlayerType.SESSION_PLAYER
);

// Métricas calculadas para session_players:
interface PlayerStats {
  goals: number;           // Gols marcados
  assists: number;         // Assistências dadas  
  yellowCards: number;     // Cartões amarelos
  redCards: number;        // Cartões vermelhos
  matchesPlayed: number;   // Partidas disputadas
  wins: number;            // Vitórias
  draws: number;           // Empates  
  losses: number;          // Derrotas
  winRate: number;         // Taxa de vitórias
}
```

#### **❌ Excluídos das Estatísticas**
- **Fill players** - Jogadores temporários
- Eventos de fill players (ainda existem para lógica de jogo)
- Dados de jogadores que saíram do grupo

### **Export para Excel (XLS)**

#### **Estrutura do Relatório**
```typescript
interface ExcelReport {
  groupInfo: {
    name: string;
    totalSessions: number;
    totalMatches: number;
    period: { start: Date; end: Date; };
  };
  
  playerStats: PlayerStats[];  // Apenas session_players
  
  sessionSummaries: {
    sessionId: string;
    date: Date;
    totalMatches: number;
    teams: string[];
    topScorer: string;
  }[];
  
  matchDetails: {
    sequence: number;
    homeTeam: string;
    challengerTeam: string;
    score: string;
    events: MatchEventSummary[];
  }[];
}
```

#### **Regras de Exportação**
- ✅ **Apenas** dados de `session_player`
- ❌ **Fill players completamente omitidos**
- ✅ Eventos de fill players **removidos** do histórico exportado
- ✅ Scores **recalculados** sem eventos de fill players
- ✅ Estatísticas **limpas** e **precisas**

### **Casos de Uso de Estatísticas**

#### **Ranking Individual**
```typescript
const ranking = players
  .sort((a, b) => {
    // 1º critério: goals per match
    const goalsA = a.goals / a.matchesPlayed;
    const goalsB = b.goals / b.matchesPlayed;
    if (goalsA !== goalsB) return goalsB - goalsA;
    
    // 2º critério: win rate
    if (a.winRate !== b.winRate) return b.winRate - a.winRate;
    
    // 3º critério: total matches (experiência)
    return b.matchesPlayed - a.matchesPlayed;
  });
```

#### **Análise de Performance por Sessão**
```typescript
interface SessionAnalysis {
  bestPerformer: string;     // Melhor jogador da sessão
  fairPlay: string;          // Menos cartões
  topScorer: string;         // Artilheiro da sessão
  mostAssists: string;       // Maior assistente
  longestWinStreak: {        // Maior sequência de vitórias
    team: string;
    matches: number;
  };
}
```

## 🚀 Casos de Uso Principais

### **👥 Gestão de Grupos**
- `CreateGroup` - Criar novo grupo de futebol
- `UpdateGroupSettings` - Configurar regras globais
- `AddPlayerToGroup` - Adicionar jogador permanente
- `RemovePlayerFromGroup` - Remover jogador (validar histórico)
- `GetGroupStats` - Estatísticas gerais do grupo

### **⚽ Gestão de Sessões**
- `CreateSession` - Criar nova sessão com snapshot de regras
- `ConfigureSessionTeams` - Definir times da sessão
- `AddPlayerToSession` - Adicionar jogador oficial a sessão
- `CreateFillPlayer` - Criar jogador temporário para completar time
- `AssignPlayerToTeam` - Atribuir jogador a time específico
- `StartSession` - Iniciar sessão (validar teams completos)
- `EndSession` - Finalizar sessão e calcular estatísticas
- `GetSessionSummary` - Resumo completo da sessão

### **🎮 Gestão de Partidas**

#### **Fluxo Automático**
- `StartNextMatch` - Iniciar próxima partida (rotação automática)
- `EndCurrentMatch` - Finalizar partida atual
- `ApplyDrawRule` - Resolver empate conforme configuração
- `CheckConsecutiveWins` - Verificar limite de vitórias seguidas
- `RotateQueue` - Executar rotação de times (3+ teams)

#### **Gestão Manual**
- `CreateManualMatch` - Inserir partida em posição específica
- `DeleteMatch` - Remover partida do histórico
- `MoveMatch` - Reposicionar partida na timeline
- `ReorderMatches` - Recalcular sequenceNumbers
- `UpdateMatchTeams` - Alterar times de partida específica

### **📝 Gestão de Eventos**

#### **Eventos de Jogo**
- `RecordGoal` - Registrar gol com assistência opcional
- `RecordYellowCard` - Registrar cartão amarelo
- `RecordRedCard` - Registrar cartão vermelho
- `EditMatchEvent` - Modificar evento existente
- `DeleteMatchEvent` - Remover evento (recalcula score)

#### **Validações**
- `ValidatePlayerEligibility` - Verificar se pode registrar evento
- `ValidateAssist` - Validar assistência (mesmo time, jogador diferente)
- `CheckPlayerExpulsion` - Verificar se jogador está expulso
- `AutoGenerateRedCard` - Gerar vermelho após 2 amarelos

### **📊 Estatísticas e Relatórios**

#### **Estatísticas Individuais**
- `GeneratePlayerStats` - Estatísticas completas de jogador
- `GetPlayerMatchHistory` - Histórico de partidas
- `CalculatePlayerRanking` - Ranking por critérios
- `GetPlayerPerformanceBySession` - Performance por sessão

#### **Estatísticas de Grupo**
- `GenerateGroupStats` - Estatísticas gerais do grupo
- `GetMostActivePlayer` - Jogador mais ativo
- `GetTopScorer` - Artilheiro geral
- `GetFairPlayRanking` - Ranking de fair play

#### **Exportação**
- `ExportToXLS` - Exportar relatório Excel (sem fill players)
- `ExportSessionSummary` - Resumo de sessão específica
- `ExportPlayerReport` - Relatório individual de jogador
- `ExportTeamComparison` - Comparação entre times/períodos

### **🔧 Casos de Uso Técnicos**

#### **Integridade de Dados**
- `RecalculateMatchScores` - Recalcular scores via eventos
- `ValidateSessionIntegrity` - Verificar consistência dos dados
- `FixSequenceNumbers` - Corrigir numeração de partidas
- `AuditMatchEvents` - Auditoria de eventos suspeitos

#### **Performance**
- `CachePlayerStats` - Cache de estatísticas frequentes
- `OptimizeEventQueries` - Otimizar consultas de eventos
- `ArchiveOldSessions` - Arquivar sessões antigas
- `CleanupFillPlayers` - Limpeza de fill players órfãos

### **🎯 Fluxos Completos de Uso**

#### **Fluxo: Criar Nova Sessão**
```typescript
// 1. Criar sessão
const session = await CreateSession({
  groupId: 'group-123',
  teamNames: ['Time A', 'Time B', 'Time C']
});

// 2. Configurar times
await ConfigureSessionTeams(sessionId, {
  'Time A': ['player1', 'player2', 'player3'],
  'Time B': ['player4', 'player5'], // Incompleto
  'Time C': ['player6', 'player7', 'player8']
});

// 3. Completar times com fill players  
await CreateFillPlayer(sessionId, 'Time B', 'completa 1');

// 4. Validar e iniciar
await StartSession(sessionId);
```

#### **Fluxo: Registrar Partida Completa**
```typescript
// 1. Iniciar partida
const match = await StartNextMatch(sessionId);

// 2. Registrar eventos
await RecordGoal(matchId, 'player1', 'player2'); // Gol + assist
await RecordYellowCard(matchId, 'player4');
await RecordGoal(matchId, 'player3');

// 3. Finalizar partida
await EndCurrentMatch(matchId);

// 4. Sistema aplica rotação automaticamente
// Time vencedor fica, perdedor sai, próximo entra
```

#### **Fluxo: Exportar Relatório**
```typescript
// 1. Gerar estatísticas limpas (sem fill players)
const stats = await GeneratePlayerStats(groupId, {
  excludeFillPlayers: true,
  dateRange: { start: '2024-01-01', end: '2024-12-31' }
});

// 2. Exportar para Excel
const excelFile = await ExportToXLS(groupId, {
  includeMatchDetails: true,
  includeEventTimeline: true,
  format: 'detailed'
});
```

## 🧪 Estratégia de Testes

### **Unit Tests - Domínio**

#### **Entities & Business Rules**
```typescript
// Group.test.ts
describe('Group Entity', () => {
  test('should create group with default settings');
  test('should prevent duplicate player names');
  test('should maintain player creation order');
});

// Session.test.ts  
describe('Session Entity', () => {
  test('should snapshot group settings correctly');
  test('should prevent team modifications after start');
  test('should calculate active players correctly');
});

// Match.test.ts
describe('Match Entity', () => {
  test('should calculate scores from goal events only');
  test('should handle draw results correctly');
  test('should maintain event chronological order');
});
```

#### **Business Rules Validation**
```typescript
// FillPlayerRules.test.ts
describe('Fill Player Rules', () => {
  test('fill player should not appear in statistics');
  test('fill player goals should count for match score');
  test('fill player should be excluded from exports');
});

// ConsecutiveWinsRules.test.ts
describe('Consecutive Wins Rule', () => {
  test('both teams leave when limit reached');
  test('rule applies only to 3+ team sessions');
  test('win counter resets after team leaves');
});

// RotationRules.test.ts
describe('Queue Rotation Rules', () => {
  test('winner stays, loser goes to queue end');
  test('draw resolution follows configured rule');
  test('queue position updates correctly');
});
```

### **Integration Tests - Application Layer**

#### **Use Cases**
```typescript
// CreateSession.test.ts
describe('Create Session Use Case', () => {
  test('should create session with team snapshots');
  test('should initialize queue positions for 3+ teams');
  test('should validate team size constraints');
});

// RecordGoal.test.ts
describe('Record Goal Use Case', () => {
  test('should validate player eligibility');
  test('should validate assist rules');
  test('should update match score automatically');
  test('should prevent events from expelled players');
});

// TimelineEditing.test.ts
describe('Timeline Editing', () => {
  test('should recalculate sequence numbers only');
  test('should preserve historical event data');
  test('should maintain referential integrity');
});
```

### **Repository Tests - Infraestrutura**

#### **Data Persistence**
```typescript
// SessionRepository.test.ts
describe('Session Repository', () => {
  test('should persist session with all relationships');
  test('should load session with lazy-loaded entities');
  test('should handle concurrent session updates');
});

// MatchEventRepository.test.ts
describe('Match Event Repository', () => {
  test('should maintain event chronological order');
  test('should support efficient score calculations');
  test('should handle bulk event operations');
});
```

### **End-to-End Tests - Scenarios**

#### **Complete Session Flows**
```typescript
// CompleteSessionFlow.test.ts
describe('Complete Session Flow', () => {
  test('should handle 2-team session without rotation', async () => {
    // 1. Create group with 2 teams
    // 2. Create session  
    // 3. Play multiple matches
    // 4. Verify no queue rotation
    // 5. Export statistics
  });

  test('should handle 4-team rotation with consecutive wins', async () => {
    // 1. Create group with 4 teams
    // 2. Configure maxConsecutiveWins = 2
    // 3. Team A wins 2 times
    // 4. Verify both teams leave court
    // 5. Verify queue rotation continues
  });

  test('should handle fill players correctly', async () => {
    // 1. Create session with incomplete team
    // 2. Add fill players
    // 3. Play matches with fill players scoring
    // 4. Export statistics (verify exclusion)
    // 5. Verify match scores include fill player goals
  });
});

// TimelineManipulation.test.ts
describe('Timeline Manipulation', () => {
  test('should insert/delete/move matches correctly', async () => {
    // 1. Play 5 matches
    // 2. Insert match at position 3
    // 3. Delete match at position 2
    // 4. Move match from 4 to 1
    // 5. Verify only sequenceNumbers changed
  });
});
```

### **Performance Tests**

#### **Scalability**
```typescript
// PerformanceTests.test.ts
describe('Performance Tests', () => {
  test('should handle 1000+ matches efficiently');
  test('should calculate statistics for 100+ players quickly');
  test('should export large datasets without memory issues');
});
```

### **Property-Based Tests**

#### **Invariant Testing**
```typescript
// InvariantTests.test.ts
describe('Domain Invariants', () => {
  test('match scores always equal goal event count', () => {
    // Property: For any match, homeScore + challengerScore === goals.length
  });

  test('queue positions remain valid after rotation', () => {
    // Property: After any rotation, queuePosition values are sequential
  });

  test('fill players never appear in statistical queries', () => {
    // Property: Any statistics query result contains only session_players
  });
});
```

### **Test Data Factories**

```typescript
// TestFactories.ts
export class TestFactories {
  static createGroup(overrides?: Partial<GroupData>) {
    return {
      name: 'Test Group',
      settings: {
        teamSize: 5,
        maxGoals: 3,
        maxConsecutiveWins: 2,
        drawRule: DrawRule.HOME_STAYS
      },
      ...overrides
    };
  }

  static createSessionWithTeams(teamCount: number, playersPerTeam: number) {
    // Creates realistic test data for various scenarios
  }

  static createMatchWithEvents(eventCount: number) {
    // Creates matches with realistic event distributions
  }
}

## 📈 Roadmap e Expansões Futuras

### **🚀 Fase 1: MVP Core (Q1 2026)**
- ✅ **Domain Layer Completo** - Todas entidades e regras
- ✅ **CLI Interface** - Interface de linha de comando funcional
- ✅ **SQLite Database** - Persistência local
- ✅ **Core Use Cases** - Gestão básica de sessões
- ✅ **Fill Players System** - Sistema completo de jogadores temporários
- ✅ **Basic Statistics** - Estatísticas fundamentais
- ✅ **XLS Export** - Exportação básica para Excel

### **🔄 Fase 2: Advanced Features (Q2 2026)**
- 🔄 **Timeline Editing** - Sistema completo de edição histórica
- 🔄 **Advanced Rotation** - Rotação inteligente com múltiplas estratégias
- 🔄 **Real-time Validation** - Validações em tempo real
- 🔄 **Performance Optimization** - Cache e otimizações
- 🔄 **Advanced Statistics** - Métricas avançadas e rankings
- 🔄 **Data Import/Export** - Backup e sincronização

### **🌐 Fase 3: Web Platform (Q3 2026)**
- 📱 **React Web Interface** - Interface web moderna
- 🔐 **Authentication System** - Sistema de usuários
- ☁️ **Cloud Database** - Migração PostgreSQL
- 🔄 **Real-time Updates** - WebSocket para updates live
- 📊 **Interactive Dashboards** - Dashboards avançados
- 🎮 **Match Live Tracking** - Acompanhamento em tempo real

### **📱 Fase 4: Mobile Experience (Q4 2026)**
- 📱 **React Native App** - Aplicativo mobile nativo
- 📍 **Geolocation** - Localização de quadras
- 🔔 **Push Notifications** - Notificações de jogos
- 📷 **Photo Integration** - Fotos de jogos e times
- 💬 **In-app Chat** - Chat integrado para grupos
- 📅 **Calendar Integration** - Calendário de sessões

### **🏆 Fase 5: Advanced Features (2027)**

#### **Sistema de Competições**
- 🏆 **Tournament Mode** - Sistema de torneios
- 🏅 **Championship System** - Campeonatos entre grupos
- 🎖️ **Achievement System** - Sistema de conquistas
- 📊 **Advanced Analytics** - Analytics avançados com IA
- 🎯 **Performance Prediction** - Predição de performance

#### **Recursos Sociais**
- 👥 **Social Features** - Perfis sociais e conexões
- 📹 **Video Highlights** - Highlights automáticos
- 📱 **Live Streaming** - Transmissão ao vivo
- 🎮 **Gamification** - Elementos de gamificação
- 🏆 **Global Rankings** - Rankings globais

#### **Integrações Avançadas**
- 💰 **Payment Integration** - Sistema de rachinha
- 🏟️ **Venue Management** - Gestão de quadras
- 📦 **Equipment Tracking** - Controle de equipamentos
- 🩺 **Health Monitoring** - Monitoramento de saúde
- 🤖 **AI Coach** - Treinador virtual com IA

### **🔧 Melhorias Técnicas Contínuas**

#### **Performance & Scalability**
```typescript
// Otimizações planejadas
interface PerformanceGoals {
  databaseQueries: 'Sub-100ms para 95% das consultas';
  userInterface: 'Loading < 2s em conexões 3G';
  realTimeUpdates: 'Latência < 500ms para updates';
  dataExport: 'XLS com 10k+ registros em < 30s';
}
```

#### **Security & Privacy**
- 🔒 **Data Encryption** - Criptografia end-to-end
- 🛡️ **Privacy Controls** - Controles de privacidade
- 🔐 **GDPR Compliance** - Conformidade LGPD/GDPR
- 🚨 **Audit Logging** - Logs de auditoria completos
- 🔑 **Multi-factor Auth** - Autenticação multi-fator

#### **Developer Experience**
- 🧪 **Test Coverage 95%+** - Cobertura de testes alta
- 📚 **API Documentation** - Documentação completa
- 🔧 **Developer Tools** - Ferramentas de desenvolvimento
- 🚀 **CI/CD Pipeline** - Pipeline de deploy automático
- 📊 **Monitoring & Alerts** - Monitoramento em produção

### **💡 Ideias Inovadoras**

#### **AI & Machine Learning**
- 🤖 **Smart Team Balancing** - Balanceamento automático de times com IA
- 📈 **Performance Analytics** - Análise de performance com ML
- 🎯 **Match Prediction** - Predição de resultados
- 🏃‍♂️ **Player Development** - Sugestões de melhoria
- 📊 **Tactical Analysis** - Análise tática automática

#### **IoT Integration**
- ⌚ **Wearable Integration** - Integração com smartwatches
- 🥅 **Smart Goals** - Traves inteligentes para detecção automática
- 📡 **GPS Tracking** - Rastreamento GPS de jogadores
- 📊 **Automatic Statistics** - Estatísticas automáticas via IoT
- 🎥 **Automated Recording** - Gravação automática de partidas

#### **Extended Reality (AR/VR)**
- 👓 **AR Match Overlay** - Sobreposição AR com estatísticas
- 🥽 **VR Training** - Treinamento em realidade virtual
- 📱 **AR Player Cards** - Cartas de jogadores em AR
- 🎮 **Virtual Matches** - Partidas virtuais para treinamento
- 📊 **3D Analytics** - Visualização 3D de dados

### **🌍 Expansão Global**

#### **Localização**
- 🌐 **Multi-language** - Suporte a múltiplas línguas
- 🏛️ **Cultural Adaptations** - Adaptações culturais
- ⚽ **Sport Variations** - Suporte a variações do futebol
- 📏 **Metric Systems** - Sistemas de medidas regionais
- 💰 **Multi-currency** - Suporte a múltiplas moedas

#### **Partnerships**
- ⚽ **Football Federations** - Parcerias com federações
- 🏟️ **Venue Networks** - Redes de quadras parceiras
- 🎓 **Educational Institutions** - Parceria com escolas
- 💼 **Corporate Programs** - Programas corporativos
- 🏆 **Professional Clubs** - Parcerias com clubes

---

**Visão de Longo Prazo:** Tornar-se a **plataforma global definitiva** para gestão de futebol amador, conectando milhões de jogadores ao redor do mundo e democratizando o acesso a ferramentas profissionais de gestão esportiva.

**Missão:** Organizar e potencializar a paixão pelo futebol através de tecnologia inovadora, dados precisos e experiências memoráveis. ⚽🚀

## 🏃‍♂️ Como Executar

```bash
# Instalar dependências
npm install

# Executar migrações
npm run migration:run

# Executar testes
npm test

# Iniciar aplicação
npm start

# Modo desenvolvimento
npm run dev
```

## 📝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Soccer Session Manager** - Organizando peladas com tecnologia! ⚽