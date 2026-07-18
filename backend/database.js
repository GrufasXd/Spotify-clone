const Database = require('better-sqlite3')
const db = new Database('db.sqlite')

db.exec(`
  CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    monthly_listeners INT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    cover_url TEXT,
    FOREIGN KEY (artist_id) REFERENCES artists(id)
  );

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    duration INTEGER,
    file_url TEXT,
    FOREIGN KEY (artist_id) REFERENCES artists(id),
    FOREIGN KEY (album_id) REFERENCES albums(id)
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`)

// Test duomenys
const count = db.prepare('SELECT COUNT(*) as c FROM songs').get()
if (count.c === 0) {
  const artist = db.prepare(`INSERT INTO artists (name, monthly_listeners) VALUES(?,?)`)
  const yeat = artist.run('Yeat', 23000000).lastInsertRowid
  const shy = artist.run('Jessica Shy', 243237).lastInsertRowid
  const kanye = artist.run('Kanye West', 64000000).lastInsertRowid
  const album = db.prepare(`INSERT INTO albums (title, artist_id) VALUES(?,?)`)
  const adl = album.run('ADL', yeat).lastInsertRowid
  const pablo = album.run('The Life of Pablo', kanye).lastInsertRowid
  const song = db.prepare('INSERT INTO songs (title, artist_id, album_id, duration, file_url) VALUES (?, ?, ?, ?, ?)')
  song.run('Naked', yeat, adl, 135, '/songs/Naked.mp3')
  song.run('Heliman', yeat, adl, 312, '/songs/HeliMAn 4.mp3')
  song.run('30 hours', kanye, pablo, 523, '/songs/30 Hours 4.mp3')
}

module.exports = db