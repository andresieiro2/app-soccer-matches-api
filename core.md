# Soccer Session Manager

## Overview

Soccer Session Manager is an application designed to manage informal
soccer matches ("peladas"). The system allows groups to organize
sessions, manage teams and players, track match events, apply
configurable rules, and export statistics.

The project is designed with scalability and maintainability in mind,
using a clean architecture approach and TypeScript with TypeORM for
persistence.

The initial database can be SQLite, but the architecture must support
future migration to other databases.

------------------------------------------------------------------------

# Table of Contents

1.  Project Goals
2.  Technical Stack
3.  Architecture Principles
4.  Core Domain Concepts
5.  Entities
6.  Business Rules
7.  Match Flow Logic
8.  Match Events
9.  Statistics and Export
10. Editing and Timeline Rules
11. Project Architecture Suggestion
12. Future Expansion

------------------------------------------------------------------------

# 1. Project Goals

The application allows users to:

-   Manage soccer groups
-   Organize sessions of matches
-   Manage teams inside a session
-   Track players and temporary fill players
-   Record match events such as goals and cards
-   Apply configurable match rules
-   Maintain queue rotation between teams
-   Generate player statistics
-   Export statistics to XLS

------------------------------------------------------------------------

# 2. Technical Stack

Core technologies:

-   TypeScript
-   Node.js
-   TypeORM
-   SQLite (initially)
-   Database abstraction to allow future migration

Recommended development environment:

-   Visual Studio Code

------------------------------------------------------------------------

# 3. Architecture Principles

The project should follow clean architecture principles:

-   Separation of concerns
-   Domain-driven modeling
-   Clear separation between domain, application and infrastructure
-   Persistence isolated behind repositories
-   Entities independent from database implementation

Architecture layers:

Domain\
Application\
Infrastructure\
Persistence

------------------------------------------------------------------------

# 4. Core Domain Concepts

The system revolves around the concept of organizing soccer sessions
with teams, matches, and events.

Main domain aggregates:

Group\
Session\
Match

A group contains players and configuration rules.

A session represents a set of matches played with a fixed set of teams.

Matches occur between teams and contain events such as goals or cards.

------------------------------------------------------------------------

# 5. Entities

### Group

Represents a soccer group.

### GroupPlayer

Represents a player belonging to a group.

There is no global player outside a group.

### GroupSettings

Stores configuration rules for the group:

-   maxMatchDurationMinutes
-   maxGoals
-   maxConsecutiveWins
-   drawRule
-   teamSize

These values are copied into session snapshots when a session is
created.

------------------------------------------------------------------------

### Session

Represents a soccer play session.

Session stores snapshots of group rules:

-   maxMatchDurationMinutesSnapshot
-   maxGoalsSnapshot
-   maxConsecutiveWinsSnapshot
-   drawRuleSnapshot
-   teamSizeSnapshot

A session can be manually ended.

Sessions maintain the same match flow they started with:

-   2 teams mode
-   3+ teams rotation mode

------------------------------------------------------------------------

### SessionTeam

Represents a team inside a session.

Fields:

-   sessionId
-   teamName
-   queuePosition
-   createdAt

queuePosition is only used when there are 3 or more teams.

------------------------------------------------------------------------

### SessionPlayer

Represents a player participating in a session.

Fields:

-   sessionId
-   groupPlayerId
-   sessionTeamId
-   checkInAt
-   checkOutAt
-   playerType

playerType values:

-   session_player
-   fill_player

------------------------------------------------------------------------

### Fill Players

Fill players are temporary players used to complete teams.

Characteristics:

-   Modeled as SessionPlayer
-   Limited only by teamSize
-   Can score goals and assists
-   Do not appear in permanent statistics
-   Do not appear in XLS export
-   Do not become GroupPlayers
-   Locked to the team where created

UI differentiation example:

completa 1\
completa 2

------------------------------------------------------------------------

### Match

Represents a match played during a session.

Fields:

-   sessionId
-   sequenceNumber
-   homeTeamId
-   challengerTeamId
-   homeScore
-   challengerScore
-   drawResult
-   startedAt
-   endedAt

Match result is derived from scores.

Scores are derived from goal events.

drawResult values:

-   home_stays
-   challenger_stays

------------------------------------------------------------------------

### MatchEvent

Represents events that occur during a match.

Types:

-   goal
-   yellow_card
-   red_card

Fields include:

-   matchId
-   sessionPlayerId
-   assistPlayerId (optional)
-   createdAt

------------------------------------------------------------------------

# 6. Business Rules

### Team composition

Sessions may start with incomplete teams.

Before the first match starts:

Teams must be completed up to teamSize.

Users can:

-   Assign existing players
-   Create fill players

Players cannot switch teams.

Teams cannot be modified once the session begins.

------------------------------------------------------------------------

### Team restrictions

During a session:

Teams cannot be created. Teams cannot be removed.

The session always keeps the same set of teams.

------------------------------------------------------------------------

# 7. Match Flow Logic

### Two Team Scenario

If only two teams exist:

-   No queue system
-   No rotation rules
-   Match ends and immediately restarts with same teams

Tie handling does not apply.

------------------------------------------------------------------------

### Three or More Teams

Queue rotation must be applied.

Matches follow configured draw rules.

------------------------------------------------------------------------

# 8. Consecutive Wins Rule

maxConsecutiveWins is optional.

When configured and reached:

Both teams currently playing leave the court.

Example:

A beats B\
A reaches win limit

Both A and B leave.

Next match:

C vs D

------------------------------------------------------------------------

# 9. Match Events Rules

Validation rules:

-   Assist cannot be the same player who scored
-   Assist must belong to the same team
-   Event player must belong to one of the teams playing the match
-   Red card only creates an event
-   Expelled players cannot register new events in the same match
-   Two yellow cards automatically generate a red card

------------------------------------------------------------------------

# 10. Score Calculation

Match scores are derived exclusively from goal events.

Scores should never be manually edited.

------------------------------------------------------------------------

# 11. Statistics and Export

The system must support statistics generation.

Fill players:

-   excluded from permanent statistics
-   excluded from XLS exports

------------------------------------------------------------------------

# 12. Editing and Timeline Rules

Matches can be:

-   created automatically
-   created manually

Manual matches may be inserted anywhere in the timeline.

Allowed operations:

-   insert match
-   delete match
-   move match

When these occur:

Only sequenceNumber is recalculated.

No other historical data must be recalculated.

------------------------------------------------------------------------

# 13. Project Architecture Suggestion

Recommended structure:

src/

domain/ entities/ enums/

application/ use-cases/ services/

infrastructure/ repositories/

persistence/ typeorm/

config/

------------------------------------------------------------------------

# 14. Future Expansion

Possible future improvements:

-   API layer (REST / GraphQL)
-   React Native mobile application
-   Real-time match updates
-   Advanced statistics dashboards
-   Cloud database migration
-   Authentication and user accounts

------------------------------------------------------------------------

This project is designed to evolve incrementally while preserving clear
domain modeling and scalable architecture.
