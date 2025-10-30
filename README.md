# 🎓 Sito audio lezioni EIF / LTBA

Questo progetto contiene un'app Node.js (Express) per pubblicare file audio di due corsi (EIF e LTBA)
con area admin protetta. Carica i file audio dall'area admin specificando titolo e data della lezione.

## Contenuto
- server.js
- package.json
- .env.example
- .gitignore
- README.md

## Avvio locale (opzionale)
1. Copia il modello .env:
   cp .env.example .env
2. Modifica .env con ADMIN_USER e ADMIN_PASS
3. Installa Node.js (LTS) se non è installato.
4. npm install
5. npm run start
6. Apri http://localhost:3000

## Deploy rapido su Glitch
1. Vai su https://glitch.com e fai login.
2. Crea un nuovo progetto (New Project) → "Import from GitHub" o "Upload Project".
3. Se presente, carica il file ZIP fornito.
4. Apri .env (Tools → .env) in Glitch e inserisci le stesse variabili:
   ADMIN_USER, ADMIN_PASS, PORT
5. Il progetto sarà disponibile con un link tipo https://nomeprogetto.glitch.me

**Nota sulla sicurezza:** non mettere file sensibili pubblici su repo pubbliche. Cambia la password dopo il primo accesso se vuoi.
