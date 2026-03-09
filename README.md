# Soccer Session Manager API

Modern REST API for managing informal soccer sessions with teams, players and match events.

## 🚀 Technologies

- **Node.js 25.6** - JavaScript runtime with latest features
- **TypeScript** - Type safety with strict configuration
- **Express.js** - Web framework (planned)
- **TypeORM** - Object-relational mapping with decorators
- **SQLite** - Development database
- **PostgreSQL** - Production database
- **Yarn** - Package manager
- **ESLint** - Code linting with flat config
- **Prettier** - Code formatting

## 🏗 Project Structure

```
src/
├── domain/
│   ├── entities/        # Business entities with TypeORM decorators
│   │   ├── Group.ts     # Soccer groups management
│   │   ├── GroupPlayer.ts  # Player-Group relationships
│   │   ├── GroupSettings.ts # Group configuration
│   │   ├── Session.ts   # Match sessions
│   │   ├── SessionTeam.ts # Team formations
│   │   ├── SessionPlayer.ts # Player-Session relationships
│   │   ├── Match.ts     # Individual matches
│   │   └── MatchEvent.ts # Match events (goals, cards, etc.)
│   └── enums/          # Type-safe enumerations
│       ├── PlayerType.ts    # Goalkeeper, Field player
│       ├── MatchEventType.ts # Goal, Yellow card, etc.
│       └── DrawResult.ts    # Win, Loss, Draw
└── infrastructure/
    └── database/       # Database configuration
        ├── config/
        │   ├── development.ts  # SQLite for dev
        │   └── production.ts   # PostgreSQL for prod
        └── DataSource.ts      # TypeORM connection
```

## 🎯 Domain Model

### Core Entities

#### Group
- **Purpose**: Manages soccer groups and their settings
- **Key Fields**: name, description, isActive, createdAt
- **Relations**: One-to-Many with GroupPlayer, GroupSettings, Session

#### GroupPlayer
- **Purpose**: Player-Group membership with join dates
- **Key Fields**: playerId, playerName, joinedAt
- **Relations**: Many-to-One with Group

#### GroupSettings
- **Purpose**: Configurable rules per group
- **Key Fields**: maxPlayersPerTeam, sessionDuration, allowDraws
- **Relations**: Many-to-One with Group

#### Session
- **Purpose**: Individual soccer sessions/events
- **Key Fields**: date, location, duration, status
- **Relations**: Many-to-One with Group, One-to-Many with SessionTeam, Match

#### SessionTeam
- **Purpose**: Team formations for each session
- **Key Fields**: teamName, teamColor (hex validation)
- **Relations**: Many-to-One with Session, One-to-Many with SessionPlayer

#### SessionPlayer
- **Purpose**: Player assignments to teams
- **Key Fields**: playerType (goalkeeper/field), isActive
- **Relations**: Many-to-One with SessionTeam

#### Match
- **Purpose**: Individual matches between teams
- **Key Fields**: startTime, endTime, team1Score, team2Score
- **Relations**: Many-to-One with Session, One-to-Many with MatchEvent

#### MatchEvent
- **Purpose**: Events during matches (goals, cards, etc.)
- **Key Fields**: eventType, minute, playerId, description
- **Relations**: Many-to-One with Match

### Business Rules

- **Character Limits**: All text fields limited to 25 characters for mobile optimization
- **Color Validation**: Team colors must be valid hex codes (#RRGGBB format)
- **Cross-Database Compatibility**: Uses `datetime` and `varchar` for SQLite/PostgreSQL compatibility
- **Factory Methods**: Entities include static creation methods with validation
- **Nullable Relations**: Proper handling of optional relationships

## 🗄 Database Configuration

### Environment-Based Setup
- **Development**: SQLite database (`database.sqlite`)
- **Production**: PostgreSQL with environment variables
- **Auto-switching**: Based on `NODE_ENV` variable

### Environment Variables (Production)
```env
DB_HOST=your-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=soccer_sessions
```

### TypeORM Features
- Entity auto-discovery from `src/domain/entities`
- Synchronization enabled in development
- Logging enabled in development
- Decorator-based entities with relationships

## 📦 Quick Start

```bash
# Install dependencies
yarn install

# Start development server (planned)
yarn dev

# Build for production
yarn build

# Start production server (planned)
yarn start

# Format code
yarn format

# Lint code
yarn lint

# Test database connection
yarn test:db
```

## 🛠 Available Scripts

- `yarn dev` - Development with hot reload (planned)
- `yarn build` - TypeScript compilation
- `yarn start` - Production server (planned)
- `yarn lint` - ESLint check with flat config
- `yarn lint:fix` - ESLint auto-fix
- `yarn format` - Prettier formatting
- `yarn test:db` - Test database connection

## ⚙️ Configuration

### TypeScript
- **Target**: ES2022 with CommonJS modules
- **Strict Mode**: Enabled for type safety
- **Decorators**: Experimental support for TypeORM
- **Source Maps**: Enabled for debugging

### ESLint (Flat Config)
- **Parser**: @typescript-eslint/parser
- **Rules**: Recommended TypeScript and Node.js rules
- **Globals**: Node.js environment

### Prettier
- **Semi**: false (no semicolons)
- **Single Quotes**: true
- **Tab Width**: 2 spaces

## 🚦 Project Status

### ✅ Completed Phases

#### Phase A: Project Foundation
- ✅ Node.js 25.6 setup with Yarn
- ✅ TypeScript configuration with strict mode
- ✅ ESLint flat config (v10 compatible)
- ✅ Prettier integration
- ✅ VS Code settings optimization

#### Phase B: Domain Core
- ✅ 8 complete entities with TypeORM decorators
- ✅ Full relationship mapping (One-to-Many, Many-to-One)
- ✅ 3 enums with proper exports
- ✅ Business validation and factory methods
- ✅ Character limits and hex color validation

#### Phase C: Database Infrastructure
- ✅ Dual database support (SQLite/PostgreSQL)
- ✅ Environment-based configuration
- ✅ TypeORM DataSource setup
- ✅ Entity auto-discovery
- ✅ Database connection testing

### 🔄 Next Phases (Planned)

#### Phase D: Repository Pattern
- Repository interfaces and implementations
- Data access layer abstraction
- CRUD operations for all entities

#### Phase E: Service Layer
- Business logic implementation
- Domain services and use cases
- Validation and error handling

#### Phase F: API Layer
- Express.js REST endpoints
- Request/response DTOs
- Authentication and authorization

## 🎯 Features

This system manages:
- ⚽ **Soccer Sessions**: Complete session lifecycle
- 👥 **Dynamic Teams**: Flexible team formation
- 👤 **Player Management**: Roles and participation tracking
- 📊 **Match Events**: Real-time event recording
- ⚙️ **Configurable Rules**: Per-group customization
- 🏆 **Statistics**: Comprehensive match analytics

## 🗺 Entity Relationships

```
Group (1) ←→ (M) GroupPlayer
Group (1) ←→ (M) GroupSettings  
Group (1) ←→ (M) Session
Session (1) ←→ (M) SessionTeam
Session (1) ←→ (M) Match
SessionTeam (1) ←→ (M) SessionPlayer
Match (1) ←→ (M) MatchEvent
```

---

*Database successfully configured and tested. Ready for Phase D: Repository implementation.*