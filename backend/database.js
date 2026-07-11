const Database = require('better-sqlite3')
const db = new Database('db.sqlite')

db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration INTEGER,
    file_url TEXT
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`)

// Test duomenys
const count = db.prepare('SELECT COUNT(*) as c FROM songs').get()
if (count.c === 0) {
  const insert = db.prepare('INSERT INTO songs (title, artist, album, duration, file_url) VALUES (?, ?, ?, ?, ?)')
  insert.run('Naked', 'Yeat', 'ADL', 135, '/songs/Naked.mp3')
  insert.run('Heliman', 'Yeat', '', 312, '/songs/HeliMAn 4.mp3')
  insert.run('30 hours', 'Kanye West', 'The life of pablo', 523, '/songs/30 Hours 4.mp3')
}

module.exports = db