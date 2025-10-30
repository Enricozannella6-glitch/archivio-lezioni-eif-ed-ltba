// ====== IMPORT PRINCIPALI ======
import express from "express";
import multer from "multer";
import session from "express-session";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====== CREAZIONE CARTELLE AUTOMATICA ======
const uploadDir = path.join(process.cwd(), "uploads");
const courses = ["eif", "ltba", "assicurazione"];
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
for (const c of courses) {
  const dir = path.join(uploadDir, c);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

// ====== CONFIGURAZIONE SERVER ======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "archiviolezioni_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/uploads", express.static(uploadDir));

// ====== CREDENZIALI ADMIN ======
const ADMIN_USER = process.env.ADMIN_USER || "enrico";
const ADMIN_PASS = process.env.ADMIN_PASS || "1234";

// Middleware autenticazione
function requireLogin(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect("/login");
}

// ====== STORAGE PER MULTER ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const course = req.body.course;
    const dir = path.join(uploadDir, course);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ====== HOME PAGE ======
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Archivio Lezioni EIF & LTBA</title>
        <style>
          body {
            font-family: 'Helvetica Neue', sans-serif;
            background-color: #000;
            color: #1DB954;
            text-align: center;
            margin: 0;
            padding: 40px;
          }
          h1 { font-size: 2.2em; margin-bottom: 40px; }
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
          }
          .card {
            background-color: #111;
            border-radius: 20px;
            padding: 25px 40px;
            width: 300px;
            text-align: center;
            transition: 0.3s;
          }
          .card:hover {
            background-color: #1a1a1a;
            transform: scale(1.03);
          }
          a {
            color: white;
            text-decoration: none;
            font-weight: bold;
          }
          .admin-link {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #fff;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <a href="/admin" class="admin-link">Admin</a>
        <h1>Archivio Lezioni EIF & LTBA</h1>
        <div class="container">
          <div class="card"><h3>Economia degli Intermediari Finanziari</h3><a href="/eif">Apri archivio</a></div>
          <div class="card"><h3>Tecnica Bancaria e Assicurativa</h3><a href="/ltba">Apri archivio</a></div>
          <div class="card"><h3>Parte Aggiuntiva di Assicurazione</h3><a href="/assicurazione">Apri archivio</a></div>
        </div>
      </body>
    </html>
  `);
});

// ====== LOGIN ======
app.get("/login", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login Admin</title>
        <style>
          body {
            background-color: #000;
            color: #1DB954;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: 'Helvetica Neue', sans-serif;
          }
          form {
            background-color: #111;
            padding: 40px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            width: 300px;
          }
          input {
            margin-bottom: 15px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #222;
            color: white;
          }
          button {
            background-color: #1DB954;
            border: none;
            color: black;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
          }
          a { color: #1DB954; text-decoration: none; }
        </style>
      </head>
      <body>
        <form method="POST" action="/login">
          <h2>Accesso Admin</h2>
          <input name="username" placeholder="Nome utente" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Accedi</button>
        </form>
      </body>
    </html>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.loggedIn = true;
    res.redirect("/admin");
  } else {
    res.send("<h2>❌ Credenziali errate</h2><a href='/login'>Torna al login</a>");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ====== AREA ADMIN ======
app.get("/admin", requireLogin, (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Area Admin</title>
        <style>
          body { background-color:#000; color:#1DB954; font-family:'Helvetica Neue'; text-align:center; padding:40px; }
          form { margin-top:20px; display:inline-block; text-align:left; background:#111; padding:20px; border-radius:10px; }
          input, select { width:100%; margin-bottom:10px; padding:8px; border:none; border-radius:5px; background:#222; color:#fff; }
          button { background:#1DB954; border:none; color:black; padding:8px 15px; border-radius:5px; cursor:pointer; }
          a { color:#1DB954; text-decoration:none; }
        </style>
      </head>
      <body>
        <h1>Carica una nuova lezione</h1>
        <form action="/upload" method="POST" enctype="multipart/form-data">
          <label>Corso:</label>
          <select name="course" required>
            <option value="eif">Economia degli Intermediari Finanziari</option>
            <option value="ltba">Tecnica Bancaria e Assicurativa</option>
            <option value="assicurazione">Parte Aggiuntiva di Assicurazione</option>
          </select>
          <label>Data lezione:</label>
          <input type="date" name="date" required />
          <label>Titolo lezione:</label>
          <input type="text" name="title" placeholder="Titolo" required />
          <label>File audio:</label>
          <input type="file" name="file" accept="audio/*" required />
          <button type="submit">Carica</button>
        </form>
        <p><a href="/">⬅ Torna all'archivio</a></p>
      </body>
    </html>
  `);
});

// ====== UPLOAD FILE ======
app.post("/upload", requireLogin, upload.single("file"), (req, res) => {
  const { course, date, title } = req.body;
  const file = req.file;
  if (!file) return res.send("Nessun file caricato");

  const metadataPath = path.join(uploadDir, course, "metadata.json");
  let metadata = [];
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath));
  }

  metadata.push({
    title,
    date,
    filename: file.filename,
  });

  // Ordina per data
  metadata.sort((a, b) => new Date(a.date) - new Date(b.date));
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  res.send("<h2>✅ File caricato con successo!</h2><a href='/admin'>Torna indietro</a>");
});

// ====== VISUALIZZAZIONE ARCHIVI ======
app.get("/:course", (req, res) => {
  const { course } = req.params;
  if (!courses.includes(course)) return res.send("Corso non trovato");

  const dir = path.join(uploadDir, course);
  const metadataPath = path.join(dir, "metadata.json");
  if (!fs.existsSync(metadataPath))
    return res.send("<h3>Nessun file presente per questo corso</h3>");

  const metadata = JSON.parse(fs.readFileSync(metadataPath));
  const list = metadata
    .map(
      (f) => `
      <div class="card">
        <strong>${f.title}</strong><br>
        <small>${f.date}</small><br>
        <audio controls src="/uploads/${course}/${f.filename}"></audio><br>
        <a href="/download/${course}/${f.filename}">⬇ Scarica</a>
      </div>`
    )
    .join("");

  res.send(`
    <html>
      <head>
        <title>${course.toUpperCase()} - Archivio</title>
        <style>
          body { background:#000; color:#1DB954; font-family:'Helvetica Neue'; text-align:center; padding:40px; }
          .card { background:#111; margin:20px auto; padding:20px; border-radius:10px; width:80%; max-width:500px; }
          a { color:#1DB954; text-decoration:none; }
        </style>
      </head>
      <body>
        <h1>Archivio ${course.toUpperCase()}</h1>
        ${list}
        <p><a href="/">⬅ Torna all'archivio principale</a></p>
      </body>
    </html>
  `);
});

// ====== DOWNLOAD ======
app.get("/download/:course/:file", (req, res) => {
  const { course, file } = req.params;
  const filePath = path.join(uploadDir, course, file);
  if (fs.existsSync(filePath)) res.download(filePath);
  else res.send("File non trovato");
});

// ====== AVVIO SERVER ======
function startServer(port) {
  const server = app
    .listen(port, () => {
      console.log(`✅ Server avviato su http://localhost:${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`⚠️ Porta ${port} occupata, provo la successiva...`);
        server.close();
        startServer(port + 1); // tenta con la porta successiva
      } else {
        console.error("❌ Errore server:", err);
      }
    });
}

// Avvio iniziale
startServer(parseInt(process.env.PORT) || 3000);
