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
  const album = db.prepare(`INSERT INTO albums (title, artist_id, cover_url) VALUES(?,?,?)`)
  const adl = album.run('ADL', yeat, '/album_covers/adl.jfif').lastInsertRowid
  const lifestyle = album.run('LIFESTYLE', yeat, '/album_covers/lifestyle.png').lastInsertRowid
  const _2093 = album.run('2093', yeat, '/album_covers/2093.png').lastInsertRowid
  const pablo = album.run('The Life of Pablo', kanye, '/album_covers/pablo.jfif').lastInsertRowid
  const song = db.prepare('INSERT INTO songs (title, artist_id, album_id, duration, file_url) VALUES (?, ?, ?, ?, ?)')
  song.run('Naked', yeat, adl, 95, '/songs/Naked.mp3')
  song.run('Heliman', yeat, adl, 192, '/songs/HeliMAn 4.mp3')
  song.run('30 hours', kanye, pablo, 323, '/songs/30 Hours 4.mp3')
}

module.exports = db