# docuChat

A TypeScript-based Express application configured with Prisma ORM and organized using controller, service, and repository layers.

## Project structure

- `src/controllers`: HTTP controllers
- `src/services`: business logic
- `src/repositories`: database access
- `src/middlewares`: Express middleware
- `src/config`: shared database configuration
- `prisma`: Prisma schema

## Run the server

```bash
npm install
npm start
```

The server starts on `http://localhost:3000` by default.

## Example endpoints

- `GET /health`
- `GET /api/users`
- `POST /api/users`

Example request:

```bash
curl -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com"}'
```
