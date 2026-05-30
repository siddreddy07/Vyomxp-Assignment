# Vyom-Exo-Discord

A Discord bot + Express API server for managing users and their services.

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | HTTP server |
| `discord.js` | ^14.26.4 | Discord bot framework |
| `sequelize` | ^6.37.8 | ORM |
| `mysql2` | ^3.22.4 | MySQL driver |
| `jsonwebtoken` | ^9.0.3 | JWT auth |
| `bcrypt` | ^6.0.0 | Password hashing |
| `dotenv` | ^17.4.2 | Env variables |

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your values
3. Run `npm install`
4. Run `npm run register` to register global slash commands
5. Run `npm start`

### Required Environment Variables (`.env`)

```
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vyomxpress
DB_USER=root
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
```

> **Bot Install Type:** Currently using **Guild Install** — commands work in server channels. If you want commands to work in DMs as well, enable **User Install** in the Discord Developer Portal under Installation.
> **Invite the bot:** [Click here to add to your server](https://discord.com/oauth2/authorize?client_id=1509966806146744500&permissions=2147485696&integration_type=0&scope=bot)

## Database Models

**User** — `id`, `username` (unique), `email` (unique), `password`
- Index: `idx_email` on `email` column
**Service** — `id`, `name`, `description`, `service_username` (unique), `userId` (FK → User)

Associations: `User hasMany Service` (declared in `models/index.js`)

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Create a new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/user/me` | JWT | Get authenticated user + their services |

### Auth Flow

1. `POST /api/auth/signup` with `{ username, email, password }` → returns JWT
2. `POST /api/auth/login` with `{ username, password }` → returns JWT
3. Use the JWT as `Authorization: Bearer <token>` for protected routes
4. `GET /api/user/me` → returns user profile with services

## Discord Slash Commands

| Command | Options | Description |
|---------|---------|-------------|
| `/ppcreateuser` | `username`, `email`, `password` | Creates a new user account in the database |
| `/ppcreateservice` | `username`, `service_name`, `service_username?`, `description?` | Creates a service for a user. `service_username` defaults to your Discord tag if not provided |
| `/ppgetuser` | `username` | Shows user profile with all their services in an embed |

## Project Structure

```
src/
├── app.js                          # Entry point (Express + Discord bot)
├── register.js                     # Register slash commands with Discord
├── config/
│   ├── env.js                      # Env loader
│   └── database.js                 # Sequelize config
├── models/
│   ├── index.js                    # Model barrel + associations
│   ├── User.js                     # User model
│   └── Service.js                  # Service model
├── middleware/
│   └── auth.js                     # JWT verification middleware
├── routes/
│   ├── authRoutes.js               # signup / login routes
│   └── userRoutes.js               # /me route (protected)
├── controllers/
│   ├── authController.js           # Auth request handlers
│   └── userController.js           # User request handlers
├── services/
│   ├── authService.js              # Signup/login business logic
│   └── userService.js              # User+services lookup
├── handlers/
│   └── commandHandler.js           # Discord interaction handler
└── commands/utility/
    ├── ppcreateuser.js             # /ppcreateuser
    ├── ppcreateservice.js          # /ppcreateservice
    └── ppgetuser.js                # /ppgetuser
```

## Scripts

```bash
npm start         # Start Express server + Discord bot
npm run register  # Register global slash commands with Discord (run this whenever new commands are added; may take up to 1hr to propagate)
```
