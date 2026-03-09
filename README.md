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
│   ├── entities/           # Domain entities
│   │   ├── Group.ts
│   │   ├── GroupPlayer.ts
│   │   ├── GroupSettings.ts
│   │   ├── Session.ts
│   │   ├── SessionTeam.ts
│   │   ├── SessionPlayer.ts
│   │   ├── Match.ts
│   │   └── MatchEvent.ts
│   ├── enums/              # Enumerations
│   │   ├── PlayerType.ts
│   │   ├── MatchEventType.ts
│   │   └── DrawResult.ts
│   ├── interfaces/         # Repository contracts
│   └── services/           # Domain services
├── application/
│   ├── use-cases/          # Use cases
│   │   ├── session/
│   │   ├── match/
│   │   └── statistics/
│   └── services/           # Application services
├── infrastructure/
│   ├── repositories/       # Concrete implementations
│   │   ├── typeorm/
│   │   └── in-memory/      # For testing
│   ├── persistence/        # Database configuration
│   └── external/           # External services
├── presentation/
│   ├── cli/                # Command line interface
│   ├── web/                # Web interface (future)
│   └── api/                # REST API (future)
└── config/                 # Configurations
```

## 🏪 Domain & Entities

### **Core Entities**

#### **Group** (Aggregate Root)
```typescript
class Group {
  id: string
  name: string
  players: GroupPlayer[]        // Permanent players
  settings: GroupSettings       // Group configuration
  sessions: Session[]           // Session history
  createdAt: Date
}
```

#### **GroupSettings** (Global Configuration)
```typescript
class GroupSettings {
  id: string
  groupId: string
  teamSize: number                    // Ex: 5 (futsal), 11 (field)
  maxMatchDurationMinutes: number     // Ex: 15, 20, 30 min
  maxGoals: number                    // Ex: 3, 5 goals
  maxConsecutiveWins: number          // Ex: 2, 3 consecutive wins
  drawRule: DrawRule                  // How to resolve draws
}
```

#### **Session** (Aggregate Root - Game Session)
```typescript
class Session {
  id: string
  groupId: string
  teams: SessionTeam[]
  players: SessionPlayer[]
  matches: Match[]
  
  // 📸 RULE SNAPSHOT (Immutable during session)
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

#### **SessionTeam** (Session Team)
```typescript
class SessionTeam {
  id: string
  sessionId: string
  teamName: string
  queuePosition: number     // Used only for 3+ teams
  createdAt: Date
}
```

#### **SessionPlayer** (Session Player)
```typescript
class SessionPlayer {
  id: string
  sessionId: string
  sessionTeamId: string
  groupPlayerId?: string    // NULL for fill players
  playerType: PlayerType    // 'session_player' | 'fill_player'
  checkInAt: Date
  checkOutAt?: Date
}
```

#### **Match** (Aggregate Root - Match)
```typescript
class Match {
  id: string
  sessionId: string
  sequenceNumber: number    // Position in timeline
  homeTeamId: string
  challengerTeamId: string
  
  // 📊 AUTOMATICALLY CALCULATED SCORES
  homeScore: number         // Derived from 'goal' events
  challengerScore: number   // Derived from 'goal' events
  drawResult?: DrawResult   // 'home_stays' | 'challenger_stays'
  
  events: MatchEvent[]
  startedAt: Date
  endedAt?: Date
}
```

#### **MatchEvent** (Match Event)
```typescript
class MatchEvent {
  id: string
  matchId: string
  sessionPlayerId: string   // Who performed the action
  assistPlayerId?: string   // Who gave the assist (goals only)
  eventType: MatchEventType // 'goal' | 'yellow_card' | 'red_card'
  createdAt: Date          // Chronological order of events
}
```

### **Important Enumerations**

```typescript
enum PlayerType {
  SESSION_PLAYER = 'session_player',    // Official group player
  FILL_PLAYER = 'fill_player'           // Temporary player
}

enum MatchEventType {
  GOAL = 'goal',
  YELLOW_CARD = 'yellow_card',
  RED_CARD = 'red_card'
}

enum DrawRule {
  HOME_STAYS = 'home_stays',            // Home team stays
  CHALLENGER_STAYS = 'challenger_stays', // Visiting team stays
  MANUAL_SELECTION = 'manual_selection', // User chooses
  COIN_TOSS = 'coin_toss'               // Automatic draw
}
```

## ⚙️ Detailed Business Rules

### **📋 1. Configuration and Snapshots**

#### **Global Configuration Rules (GroupSettings)**
- `teamSize`: Fixed team size (ex: 5 for futsal, 11 for field)
- `maxMatchDurationMinutes`: Maximum match duration
- `maxGoals`: Number of goals to end match
- `maxConsecutiveWins`: Consecutive wins limit
- `drawRule`: How to resolve draws in rotation systems

#### **Immutable Snapshot System**
```typescript
// ✅ When creating session: rules are copied and "frozen"
const session = new Session({
  teamSizeSnapshot: group.settings.teamSize,
  maxGoalsSnapshot: group.settings.maxGoals,
  // ... other snapshots
});

// ❌ Future group changes DO NOT affect existing sessions
group.settings.maxGoals = 10;  // Does not affect existing sessions
```

### **👥 2. Dual Player System**

#### **Session Players (Official Players)**
- ✅ Reference to existing `GroupPlayer`
- ✅ Included in permanent statistics
- ✅ Included in XLS exports
- ✅ Can switch teams in future sessions
- ✅ Permanent history in group

#### **Fill Players (Temporary Players)**
```typescript
// Example of fill players in interface
interface TeamDisplay {
  players: [
    "John Silva",      // session_player
    "Maria Santos",    // session_player
    "fill 1",          // fill_player
    "fill 2"           // fill_player
  ]
}
```

**Fill Player Characteristics:**
- ❌ **DO NOT** reference `GroupPlayer`
- ✅ Can score goals and give assists
- ✅ Can receive cards
- ❌ **DO NOT** appear in permanent statistics
- ❌ **NOT** exported to XLS
- ❌ **DO NOT** become permanent players
- 🔒 Fixed to the team where they were created

### **🔄 3. Match Flows**

#### **Scenario: 2 Teams**
```
Team A ⚽ Team B
      ↓ (Match ends)
Team A ⚽ Team B  (Same teams, no rotation)
```

**Rules:**
- ❌ No queue system
- ❌ No rotation rules  
- ❌ Draw rules do not apply
- ✅ Match ends and restarts with same teams

#### **Scenario: 3+ Teams (Rotation System)**
```
Court: [Team A] vs [Team B]
Queue:  Team C → Team D → Team E

1. Team A beats Team B
2. Team B leaves the court
3. Team C enters to play against Team A
4. Team B goes to end of queue

Result:
Court: [Team A] vs [Team C]  
Queue:  Team D → Team E → Team B
```

**Rotation Rules:**
- ✅ Automatic queue based on `queuePosition`
- ✅ Winning team stays on court
- ✅ Losing team goes to end of queue
- ✅ Next team in queue enters
- ✅ Draws resolved by `drawRule`

### **⚖️ 4. Draw Rules (3+ Teams)**

#### **DrawRule: HOME_STAYS**
```
Home Team (A) [2] x [2] Visiting Team (B)
→ Team A stays, Team B leaves
→ Next: Team A vs Team C
```

#### **DrawRule: CHALLENGER_STAYS**
```
Home Team (A) [2] x [2] Visiting Team (B)  
→ Team B stays, Team A leaves
→ Next: Team B vs Team C
```

#### **DrawRule: MANUAL_SELECTION**
```
Home Team (A) [2] x [2] Visiting Team (B)
→ Interface asks: "Who stays?"
→ User chooses A or B
```

#### **DrawRule: COIN_TOSS**
```
Home Team (A) [2] x [2] Visiting Team (B)
→ System automatically draws
→ Result saved as drawResult
```

### **🏆 5. Consecutive Wins Rule**

#### **Scenario: 3 Teams**
```
Initial:
Court: [Team A] vs [Team B]
Queue:  Team C

Team A reaches maxConsecutiveWins:
→ Team A leaves (forced)
→ Team B also leaves  
→ Next: Team C vs Team ? (next in queue)
```

#### **Scenario: 4+ Teams**
```
Initial:
Court: [Team A] vs [Team B]
Queue:  Team C → Team D

Team A reaches maxConsecutiveWins:
→ Both teams leave the court
→ Next: Team C vs Team D
→ Queue becomes: Team A → Team B (both at end)
```

### **📝 6. Events and Validations**

#### **Goal Events**
```typescript
// ✅ Valid goal
const goalEvent = {
  eventType: 'goal',
  sessionPlayerId: 'player-123',    // Team A
  assistPlayerId: 'player-456'      // Team A (same team)
};

// ❌ Invalid validations
const invalidGoal = {
  sessionPlayerId: 'player-123',    // Team A  
  assistPlayerId: 'player-789'      // Team B (different team)
};
```

**Validation Rules:**
- ✅ Assist must be from same team as goal
- ❌ Assist cannot be from goal scorer
- ✅ Player must be on one of the teams playing
- ❌ Ejected players cannot register events

#### **Card System**
```typescript
// Automatic card timeline
[
  { eventType: 'yellow_card', playerId: 'player-123', timestamp: '10:00' },
  { eventType: 'yellow_card', playerId: 'player-123', timestamp: '15:00' },
  { eventType: 'red_card', playerId: 'player-123', timestamp: '15:01' }  // AUTO
]
```

**Rules:**
- ✅ Two yellows = automatic red
- ✅ Ejected player becomes ineligible for new events
- ✅ Interface should hide ejected players
- ❌ Validation is UI-only, not in domain

### **🛠️ 7. Timeline and Historical Editing**

#### **Allowed Operations**
```typescript
// ✅ Insert match in middle of timeline
matches.insertAt(position: 2, newMatch);

// ✅ Delete historical match  
matches.deleteAt(position: 3);

// ✅ Move match
matches.move(from: 5, to: 2);

// ✅ Only sequenceNumber is recalculated
updateSequenceNumbers(); // 1, 2, 3, 4, 5...
```

**Fundamental Principle:**
- ✅ **Only** `sequenceNumber` is recalculated
- ❌ **No** rotation logic is recalculated
- ✅ User has **full manual control**
- ❌ System **does not** recompute history automatically

### **📊 8. Score Calculation**

#### **Automatic Derivation**
```typescript
// Match does NOT store scores directly
class Match {
  // ❌ homeScore: number  // Does not exist as field
  
  // ✅ Score calculated via events
  get homeScore(): number {
    return this.events
      .filter(e => e.eventType === 'goal')
      .filter(e => e.sessionPlayer.sessionTeam === this.homeTeam)
      .length;
  }
}
```

**Fundamental Rules:**
- ✅ Scores **always** derived from goal events
- ❌ Scores **never** manually edited
- ✅ Consistency automatically guaranteed
- ✅ Complete audit via events

## 📊 Advanced Statistics and Export

### **Data Inclusion/Exclusion**

#### **✅ Included in Statistics**
```typescript
const validPlayers = sessionPlayers.filter(
  player => player.playerType === PlayerType.SESSION_PLAYER
);

// Metrics calculated for session_players:
interface PlayerStats {
  goals: number;           // Goals scored
  assists: number;         // Assists given  
  yellowCards: number;     // Yellow cards
  redCards: number;        // Red cards
  matchesPlayed: number;   // Matches played
  wins: number;            // Wins
  draws: number;           // Draws  
  losses: number;          // Losses
  winRate: number;         // Win rate
}
```

#### **❌ Excluded from Statistics**
- **Fill players** - Temporary players
- Fill player events (still exist for game logic)
- Data from players who left the group

### **Excel Export (XLS)**

#### **Report Structure**
```typescript
interface ExcelReport {
  groupInfo: {
    name: string;
    totalSessions: number;
    totalMatches: number;
    period: { start: Date; end: Date; };
  };
  
  playerStats: PlayerStats[];  // Only session_players
  
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

#### **Export Rules**
- ✅ **Only** `session_player` data
- ❌ **Fill players completely omitted**
- ✅ Fill player events **removed** from exported history
- ✅ Scores **recalculated** without fill player events
- ✅ **Clean** and **accurate** statistics

### **Statistics Use Cases**

#### **Individual Ranking**
```typescript
const ranking = players
  .sort((a, b) => {
    // 1st criterion: goals per match
    const goalsA = a.goals / a.matchesPlayed;
    const goalsB = b.goals / b.matchesPlayed;
    if (goalsA !== goalsB) return goalsB - goalsA;
    
    // 2nd criterion: win rate
    if (a.winRate !== b.winRate) return b.winRate - a.winRate;
    
    // 3rd criterion: total matches (experience)
    return b.matchesPlayed - a.matchesPlayed;
  });
```

#### **Session Performance Analysis**
```typescript
interface SessionAnalysis {
  bestPerformer: string;     // Best session player
  fairPlay: string;          // Fewest cards
  topScorer: string;         // Session top scorer
  mostAssists: string;       // Most assists
  longestWinStreak: {        // Longest win streak
    team: string;
    matches: number;
  };
}
```

## 🚀 Main Use Cases

### **👥 Group Management**
- `CreateGroup` - Create new soccer group
- `UpdateGroupSettings` - Configure global rules
- `AddPlayerToGroup` - Add permanent player
- `RemovePlayerFromGroup` - Remove player (validate history)
- `GetGroupStats` - General group statistics

### **⚽ Session Management**
- `CreateSession` - Create new session with rule snapshot
- `ConfigureSessionTeams` - Define session teams
- `AddPlayerToSession` - Add official player to session
- `CreateFillPlayer` - Create temporary player to complete team
- `AssignPlayerToTeam` - Assign player to specific team
- `StartSession` - Start session (validate complete teams)
- `EndSession` - End session and calculate statistics
- `GetSessionSummary` - Complete session summary

### **🎮 Match Management**

#### **Automatic Flow**
- `StartNextMatch` - Start next match (automatic rotation)
- `EndCurrentMatch` - End current match
- `ApplyDrawRule` - Resolve draw according to configuration
- `CheckConsecutiveWins` - Check consecutive wins limit
- `RotateQueue` - Execute team rotation (3+ teams)

#### **Manual Management**
- `CreateManualMatch` - Insert match at specific position
- `DeleteMatch` - Remove match from history
- `MoveMatch` - Reposition match in timeline
- `ReorderMatches` - Recalculate sequenceNumbers
- `UpdateMatchTeams` - Change teams for specific match

### **📝 Event Management**

#### **Game Events**
- `RecordGoal` - Record goal with optional assist
- `RecordYellowCard` - Record yellow card
- `RecordRedCard` - Record red card
- `EditMatchEvent` - Modify existing event
- `DeleteMatchEvent` - Remove event (recalculates score)

#### **Validations**
- `ValidatePlayerEligibility` - Check if can register event
- `ValidateAssist` - Validate assist (same team, different player)
- `CheckPlayerExpulsion` - Check if player is ejected
- `AutoGenerateRedCard` - Generate red after 2 yellows

### **📊 Statistics and Reports**

#### **Individual Statistics**
- `GeneratePlayerStats` - Complete player statistics
- `GetPlayerMatchHistory` - Player match history
- `CalculatePlayerRanking` - Ranking by criteria
- `GetPlayerPerformanceBySession` - Performance per session

#### **Group Statistics**
- `GenerateGroupStats` - General group statistics
- `GetMostActivePlayer` - Most active player
- `GetTopScorer` - Overall top scorer
- `GetFairPlayRanking` - Fair play ranking

#### **Export**
- `ExportToXLS` - Export Excel report (no fill players)
- `ExportSessionSummary` - Specific session summary
- `ExportPlayerReport` - Individual player report
- `ExportTeamComparison` - Team/period comparison

### **🔧 Technical Use Cases**

#### **Data Integrity**
- `RecalculateMatchScores` - Recalculate scores via events
- `ValidateSessionIntegrity` - Check data consistency
- `FixSequenceNumbers` - Fix match numbering
- `AuditMatchEvents` - Audit suspicious events

#### **Performance**
- `CachePlayerStats` - Cache frequent statistics
- `OptimizeEventQueries` - Optimize event queries
- `ArchiveOldSessions` - Archive old sessions
- `CleanupFillPlayers` - Cleanup orphaned fill players

### **🎯 Complete Usage Flows**

#### **Flow: Create New Session**
```typescript
// 1. Create session
const session = await CreateSession({
  groupId: 'group-123',
  teamNames: ['Team A', 'Team B', 'Team C']
});

// 2. Configure teams
await ConfigureSessionTeams(sessionId, {
  'Team A': ['player1', 'player2', 'player3'],
  'Team B': ['player4', 'player5'], // Incomplete
  'Team C': ['player6', 'player7', 'player8']
});

// 3. Complete teams with fill players  
await CreateFillPlayer(sessionId, 'Team B', 'fill 1');

// 4. Validate and start
await StartSession(sessionId);
```

#### **Flow: Record Complete Match**
```typescript
// 1. Start match
const match = await StartNextMatch(sessionId);

// 2. Record events
await RecordGoal(matchId, 'player1', 'player2'); // Goal + assist
await RecordYellowCard(matchId, 'player4');
await RecordGoal(matchId, 'player3');

// 3. End match
await EndCurrentMatch(matchId);

// 4. System applies rotation automatically
// Winner stays, loser leaves, next enters
```

#### **Flow: Export Report**
```typescript
// 1. Generate clean statistics (no fill players)
const stats = await GeneratePlayerStats(groupId, {
  excludeFillPlayers: true,
  dateRange: { start: '2024-01-01', end: '2024-12-31' }
});

// 2. Export to Excel
const excelFile = await ExportToXLS(groupId, {
  includeMatchDetails: true,
  includeEventTimeline: true,
  format: 'detailed'
});
```

## 🧪 Testing Strategy

### **Unit Tests - Domain**

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

### **Repository Tests - Infrastructure**

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
```

## 📈 Roadmap and Future Expansion

### **🚀 Phase 1: MVP Core (Q1 2026)**
- ✅ **Complete Domain Layer** - All entities and rules
- ✅ **CLI Interface** - Functional command line interface
- ✅ **SQLite Database** - Local persistence
- ✅ **Core Use Cases** - Basic session management
- ✅ **Fill Players System** - Complete temporary player system
- ✅ **Basic Statistics** - Fundamental statistics
- ✅ **XLS Export** - Basic Excel export

### **🔄 Phase 2: Advanced Features (Q2 2026)**
- 🔄 **Timeline Editing** - Complete historical editing system
- 🔄 **Advanced Rotation** - Smart rotation with multiple strategies
- 🔄 **Real-time Validation** - Real-time validations
- 🔄 **Performance Optimization** - Caching and optimizations
- 🔄 **Advanced Statistics** - Advanced metrics and rankings
- 🔄 **Data Import/Export** - Backup and synchronization

### **🌐 Phase 3: Web Platform (Q3 2026)**
- 📱 **React Web Interface** - Modern web interface
- 🔐 **Authentication System** - User system
- ☁️ **Cloud Database** - PostgreSQL migration
- 🔄 **Real-time Updates** - WebSocket for live updates
- 📊 **Interactive Dashboards** - Advanced dashboards
- 🎮 **Match Live Tracking** - Real-time match tracking

### **📱 Phase 4: Mobile Experience (Q4 2026)**
- 📱 **React Native App** - Native mobile app
- 📍 **Geolocation** - Court location features
- 🔔 **Push Notifications** - Game notifications
- 📷 **Photo Integration** - Game and team photos
- 💬 **In-app Chat** - Integrated group chat
- 📅 **Calendar Integration** - Session calendar

### **🏆 Phase 5: Advanced Features (2027)**

#### **Competition System**
- 🏆 **Tournament Mode** - Tournament system
- 🏅 **Championship System** - Inter-group championships
- 🎖️ **Achievement System** - Achievement system
- 📊 **Advanced Analytics** - AI-powered advanced analytics
- 🎯 **Performance Prediction** - Performance prediction

#### **Social Features**
- 👥 **Social Features** - Social profiles and connections
- 📹 **Video Highlights** - Automatic highlights
- 📱 **Live Streaming** - Live streaming
- 🎮 **Gamification** - Gamification elements
- 🏆 **Global Rankings** - Global rankings

#### **Advanced Integrations**
- 💰 **Payment Integration** - Cost splitting system
- 🏟️ **Venue Management** - Court management
- 📦 **Equipment Tracking** - Equipment tracking
- 🩺 **Health Monitoring** - Health monitoring
- 🤖 **AI Coach** - AI virtual coach

### **🔧 Continuous Technical Improvements**

#### **Performance & Scalability**
```typescript
// Planned optimizations
interface PerformanceGoals {
  databaseQueries: 'Sub-100ms for 95% of queries';
  userInterface: 'Loading < 2s on 3G connections';
  realTimeUpdates: 'Latency < 500ms for updates';
  dataExport: 'XLS with 10k+ records in < 30s';
}
```

#### **Security & Privacy**
- 🔒 **Data Encryption** - End-to-end encryption
- 🛡️ **Privacy Controls** - Privacy controls
- 🔐 **GDPR Compliance** - GDPR/LGPD compliance
- 🚨 **Audit Logging** - Complete audit logs
- 🔑 **Multi-factor Auth** - Multi-factor authentication

#### **Developer Experience**
- 🧪 **Test Coverage 95%+** - High test coverage
- 📚 **API Documentation** - Complete documentation
- 🔧 **Developer Tools** - Development tools
- 🚀 **CI/CD Pipeline** - Automated deploy pipeline
- 📊 **Monitoring & Alerts** - Production monitoring

### **💡 Innovative Ideas**

#### **AI & Machine Learning**
- 🤖 **Smart Team Balancing** - AI-powered automatic team balancing
- 📈 **Performance Analytics** - ML performance analysis
- 🎯 **Match Prediction** - Result prediction
- 🏃‍♂️ **Player Development** - Improvement suggestions
- 📊 **Tactical Analysis** - Automatic tactical analysis

#### **IoT Integration**
- ⌚ **Wearable Integration** - Smartwatch integration
- 🥅 **Smart Goals** - Smart goalposts for automatic detection
- 📡 **GPS Tracking** - GPS player tracking
- 📊 **Automatic Statistics** - IoT-based automatic statistics
- 🎥 **Automated Recording** - Automatic match recording

#### **Extended Reality (AR/VR)**
- 👓 **AR Match Overlay** - AR overlay with statistics
- 🥽 **VR Training** - Virtual reality training
- 📱 **AR Player Cards** - AR player cards
- 🎮 **Virtual Matches** - Virtual matches for training
- 📊 **3D Analytics** - 3D data visualization

### **🌍 Global Expansion**

#### **Localization**
- 🌐 **Multi-language** - Multiple language support
- 🏛️ **Cultural Adaptations** - Cultural adaptations
- ⚽ **Sport Variations** - Soccer variation support
- 📏 **Metric Systems** - Regional measurement systems
- 💰 **Multi-currency** - Multiple currency support

#### **Partnerships**
- ⚽ **Football Federations** - Federation partnerships
- 🏟️ **Venue Networks** - Partner court networks
- 🎓 **Educational Institutions** - School partnerships
- 💼 **Corporate Programs** - Corporate programs
- 🏆 **Professional Clubs** - Club partnerships

---

**Long-term Vision:** Become the **definitive global platform** for amateur soccer management, connecting millions of players worldwide and democratizing access to professional sports management tools.

**Mission:** Organize and enhance passion for soccer through innovative technology, accurate data, and memorable experiences. ⚽🚀

## 🏃‍♂️ How to Run

```bash
# Install dependencies
npm install

# Run migrations
npm run migration:run

# Run tests
npm test

# Start application
npm start

# Development mode
npm run dev
```

## 📝 Contributing

1. Fork the project
2. Create your branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

**Soccer Session Manager** - Organizing pickup games with technology! ⚽