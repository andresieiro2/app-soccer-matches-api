# Soccer Session Manager — Business Rules

This document describes the domain rules and behavior of the Soccer Session Manager application.
The system is designed to manage informal soccer matches, allowing flexible match creation, player tracking, event logging, and statistics generation.

The design prioritizes simplicity, flexibility, and historical accuracy, while avoiding complex recomputation of past matches.

## Table of Contents

1. Domain Overview
2. Core Entities
3. Group Configuration
4. Session Configuration Snapshots
5. Teams
6. Players
7. Session Initialization
8. Match Flow
9. Draw Rules
10. Match Structure
11. Match Timeline Management
12. Match Events
13. Event Validation Rules
14. Cards and Expulsions
15. Match Completion Rules
16. Consecutive Wins Rule
17. Retroactive Editing Rules
18. Statistics and Export Rules

## 1. Domain Overview

The application manages informal soccer match sessions.

Each session consists of:

- teams
- players
- matches
- match events

The system supports:

- automatic match rotation
- manual match creation
- flexible event editing
- statistical tracking
- exportable results

The system intentionally does not recompute historical match sequences automatically, allowing users full manual control.

## 2. Core Entities

The system contains the following domain entities:

- Group
- GroupPlayer
- GroupSettings
- Session
- SessionTeam
- SessionPlayer
- Match
- MatchEvent

Important constraints:

- There is no global Player entity.
- `GroupPlayer` exists only within a `Group`.
- `Session` represents a specific match day.
- `Match` belongs to a `Session`.
- `MatchEvent` belongs to a `Match`.

## 3. Group Configuration

Each group defines global rules through `GroupSettings`.

Fields:

```text
teamSize
maxMatchDurationMinutes
maxGoals
maxConsecutiveWins
drawRule
```

These rules act as defaults for new sessions.

## 4. Session Configuration Snapshots

When a session is created, configuration values are copied into the session.

Fields stored in `Session`:

```text
teamSizeSnapshot
maxMatchDurationMinutesSnapshot
maxGoalsSnapshot
maxConsecutiveWinsSnapshot
drawRuleSnapshot
```

Rule:

Sessions always operate using their snapshot values, ensuring that later configuration changes do not affect ongoing or historical sessions.

## 5. Teams

`SessionTeam` represents a team participating in a session.

Fields:

```text
sessionId
teamName
queuePosition
createdAt
```

Rules:

- `queuePosition` is only relevant when there are 3 or more teams.
- Teams cannot be created or removed during a session.

## 6. Players

Players participating in a session are represented by `SessionPlayer`.

Fields:

```text
sessionId
sessionTeamId
groupPlayerId (nullable)
playerType
```

`playerType` values:

```text
session_player
fill_player
```

### session_player

Represents an official player belonging to the group.

Rules:

- Must reference a `GroupPlayer`
- Included in statistics
- Included in exports

### fill_player

Represents a temporary player used to complete a team.

Rules:

- Does not require a `GroupPlayer`
- Can participate normally in matches
- Can score goals
- Can assist
- Can receive cards
- Excluded from statistics
- Excluded from exports
- Does not become a `GroupPlayer`

Fill players are displayed in the interface as:

```text
completa 1
completa 2
completa 3
```

## 7. Session Initialization

Sessions may begin with incomplete teams.

Before the first match begins:

Teams must be filled until reaching `teamSizeSnapshot`.

Teams can be completed by:

- assigning an existing session player
- creating `fill_player` entries

Before starting the session:

The user must confirm team compositions.

Version 1 restrictions:

- Players cannot switch teams
- Players cannot be removed from teams

## 8. Match Flow

Two match flows exist depending on the number of teams.

### 2-Team Sessions

If a session has exactly two teams:

- no queue exists
- no rotation occurs
- no special draw handling

After a match finishes:

The next match starts with the same teams.

### 3+ Team Sessions

If a session has three or more teams:

- a queue exists
- teams rotate after each match

Default rotation flow:

1. One team remains
2. One team leaves the field
3. The first team in the queue enters
4. The leaving team goes to the end of the queue

The initial queue order follows team creation order.

## 9. Draw Rules

Draw behavior is configured through `drawRule`.

Possible values:

```text
home_stays
challenger_stays
manual_selection
coin_toss
```

Matches store only the result:

```text
drawResult
```

Values:

```text
home_stays
challenger_stays
```

Rules:

- `drawResult` only exists if a draw occurs
- `manual_selection` and `coin_toss` always resolve into one of these two values

## 10. Match Structure

`Match` fields:

```text
sessionId
sequenceNumber
homeTeamId
challengerTeamId
drawResult
startedAt
endedAt
```

Rules:

- Match does not store score
- Score is derived from `goal` events
- `sequenceNumber` represents the match position in the session timeline

## 11. Match Timeline Management

Matches exist within an ordered timeline.

Users can:

- insert matches
- delete matches
- move matches

When this happens:

The system recalculates `sequenceNumber`.

Example:

Before:

```text
1 Match A vs B
2 Match A vs C
3 Match D vs B
```

Insert new match at position 2:

```text
1 Match A vs B
2 New Match
3 Match A vs C
4 Match D vs B
```

This is the only retroactive automatic recalculation allowed.

The system does not recompute historical rotation logic.

## 12. Match Events

`MatchEvent` types:

```text
goal
yellow_card
red_card
```

Fields:

```text
matchId
sessionPlayerId
eventType
assistPlayerId (optional)
createdAt
```

Events are ordered chronologically using `createdAt`.

## 13. Event Validation Rules

Goal events may contain an assist.

Rules:

- Assist player cannot be the goal scorer
- Assist must belong to the same team as the scorer
- Events may only reference players from the two teams playing the match

## 14. Cards and Expulsions

Two yellow cards automatically generate a red card.

Example timeline:

```text
yellow_card
yellow_card
red_card (automatic)
```

After a red card:

- The interface should stop offering the player for new events.

This restriction is enforced at the UI level, not at the domain level.

## 15. Match Completion Rules

Matches may end due to:

- manual completion
- maximum duration
- maximum goals reached
- consecutive win rule

## 16. Consecutive Wins Rule

If a team reaches `maxConsecutiveWins` in sessions with 3+ teams:

The team must leave the field.

### Scenario with 3 teams

Example:

```text
Field: A vs B
Queue: C
```

If A reaches the limit:

Next match:

```text
B vs C
```

### Scenario with 4+ teams

Example:

```text
Field: A vs B
Queue: C, D
```

If A reaches the limit:

Next match:

```text
C vs D
```

Both teams on the field leave.

## 17. Retroactive Editing Rules

Events can be:

- edited
- deleted

Matches can also be edited after completion.

Editing a past match:

- updates that match's result
- does not recompute later matches

Users must manually adjust later matches if necessary.

## 18. Statistics and Export Rules

Statistics only include:

```text
session_player
```

Excluded from statistics:

```text
fill_player
```

Exports (XLS) also ignore fill players.

Events involving fill players still exist for match logic.

## Conclusion

This domain model prioritizes:

- simplicity
- flexibility
- user control
- historical integrity

The system avoids complex recalculations while allowing manual correction of historical matches.
