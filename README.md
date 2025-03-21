![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![License](https://img.shields.io/github/license/ivansamoyloff/note-calendar-backend)
![Last Commit](https://img.shields.io/github/last-commit/ivansamoyloff/note-calendar-backend)

# 📘 Note Calendar Backend

Note Calendar Backend is the backend part of a Note calendar application with support for tasks and events. It features JWT-based authentication, full unit and e2e test coverage, and secure database access via Prisma.

---

## 🚀 Tech Stack

- **NestJS** — framework for building scalable server-side applications
- **Prisma** — ORM for PostgreSQL
- **JWT** — token-based authentication
- **Jest** — unit and e2e testing
- **TypeScript** — static typing

---

## 📂 Installation & Launch

```bash
# Install dependencies
npm install

# Apply migrations and generate Prisma Client
npx prisma migrate dev

# Start the application
npm run start
```

> ❗ Make sure you have a `.env` file before starting the app

### Example `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
PORT=3000
SECRET_KEY=your_jwt_secret_here
```

---

## 🔐 Authentication

All endpoints are protected with JWT, except:
- `POST /auth/login`
- `POST /auth/register`

For all other requests, include the token in the header:
```http
Authorization: Bearer <your_token>
```

---

## 🧪 Testing

- Run unit tests:
```bash
npm run test
```

- Run e2e tests:
```bash
npm run test:e2e
```

> The database is automatically cleaned before each e2e test (`NODE_ENV=test`).

---

## 📦 Key Dependencies

**Runtime:**
- `@nestjs/core`, `@nestjs/jwt`, `@nestjs/passport`
- `@prisma/client`, `bcryptjs`, `passport-jwt`

**Dev:**
- `jest`, `ts-jest`, `supertest`
- `eslint`, `prettier`, `@nestjs/testing`

---

## 🛠 Features Implemented

- User registration and login
- CRUD operations for events and tasks
- JWT protection for all routes except `/auth`
- Input validation and XSS-safe processing
- Full unit and e2e test coverage

---

## 🔧 Roadmap

- Integrate Swagger for API documentation
- Add Docker support
- Set up CI/CD pipeline (GitHub Actions / Jenkins)
- Build the client-side application

---

## 🧑‍💻 Author

Development & testing by [Ivan Samoilov](https://github.com/ivansamoyloff)

---

> Production-ready, scalable, and built for growth 💪

