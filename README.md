# Conversation Session Service

Backend service for managing conversation sessions and events for a Voice AI platform.

This project was created as part of a backend take-home assignment and emphasizes correctness, idempotency, concurrency-safety, and a clean separation of concerns.

**Table of contents**

- Overview
- Tech stack
- Features
- Architecture & important design decisions
- Getting started
- Environment variables
- Run
- API overview & examples
- Data models / DTOs

## Overview

This service provides APIs to create conversation sessions and ingest immutable events tied to those sessions. It's designed to be:

- Idempotent: repeated requests do not create duplicates.
- Concurrency-safe: MongoDB operations handle concurrent access safely.
- Scalable: cursor-based pagination to efficiently stream large event sets.

## Tech stack

- Node.js (>= 18)
- TypeScript
- NestJS
- MongoDB with Mongoose

## Features

- Create sessions (idempotent)
- Ingest events (immutable + idempotent)
- Pagination to fetch events
- Repository/service/controller separation for clean architecture

## Architecture & important design decisions

- Controllers: Expose HTTP endpoints and validate input DTOs.
- Services: Coordinate business logic, ensure idempotency and validation.
- Repositories: Encapsulate MongoDB / Mongoose operations and concurrency-safe updates.
- Schemas: Mongoose schemas under `src/sessions/schemas` define the persisted models.

Important implementation notes:

- Events are immutable once persisted.
- Idempotency keys (or natural unique constraints) are used to prevent duplicate entities/events.
- Pagination uses stable ordering (timestamps + unique ID) to page through events safely.

## Getting started

Prerequisites:

- Node.js v18 or newer
- A running MongoDB instance (local or remote)
- `npm` or `yarn`

Install dependencies:

```bash
npm install
# or
yarn install
```

## Environment variables

Create a `.env` file in the project root. Common variables:

- `DB_URI` - MongoDB connection string (e.g. `mongodb://localhost:27017/conversation`) 

## Run

Start in development (NestJS watch):

```bash
npm run start:dev
```

## API overview & examples

This project exposes endpoints related to sessions and session events. See `src/sessions/sessions.controller.ts` for exact routes and payloads.

Typical endpoints:

- `POST /sessions` - Create or upsert a session (idempotent)
- `GET /sessions/:id` - Fetch session metadata
- `POST /sessions/:id/events` - Ingest an event for a session (immutable)
- `GET /sessions/:id/events` - List events for a session (cursor-based pagination)

Example: create a session

```bash
POST http://localhost:3000/sessions,
'{ "sessionId": "abc123", "metadata": {"caller": "user@example.com"} }'
```

Example: ingest an event

```bash
POST http://localhost:3000/sessions/abc123/events,
'{ "eventId": "evt-001", "type": "TRANSCRIPT", "payload": {"text": "hello"} }'
```

Pagination example:

```bash
"http://localhost:3000/sessions/abc123/events?limit=50&page=2"
```

The service uses cursor tokens encoding the position (timestamp + id) to page reliably.

## Data models / DTOs

Source files for schemas and DTOs:

- `src/sessions/schemas/session.schema.ts`
- `src/sessions/schemas/event.schema.ts`
- `src/sessions/dto/*.ts` (create-session, add-event, etc.)

Refer to those files for the canonical request/response shapes. DTOs include TypeScript types and validation decorators for request validation.

## Where to look in the code

- `src/sessions` - Session-related controllers, services, repositories, DTOs, and schemas.
- `src/app.module.ts` - Root module wiring.
