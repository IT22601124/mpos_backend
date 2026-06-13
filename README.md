# MPOS Backend

Node.js and Express backend scaffold.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

The API starts on `http://localhost:5000` by default.

Set your MySQL connection values in `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mpos_backend
```

Create the database and tables with `database/schema.sql`.

## Scripts

- `npm start` - run the production server
- `npm run dev` - run with nodemon
- `npm test` - run Node test runner tests
- `npm run lint` - run ESLint

## Structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/
  validators/
tests/
```
