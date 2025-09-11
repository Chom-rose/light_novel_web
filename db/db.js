const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db_path = path.resolve(__dirname, "novel.db");
const db = new sqlite3.Database(db_path, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");

    // novels
    db.run(
      `CREATE TABLE IF NOT EXISTS novels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        content TEXT,
        author TEXT,
        image BLOB,
        category TEXT NOT NULL,
        user_id INTEGER,        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`,
      (err) => {
        if (err) console.error("Error creating novels:", err.message);
        else console.log("Table 'novels' is ready.");
      }
    );

    // users
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        age INTEGER,
        email TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0
      )`,
      (err) => {
        if (err) console.error("Error creating users:", err.message);
        else console.log("Table 'users' is ready.");
      }
    );

    // chapters
    db.run(
      `CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        novel_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE
      )`,
      (err) => {
        if (err) console.error("Error creating chapters:", err.message);
        else console.log("Table 'chapters' is ready.");
      }
    );
  }
});

module.exports = db;
