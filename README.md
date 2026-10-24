# Adiba Sheikh – Student Portal

A student portal with **Sign up**, **Sign in** and a **dashboard**. Accounts are stored in **MongoDB**, and you can browse them in **MongoDB Compass**.

**Tech stack:** React 19 + Vite (client) · Node.js + Express 5 (server) · MongoDB + Mongoose (database) · bcrypt password hashing · JWT login tokens

---

## Folder structure

```
25070521256/
├── client/                ← React frontend (http://localhost:5173)
│   └── src/
│       ├── pages/         AuthPage.jsx (sign in + sign up), Dashboard.jsx
│       ├── components/    form fields, logo, password meter, server status
│       ├── context/       AuthContext.jsx (who is logged in)
│       ├── styles/        global.css, auth.css, dashboard.css
│       └── api.js         talks to the server
│
└── server/                ← Express backend (http://localhost:5000)
    ├── .env               ← your settings (MongoDB URL is here)
    └── src/
        ├── server.js      starts Express
        ├── db.js          connects to MongoDB
        ├── models/User.js the "users" collection
        ├── routes/auth.js /signup, /login, /me
        └── middleware/    JWT check for protected routes
```

---

## Run it

### 1. Install these once

| Software | Download | Notes |
|---|---|---|
| **Node.js** (LTS) | https://nodejs.org | Keep the default options |
| **MongoDB Community Server** | https://www.mongodb.com/try/download/community | Keep **"Install MongoD as a Service"** ticked so MongoDB starts by itself. Also tick **"Install MongoDB Compass"**. |

### 2. Start the app

Open two terminals (for example in VS Code):

```bash
# Terminal 1 – server
cd server
npm install
npm run dev
```

```bash
# Terminal 2 – client
cd client
npm install
npm run dev
```

Then open **http://localhost:5173** in the browser.
Keep both terminals running while you use the app. Press `Ctrl + C` in each one to stop it.

> `npm install` is only needed the first time.

---

## Using your own MongoDB URL

Copy **`server/.env.example`** to **`server/.env`**, open it in Notepad or VS Code and change one line:

```env
# Local MongoDB (default, same as Compass "localhost:27017")
MONGO_URI=mongodb://127.0.0.1:27017/student_portal

# or MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/student_portal
```

Save the file and restart the server. Without a `.env` file the server uses the local MongoDB URL above. You don't need to create anything: the database and the **users** collection are created automatically on the first signup.

> If your Atlas password has special characters like `@ # / :`, URL-encode them (e.g. `@` → `%40`).

## Seeing the data in MongoDB Compass

1. Open Compass and connect to `mongodb://localhost:27017` (or your Atlas URL).
2. Open the database **student_portal** and then the collection **users**.
3. Every signup appears there. The password field holds a **bcrypt hash**, not the real password.

---

## API endpoints

| Method | URL | Body | What it does |
|---|---|---|---|
| GET | `/api/health` | – | Server + database status |
| POST | `/api/auth/signup` | `{ name, email, course, password }` | Creates the account and returns a token |
| POST | `/api/auth/login` | `{ email, password }` | Checks the password and returns a token |
| GET | `/api/auth/me` | Header `Authorization: Bearer <token>` | Returns the logged-in student (protected) |

**How login works:** the password is hashed with **bcrypt** before saving. On sign in, the server compares the hash and returns a **JWT token**. The React app stores the token and sends it with every protected request.

**Dashboard data:** name, email, course, member since, total sign-ins, last sign-in and student count are **real data from MongoDB**. The courses, schedule and notices are **sample data** in `client/src/data/sample.js`.

---

## Troubleshooting (Windows)

| Problem | Fix |
|---|---|
| Server terminal says **"Could not connect to MongoDB"** | MongoDB is not running. Press `Win + R`, type `services.msc`, find **MongoDB Server** and click **Start**. |
| Login page shows **"Server offline"** | The server terminal was closed or shows an error. Run `npm run dev` in the `server` folder again and read the error. |
| **"npm.ps1 cannot be loaded… running scripts is disabled"** (PowerShell) | Use **Command Prompt** instead of PowerShell, or run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| **"Port 5000 is already in use"** | Stop the old server terminal, or change `PORT=` in `server/.env`. |
| Strange errors after copying the project from another computer | Delete both `node_modules` folders and run `npm install` in each folder again. **Never copy `node_modules`** between computers, especially from Linux/Mac to Windows. |
| Very slow install | Move the project out of OneDrive/Desktop to a folder like `C:\Projects\25070521256`. |

> The code uses `127.0.0.1` instead of `localhost` on purpose. On Windows, newer Node.js versions resolve `localhost` to IPv6 (`::1`), which MongoDB does not listen on by default.
