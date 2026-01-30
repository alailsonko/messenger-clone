# Foreign Keys & Relations in Distributed Databases

> **Understanding how to handle relationships when your data is split across multiple databases**

## 📚 Table of Contents

1. [The Fundamentals](#1-the-fundamentals)
2. [Foreign Keys in PostgreSQL](#2-foreign-keys-in-postgresql)
3. [The Sharding Challenge](#3-the-sharding-challenge)
4. [Solution Strategies](#4-solution-strategies)
5. [GORM Relationship Patterns](#5-gorm-relationship-patterns)
6. [Real-World Examples](#6-real-world-examples)
7. [Best Practices](#7-best-practices)

---

## 1. The Fundamentals

### What is a Foreign Key?

A **foreign key (FK)** is a database constraint that ensures **referential integrity** - meaning a reference to another table's row must actually exist.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FOREIGN KEY BASICS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   users table                        messages table                         │
│   ┌─────────┬──────────┐            ┌─────────┬───────────┬──────────┐     │
│   │ id (PK) │ name     │            │ id (PK) │ user_id   │ content  │     │
│   ├─────────┼──────────┤            │         │ (FK)      │          │     │
│   │ 1       │ Alice    │◄───────────│ 101     │ 1         │ Hello!   │     │
│   │ 2       │ Bob      │◄───────────│ 102     │ 2         │ Hi!      │     │
│   │ 3       │ Carol    │            │ 103     │ 1         │ Bye!     │     │
│   └─────────┴──────────┘            └─────────┴───────────┴──────────┘     │
│                                                                             │
│   The FK constraint guarantees:                                             │
│   ✅ messages.user_id MUST exist in users.id                                │
│   ✅ Can't delete user if they have messages (unless CASCADE)               │
│   ✅ Database enforces this, not application code                           │
│                                                                             │
│   Example constraint violations:                                            │
│   ❌ INSERT INTO messages (user_id, content) VALUES (999, 'test')           │
│      → ERROR: Key (user_id)=(999) is not present in table "users"           │
│                                                                             │
│   ❌ DELETE FROM users WHERE id = 1  (if messages exist)                    │
│      → ERROR: Key (id)=(1) is still referenced from table "messages"        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Foreign Keys Matter

| Benefit | Description |
|---------|-------------|
| **Data Integrity** | Impossible to have orphan records |
| **Automatic Cleanup** | CASCADE deletes related data automatically |
| **Self-Documentation** | Schema shows relationships clearly |
| **Query Optimization** | Database uses FK info for better query plans |
| **Error Prevention** | Catches bugs at database level |

---

## 2. Foreign Keys in PostgreSQL

### Creating Foreign Keys

```sql
-- Method 1: Inline with column definition
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_id UUID NOT NULL REFERENCES users(id),  -- FK to users
    content TEXT NOT NULL
);

-- Method 2: Separate constraint
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    CONSTRAINT fk_messages_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

### Foreign Key Actions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FK ACTIONS (ON DELETE / ON UPDATE)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Action         │ What Happens                                             │
│   ───────────────┼────────────────────────────────────────────────────────  │
│   NO ACTION      │ Raise error if referenced row exists (default)           │
│   RESTRICT       │ Same as NO ACTION but checked immediately                │
│   CASCADE        │ Delete/update related rows automatically                  │
│   SET NULL       │ Set FK column to NULL when parent deleted                │
│   SET DEFAULT    │ Set FK column to its default value                       │
│                                                                             │
│   Example: ON DELETE CASCADE                                                │
│   ┌─────────┐    ┌─────────┐                                               │
│   │ users   │    │ messages│                                               │
│   │ id: 1   │◄───│ user_id │                                               │
│   └─────────┘    └─────────┘                                               │
│       │                │                                                    │
│       │ DELETE user 1  │                                                    │
│       ▼                ▼                                                    │
│   User 1 deleted → All messages with user_id=1 ALSO deleted                 │
│                                                                             │
│   Example: ON DELETE SET NULL                                               │
│       │                │                                                    │
│       │ DELETE user 1  │                                                    │
│       ▼                ▼                                                    │
│   User 1 deleted → messages.user_id set to NULL (orphan message)            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### GORM Foreign Key Syntax

```go
// server/internal/persistence/gorm/models/user_account.go

type UserAccountModel struct {
    common.CommonModel
    
    // Foreign Key to User
    UserID uuid.UUID `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_account"`
    User   UserModel `gorm:"foreignKey:UserID;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
    
    // Foreign Key to Account
    AccountID uuid.UUID    `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_account"`
    Account   AccountModel `gorm:"foreignKey:AccountID;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
```

**Tag breakdown:**

| Tag Part | Meaning |
|----------|---------|
| `foreignKey:UserID` | This field (UserID) is the FK column |
| `references:Id` | It references the `Id` field of the related model |
| `OnUpdate:CASCADE` | If User.Id changes, update UserID |
| `OnDelete:CASCADE` | If User deleted, delete this row |

---

## 3. The Sharding Challenge

### The Problem

**Foreign keys don't work across database servers!**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE CROSS-SHARD FK PROBLEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Shard 0 (Server A)                Shard 1 (Server B)                      │
│   ┌─────────────────────┐          ┌─────────────────────┐                 │
│   │ users               │          │ users               │                 │
│   │ ├── id: user-001    │          │ ├── id: user-002    │                 │
│   │ └── name: Alice     │          │ └── name: Bob       │                 │
│   │                     │          │                     │                 │
│   │ messages            │          │ messages            │                 │
│   │ ├── id: msg-101     │          │ ├── id: msg-201     │                 │
│   │ │   user_id: ???    │          │ │   user_id: ???    │                 │
│   │ │                   │          │ │                   │                 │
│   │ │   Can't reference │          │ │   Can't reference │                 │
│   │ │   user-002!       │──────X───│ │   user-001!       │                 │
│   │ │   (On Shard 1)    │          │ │   (On Shard 0)    │                 │
│   └─────────────────────┘          └─────────────────────┘                 │
│                                                                             │
│   WHY IT FAILS:                                                             │
│   - PostgreSQL FK checks require querying the referenced table              │
│   - Shard 0's PostgreSQL can't query Shard 1's tables                       │
│   - They are separate, isolated databases                                   │
│                                                                             │
│   TECHNICAL LIMITATION:                                                     │
│   - FK is enforced by the database engine                                   │
│   - Database engine only sees its own data                                  │
│   - No built-in cross-database FK in PostgreSQL                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Companies That Faced This

| Company | Scale | Solution |
|---------|-------|----------|
| **Facebook** | 3B users | Co-locate data by user_id |
| **Twitter** | 500M users | Application-level checks |
| **Uber** | 100M users | Eventually consistent |
| **Shopify** | 2M merchants | Tenant-based sharding |

---

## 4. Solution Strategies

### Strategy 1: Co-location (Same Shard Key)

**The best solution when possible.** Put related data on the same shard.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOLUTION: CO-LOCATE BY USER_ID                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   SHARD KEY = user_id for ALL user-related tables                           │
│                                                                             │
│   hash(user-001) → Shard 0          hash(user-002) → Shard 1               │
│                                                                             │
│   Shard 0                            Shard 1                                │
│   ┌────────────────────────────┐    ┌────────────────────────────┐         │
│   │ users                      │    │ users                      │         │
│   │ └── id: user-001 (Alice)   │    │ └── id: user-002 (Bob)     │         │
│   │                            │    │                            │         │
│   │ messages (user-001's)      │    │ messages (user-002's)      │         │
│   │ ├── id: msg-101            │    │ ├── id: msg-201            │         │
│   │ │   user_id: user-001 ──┐  │    │ │   user_id: user-002 ──┐  │         │
│   │ │   (FK WORKS! ✅)    ──┘  │    │ │   (FK WORKS! ✅)    ──┘  │         │
│   │ └── id: msg-102            │    │ └── id: msg-202            │         │
│   │     user_id: user-001      │    │     user_id: user-002      │         │
│   │                            │    │                            │         │
│   │ profiles (user-001's)      │    │ profiles (user-002's)      │         │
│   │ └── user_id: user-001      │    │ └── user_id: user-002      │         │
│   │     (FK WORKS! ✅)         │    │     (FK WORKS! ✅)         │         │
│   └────────────────────────────┘    └────────────────────────────┘         │
│                                                                             │
│   BENEFITS:                                                                 │
│   ✅ FK constraints work (same database)                                    │
│   ✅ JOINs are fast (no cross-shard queries)                                │
│   ✅ Transactions work (ACID within shard)                                  │
│   ✅ All user's data accessed together (locality)                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Implementation:**

```go
// Route ALL user-related tables by user_id
func (r *ShardedRepository) CreateMessage(ctx context.Context, msg *Message) error {
    // Message goes to same shard as its user
    shard := r.shardManager.GetShardForKey(msg.UserID)
    return shard.WriteDB.Create(msg).Error
}

func (r *ShardedRepository) CreateProfile(ctx context.Context, profile *Profile) error {
    // Profile goes to same shard as its user
    shard := r.shardManager.GetShardForKey(profile.UserID)
    return shard.WriteDB.Create(profile).Error
}
```

### Strategy 2: Application-Level Enforcement

When co-location isn't possible, enforce references in application code.

```go
// Example: User A follows User B (they might be on different shards)
func (s *FollowService) Follow(ctx context.Context, followerID, followeeID string) error {
    // 1. Verify follower exists (shard based on followerID)
    followerShard := s.shardManager.GetShardForKey(followerID)
    var followerCount int64
    followerShard.ReadDB.Model(&UserModel{}).Where("id = ?", followerID).Count(&followerCount)
    if followerCount == 0 {
        return errors.New("follower not found")  // Like FK violation
    }
    
    // 2. Verify followee exists (might be different shard!)
    followeeShard := s.shardManager.GetShardForKey(followeeID)
    var followeeCount int64
    followeeShard.ReadDB.Model(&UserModel{}).Where("id = ?", followeeID).Count(&followeeCount)
    if followeeCount == 0 {
        return errors.New("followee not found")  // Like FK violation
    }
    
    // 3. Create follow relationship (store on follower's shard)
    follow := &Follow{
        FollowerID: followerID,
        FolloweeID: followeeID,  // Just an ID, no FK constraint
    }
    return followerShard.WriteDB.Create(follow).Error
}
```

**Trade-offs:**

| Aspect | Database FK | Application FK |
|--------|-------------|----------------|
| Enforcement | Automatic, guaranteed | Must remember to check |
| Performance | Single query | Multiple queries |
| Consistency | Always consistent | Eventually consistent |
| Complexity | Simple schema | Complex code |
| Flexibility | Fixed rules | Custom logic |

### Strategy 3: Denormalization (Embed Data)

Store a copy of referenced data instead of referencing it.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DENORMALIZATION EXAMPLE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   NORMALIZED (with FK):                DENORMALIZED (embedded):             │
│                                                                             │
│   orders                               orders                               │
│   ├── id: order-1                      ├── id: order-1                      │
│   ├── product_id: prod-5 ◄─FK         ├── product_name: "Laptop"  ◄─COPY   │
│   └── quantity: 2                      ├── product_price: 999     ◄─COPY   │
│                                        └── quantity: 2                      │
│   products                                                                  │
│   ├── id: prod-5                       No FK needed!                        │
│   ├── name: "Laptop"                   Order has all the data it needs      │
│   └── price: 999                                                            │
│                                                                             │
│   WHEN TO USE:                                                              │
│   ✅ Data rarely changes (product name at time of order)                    │
│   ✅ Reads greatly outnumber writes                                         │
│   ✅ Cross-shard JOINs would be expensive                                   │
│   ✅ Historical accuracy matters (price at purchase time)                   │
│                                                                             │
│   DRAWBACKS:                                                                │
│   ❌ Data duplication (storage cost)                                        │
│   ❌ Updates require changing multiple places                               │
│   ❌ Potential inconsistency if not careful                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Strategy 4: Event-Driven Consistency

For deletions, use events to clean up references asynchronously.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVENT-DRIVEN CLEANUP                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. User deleted on Shard 0                                                │
│      │                                                                      │
│      ▼                                                                      │
│   2. Publish event: { type: "user.deleted", user_id: "user-001" }           │
│      │                                                                      │
│      ▼                                                                      │
│   3. Event bus (Redis, Kafka, etc.)                                         │
│      │                                                                      │
│      ├──► Consumer on Shard 0: DELETE FROM messages WHERE user_id = ...     │
│      ├──► Consumer on Shard 1: DELETE FROM messages WHERE user_id = ...     │
│      ├──► Consumer on Shard 2: DELETE FROM messages WHERE user_id = ...     │
│      └──► etc.                                                              │
│                                                                             │
│   TRADE-OFF:                                                                │
│   - Not immediately consistent (eventual consistency)                       │
│   - Orphan records may exist briefly                                        │
│   - More complex architecture                                               │
│   + No cross-shard queries during write                                     │
│   + Better availability                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. GORM Relationship Patterns

### One-to-One Relationship

```go
// User has one Profile
type User struct {
    ID      uuid.UUID
    Name    string
    Profile Profile `gorm:"foreignKey:UserID"`  // Has one
}

type Profile struct {
    ID     uuid.UUID
    UserID uuid.UUID `gorm:"uniqueIndex"`  // Unique = one-to-one
    Bio    string
}

// Generated SQL:
// CREATE TABLE profiles (
//     id UUID PRIMARY KEY,
//     user_id UUID UNIQUE NOT NULL REFERENCES users(id),
//     bio TEXT
// );
```

**Query patterns:**

```go
// Eager loading (single query with JOIN)
var user User
db.Preload("Profile").First(&user, "id = ?", userID)

// Lazy loading (separate query)
var user User
db.First(&user, "id = ?", userID)
db.Model(&user).Association("Profile").Find(&user.Profile)
```

### One-to-Many Relationship

```go
// User has many Messages
type User struct {
    ID       uuid.UUID
    Name     string
    Messages []Message `gorm:"foreignKey:UserID"`  // Has many
}

type Message struct {
    ID      uuid.UUID
    UserID  uuid.UUID `gorm:"index"`  // FK to User
    Content string
    User    User `gorm:"foreignKey:UserID"`  // Belongs to
}

// Generated SQL:
// CREATE TABLE messages (
//     id UUID PRIMARY KEY,
//     user_id UUID NOT NULL REFERENCES users(id),
//     content TEXT
// );
// CREATE INDEX idx_messages_user_id ON messages(user_id);
```

**Query patterns:**

```go
// Get user with all their messages
var user User
db.Preload("Messages").First(&user, "id = ?", userID)

// Get messages with their user
var messages []Message
db.Preload("User").Where("user_id = ?", userID).Find(&messages)

// Count messages
var count int64
db.Model(&Message{}).Where("user_id = ?", userID).Count(&count)
```

### Many-to-Many Relationship

```go
// Users have many Accounts (through junction table)
type User struct {
    ID       uuid.UUID
    Name     string
    Accounts []Account `gorm:"many2many:users_accounts;"`
}

type Account struct {
    ID    uuid.UUID
    Email string
    Users []User `gorm:"many2many:users_accounts;"`
}

// GORM auto-creates junction table:
// CREATE TABLE users_accounts (
//     user_id UUID NOT NULL REFERENCES users(id),
//     account_id UUID NOT NULL REFERENCES accounts(id),
//     PRIMARY KEY (user_id, account_id)
// );
```

**Or with explicit junction table (our approach):**

```go
// Explicit junction for more control
type UserAccountModel struct {
    common.CommonModel
    UserID    uuid.UUID    `gorm:"type:uuid;not null;uniqueIndex:idx_user_account"`
    User      UserModel    `gorm:"foreignKey:UserID;references:Id;constraint:OnDelete:CASCADE;"`
    AccountID uuid.UUID    `gorm:"type:uuid;not null;uniqueIndex:idx_user_account"`
    Account   AccountModel `gorm:"foreignKey:AccountID;references:Id;constraint:OnDelete:CASCADE;"`
    // Can add extra fields like: Role, CreatedBy, etc.
}
```

**Query patterns:**

```go
// Get user with all their accounts
var user User
db.Preload("Accounts").First(&user, "id = ?", userID)

// Add account to user
db.Model(&user).Association("Accounts").Append(&account)

// Remove account from user
db.Model(&user).Association("Accounts").Delete(&account)

// Replace all accounts
db.Model(&user).Association("Accounts").Replace(&account1, &account2)
```

### Self-Referential Relationship (Following/Followers)

```go
// User follows other Users
type User struct {
    ID        uuid.UUID
    Name      string
    Following []User `gorm:"many2many:user_follows;joinForeignKey:FollowerID;joinReferences:FolloweeID"`
    Followers []User `gorm:"many2many:user_follows;joinForeignKey:FolloweeID;joinReferences:FollowerID"`
}

// Junction table
// CREATE TABLE user_follows (
//     follower_id UUID NOT NULL REFERENCES users(id),
//     followee_id UUID NOT NULL REFERENCES users(id),
//     PRIMARY KEY (follower_id, followee_id)
// );
```

---

## 6. Real-World Examples

### Example 1: Instagram's Data Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INSTAGRAM'S APPROACH                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Shard Key: user_id                                                        │
│                                                                             │
│   User's Shard contains:                                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ users                         (user's profile)                      │   │
│   │ ├── id: user-123                                                    │   │
│   │ └── username: @alice                                                │   │
│   │                                                                     │   │
│   │ media                         (user's posts)                        │   │
│   │ ├── id: media-456                                                   │   │
│   │ │   user_id: user-123  ──► FK works!                                │   │
│   │ │   type: photo                                                     │   │
│   │                                                                     │   │
│   │ comments                      (comments ON user's posts)            │   │
│   │ ├── id: comment-789                                                 │   │
│   │ │   media_id: media-456  ──► FK works!                              │   │
│   │ │   author_id: user-999  ──► NO FK (different shard)                │   │
│   │ │   author_username: @bob ──► DENORMALIZED for display              │   │
│   │                                                                     │   │
│   │ likes                         (likes ON user's posts)               │   │
│   │ ├── media_id: media-456  ──► FK works!                              │   │
│   │ └── liker_id: user-888   ──► NO FK (might be different shard)       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   NOTES:                                                                    │
│   - User's own data is co-located (profile, posts, comments on posts)       │
│   - Cross-user references (likes, follower) have no FK                      │
│   - Author username is denormalized in comments for display                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example 2: Discord's Message Sharding

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DISCORD'S APPROACH                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Shard Key: channel_id (not user_id!)                                      │
│                                                                             │
│   Why? Messages are accessed by channel, not by user.                       │
│                                                                             │
│   Channel's Shard contains:                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ channels                                                            │   │
│   │ └── id: channel-general                                             │   │
│   │                                                                     │   │
│   │ messages                      (all messages in this channel)        │   │
│   │ ├── id: msg-001                                                     │   │
│   │ │   channel_id: channel-general ──► FK works!                       │   │
│   │ │   author_id: user-123        ──► NO FK (user on different shard)  │   │
│   │ │   author_name: "Alice"       ──► DENORMALIZED                     │   │
│   │ │   author_avatar: "..."       ──► DENORMALIZED                     │   │
│   │ │   content: "Hello!"                                               │   │
│   │ │                                                                   │   │
│   │ ├── id: msg-002                                                     │   │
│   │ │   channel_id: channel-general                                     │   │
│   │ │   author_id: user-456                                             │   │
│   │ │   content: "Hi!"                                                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   TRADE-OFFS:                                                               │
│   + Fast channel message queries (all messages together)                    │
│   + Easy to load channel history                                            │
│   - User's messages spread across many shards                               │
│   - Can't efficiently get "all messages by user X"                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example 3: Our Messenger Clone

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OUR APPROACH                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Shard Key: user.id                                                        │
│                                                                             │
│   Current Schema:                                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ users                         (sharded by user.id)                  │   │
│   │ ├── id: uuid (PK, shard key)                                        │   │
│   │ ├── first_name: varchar                                             │   │
│   │ └── last_name: varchar                                              │   │
│   │                                                                     │   │
│   │ accounts                      (sharded by ??? - currently global)   │   │
│   │ ├── id: uuid (PK)                                                   │   │
│   │ ├── username: varchar (unique)                                      │   │
│   │ ├── email: varchar (unique)                                         │   │
│   │ └── password: text                                                  │   │
│   │                                                                     │   │
│   │ users_accounts                (junction - same shard as user)       │   │
│   │ ├── id: uuid (PK)                                                   │   │
│   │ ├── user_id: uuid ──► FK to users (WORKS, same shard)               │   │
│   │ └── account_id: uuid ──► FK to accounts (WORKS if co-located)       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   DESIGN DECISION:                                                          │
│   - Each user can have multiple accounts (multi-account support)            │
│   - User and their accounts are on same shard (co-located)                  │
│   - FKs work because of co-location                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Best Practices

### ✅ DO: Choose Shard Key Wisely

```
GOOD Shard Keys:
- user_id (for user-centric apps)
- tenant_id (for multi-tenant SaaS)
- channel_id (for chat apps)

BAD Shard Keys:
- timestamp (creates hot spots)
- sequential IDs (uneven distribution)
- frequently changing values (causes resharding)
```

### ✅ DO: Co-locate Related Data

```go
// GOOD: All user's data on same shard
type User struct { ID uuid.UUID }
type Profile struct { UserID uuid.UUID }   // Same shard as user
type Message struct { AuthorID uuid.UUID } // Same shard as author
type Settings struct { UserID uuid.UUID }  // Same shard as user

// All queries can JOIN without cross-shard calls
```

### ✅ DO: Document Cross-Shard References

```go
type Comment struct {
    ID       uuid.UUID
    PostID   uuid.UUID `gorm:"index"` // FK to Post (same shard)
    
    // NOTE: AuthorID may be on different shard
    // No FK constraint - validated in application
    AuthorID       uuid.UUID `gorm:"index"`
    AuthorUsername string    // Denormalized for display
}
```

### ❌ DON'T: Assume FKs Work Across Shards

```go
// BAD: This FK will fail if follower and followee are on different shards
type Follow struct {
    FollowerID uuid.UUID `gorm:"foreignKey"` // ❌ Won't work cross-shard
    FolloweeID uuid.UUID `gorm:"foreignKey"` // ❌ Won't work cross-shard
}

// GOOD: Application-level validation
type Follow struct {
    FollowerID uuid.UUID `gorm:"index"` // Just an index, no FK
    FolloweeID uuid.UUID `gorm:"index"` // Just an index, no FK
}
```

### ❌ DON'T: Over-normalize in Sharded Systems

```go
// BAD: Requires JOIN across tables that might be on different shards
type Order struct {
    ID         uuid.UUID
    ProductID  uuid.UUID  // FK to products (different shard?)
    CustomerID uuid.UUID  // FK to customers (different shard?)
}

// GOOD: Denormalize for query locality
type Order struct {
    ID              uuid.UUID
    ProductID       uuid.UUID
    ProductName     string  // Copied at order time
    ProductPrice    int     // Copied at order time
    CustomerID      uuid.UUID
    CustomerEmail   string  // Copied for notifications
}
```

---

## Summary Table

| Strategy | Use When | FK Enforcement | Consistency | Complexity |
|----------|----------|----------------|-------------|------------|
| **Co-location** | Related data accessed together | Database | Strong | Low |
| **Application-level** | Cross-shard relationships | Code | Eventual | Medium |
| **Denormalization** | Read-heavy, rarely-changed data | None needed | Eventual | Low |
| **Event-driven** | Async cleanup acceptable | None | Eventual | High |

---

## Quick Reference

```go
// GORM FK syntax
`gorm:"foreignKey:ColumnName;references:RefColumn;constraint:OnDelete:CASCADE"`

// Check if FK can be used
func canUseForeignKey(tableA, tableB string) bool {
    shardKeyA := getShardKey(tableA)
    shardKeyB := getShardKey(tableB)
    return shardKeyA == shardKeyB  // Same shard = FK OK
}

// Application-level FK check
func validateReference(ctx context.Context, refID, shardKey string) error {
    shard := shardManager.GetShardForKey(shardKey)
    var count int64
    shard.ReadDB.Table("referenced_table").Where("id = ?", refID).Count(&count)
    if count == 0 {
        return errors.New("referenced record not found")
    }
    return nil
}
```

---

*This documentation is part of the Messenger Clone project - a learning resource for distributed systems.*
