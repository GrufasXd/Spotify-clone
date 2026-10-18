const express = require('express')
const cors = require('cors')
const db = require('./database')
const path = require('path')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use('/songs', express.static(path.join(__dirname, 'songs')))
app.use('/album_covers', express.static(path.join(__dirname, 'album_covers')))
app.use(cookieParser())

const albumCoversQuery = db.prepare(`
    SELECT DISTINCT alb.cover_url
    FROM playlist_songs AS ps
    JOIN songs AS s ON s.id = ps.song_id
    JOIN albums AS alb ON alb.id = s.album_id
    WHERE ps.playlist_id = ?
    LIMIT 4
  `)

async function hashPassword(password){
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password,salt)
  return passwordHash
}

async function comparePassword(userPassword, passwordHash){
  const result = await bcrypt.compare(userPassword, passwordHash)
  return result
}

function sessionCheck(req, res, next){
  const session_token = req.cookies.session_token

  if(!session_token){
    return res.status(401).json({
      status: 'error',
      message: `User not logged in`
    })
  }
  const session = db.prepare('SELECT user_id FROM sessions WHERE session_token = ?').get(session_token);

  if (!session) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid session'
    });
  }

  req.userId = session.user_id;
  next();
}


// **********************************  GET **********************************

// Visi albumai
app.get('/api/albums', (req, res) => {
  const albums = db.prepare('SELECT alb.*, art.name AS artist_name FROM albums AS alb JOIN artists AS art ON alb.artist_id = art.id').all()
  res.json(albums)
})

// Visos dainos
app.get('/api/songs', (req, res) => {
  const songs = db.prepare('SELECT s.*, alb.cover_url, alb.title AS album_title FROM songs AS s JOIN albums AS alb ON s.album_id = alb.id').all()
  res.json(songs)
})

// Tik vartotojo playlist'ai
app.get('/api/playlists', sessionCheck, (req, res) => {
  const playlists = db.prepare('SELECT id, name, description FROM playlists WHERE user_id = ?').all(req.userId)
  const playlistsWithCovers = playlists.map(playlist => ({
    ...playlist,
    covers: albumCoversQuery.all(playlist.id).map(row => row.cover_url)
  }))
  res.json(playlistsWithCovers)
})

// Gauti viena playlista pagal id
app.get('/api/playlists/:id',  sessionCheck, (req, res) => {
  const playlist_id = req.params.id

  const playlist = db.prepare(
    'SELECT id FROM playlists WHERE id = ? AND user_id = ?'
  ).get(playlist_id, req.userId);

  if (!playlist) {
    return res.status(404).json({
      message: 'Playlist not found'
    });
  }
  
  const playlists = db.prepare('SELECT * FROM playlists WHERE id = ?').get(playlist_id)
  res.json(playlists)
})

// Tik searchinti artistai
app.get('/api/artists/search', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT * FROM artists WHERE name LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Tik searchintos dainos
app.get('/api/songs/search', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT s.*, alb.cover_url, alb.title AS album_title, a.id AS artist_id, a.name FROM songs AS s JOIN artists AS a ON s.artist_id = a.id JOIN albums AS alb ON s.album_id = alb.id WHERE s.title LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Searchintu artistu dainos
app.get('/api/artists/songs', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT s.*, alb.cover_url, alb.title AS album_title, a.id AS artist_id, a.name FROM songs AS s JOIN artists AS a ON s.artist_id = a.id JOIN albums AS alb ON s.album_id = alb.id WHERE a.name LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Ieskoti albumu pagal varda searchbare
app.get('/api/albums/search', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT alb.*, a.name AS artist_name FROM albums AS alb JOIN artists AS a ON alb.artist_id = a.id WHERE alb.title LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Gauti artisto duomenis is id
app.get('/api/artists/:id', (req, res) => {
  const neededId = req.params.id
  const artistData = db.prepare('SELECT * FROM artists WHERE id = ?').get(neededId)
  res.json(artistData)
})

// Gauti artisto dainas pagal jo id
app.get('/api/artists/:id/songs', (req, res) => {
  const artistId = req.params.id
  const artistSongs = db.prepare('SELECT s.*, alb.cover_url, alb.title AS album_title FROM songs AS s JOIN albums AS alb ON s.album_id = alb.id WHERE s.artist_id = ?').all(artistId)
  res.json(artistSongs)
})

// Gauti artisto albumus
app.get('/api/artists/:id/albums', (req, res) => {
  const artistId = req.params.id
  const artistAlbums = db.prepare('SELECT * FROM albums WHERE artist_id = ?').all(artistId)
  res.json(artistAlbums)
})

// Gauti albuma pagal albumo id
app.get('/api/albums/:id', (req, res) => {
  const albumId = req.params.id
  const albumData = db.prepare('SELECT a.*, art.name AS artist_name, art.id AS artist_id FROM albums AS a JOIN artists AS art ON art.id = a.artist_id WHERE a.id = ?').get(albumId)
  res.json(albumData)
})

// Gauti albumo dainas
app.get('/api/albums/:id/songs', (req, res) => {
  const albumId = req.params.id
  const albumSongs = db.prepare('SELECT s.*, alb.cover_url, alb.title AS album_title FROM songs AS s JOIN albums AS alb ON s.album_id = alb.id WHERE alb.id = ?').all(albumId)
  res.json(albumSongs)
})

// Gauti dainos albuma pagal dainos id
app.get('/api/songs/:song_id/album', (req, res) => {
  const albumData = db.prepare(`
    SELECT albums.*, artists.name AS artist_name, artists.id AS artist_id
    FROM songs
    JOIN albums ON albums.id = songs.album_id
    JOIN artists ON artists.id = albums.artist_id
    WHERE songs.id = ?
  `).get(req.params.song_id)

  if (!albumData) {
    return res.status(404).json({ message: 'Song or album not found' })
  }

  res.json(albumData)
})

// Gauti dainas kurios yra playliste
app.get('/api/playlists/:id/songs', sessionCheck, (req,res) => {
  const playlist_id = req.params.id

  const playlist = db.prepare(
    'SELECT id FROM playlists WHERE id = ? AND user_id = ?'
  ).get(playlist_id, req.userId);

  if (!playlist) {
    return res.status(404).json({
      message: 'Playlist not found'
    });
  }

  const playlistData = db.prepare('SELECT s.*, ps.id AS playlist_song_id, alb.cover_url, alb.title AS album_title FROM songs AS s JOIN playlist_songs AS ps ON s.id = ps.song_id JOIN albums AS alb ON s.album_id = alb.id WHERE ps.playlist_id = ? ORDER BY ps.id').all(playlist_id)
  return res.json(playlistData)
})

// Naujos atsitiktines dainos paemimas is db, kad pastoviai grotu dainos
app.get('/api/songs/random', (req, res) =>{
  const currentSongId = req.query.exclude
  const randomSong = db.prepare('SELECT s.*, alb.cover_url, alb.title AS album_title FROM songs AS s JOIN albums AS alb ON s.album_id = alb.id WHERE s.id != ? ORDER BY RANDOM() LIMIT 1').get(currentSongId)
  res.json(randomSong)
})

app.get('/api/auth/me', (req, res) => {
  const session_token = req.cookies.session_token

  if(!session_token){
    return res.status(401).json({
      status: 'error',
      message: `User not logged in`
    })
  }

  const userObject= db.prepare(
    'SELECT user_id FROM sessions WHERE session_token = ?'
  ).get(session_token)

  if(!userObject){
    return res.status(401).json({
      status: 'error',
      message: `Session doensn't exist`
    })
  }

  const session_user = db.prepare(
    'SELECT id,username,email FROM users WHERE id = ?'
  ).get(userObject.user_id)
  res.json(session_user)
})

// ********************************** POST **********************************

// Naujo playlisto sukurimas
app.post('/api/playlists', sessionCheck, (req,res) => {
  const name = req.body.name
  const description = req.body.description

  const playlist = db.prepare(
    'INSERT INTO playlists (name, description, user_id) VALUES (?,?,?)'
  ).run(name, description, req.userId)

  res.json({
    id: playlist.lastInsertRowid,
    name: name,
    description: description,
    user_id: req.userId
  })
})

// Dainos pridejimas i playlista
app.post('/api/playlists/:id/songs', sessionCheck, (req,res) => {
  const playlist_id = req.params.id
  const song_id = req.body.song_id

  const playlist = db.prepare(
    'SELECT id FROM playlists WHERE id = ? AND user_id = ?'
  ).get(playlist_id, req.userId);

  if (!playlist) {
    return res.status(404).json({
      message: 'Playlist not found'
    });
  }

  db.prepare(
    'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?,?)'
  ).run(playlist_id, song_id)

  return res.json({
    message: "Song added"
  })
})

// Registracija
app.post('/api/auth/register', async (req,res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  if(!username || !email || !password){
    return res.status(400).json({
      status: 'error',
      message: 'Bad Request.'
    });
  }
  const existingUser = db.prepare(
    'SELECT username, email FROM users WHERE username = ? OR email = ?'
  ).get(username, email)

  if(existingUser){
    const duplicateField = existingUser.username === username ? 'username' : 'email'
    return res.status(409).json({
      status: 'error',
      message: `A user already exists with that ${duplicateField}`
    })
  }
  else{
    const hashedPassword = await hashPassword(password)
    db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?,?,?)').run(username, email, hashedPassword)
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully'
    })
  }
})

// Prisijungimas
app.post('/api/auth/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const existingUser = db.prepare(
    'SELECT id, email, password_hash FROM users WHERE email = ?'
  ).get(email)


  if(!existingUser || (! await comparePassword(password, existingUser.password_hash))){
    return res.status(401).json({
      status: 'error',
      message: `Incorrect email address or password`
    })
  }
  else{
    const sessionToken = crypto.randomBytes(32).toString('hex');
    db.prepare('INSERT INTO sessions (user_id, session_token) VALUES (?,?)').run(existingUser.id, sessionToken)
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,   // Cookie expiration time in milliseconds (e.g., 1 day)
    });
    return res.status(200).json({
      status: 'success',
      message: 'User logged in successfully'
    })
  }
})

// Logoutas
app.post('/api/auth/logout', (req, res) => {
  const session_token = req.cookies.session_token

  if(!session_token){
    return res.status(401).json({
      status: 'error',
      message: 'User is not logged in'
    })
  }
  db.prepare('DELETE FROM sessions WHERE session_token = ?').run(session_token)
  res.clearCookie('session_token');
  return res.status(200).json({
    status: 'success',
    message: 'User logged out successfully'
  })
})

// ********************************** UPDATE **********************************
app.put('/api/playlists/:id', sessionCheck, (req, res) => {
  const playlist_id = req.params.id
  const name = req.body.name
  const description = req.body.description

  db.prepare(
    'UPDATE playlists SET name = ?, description = ? WHERE id = ? AND user_id = ?'
  ).run(name, description, playlist_id, req.userId)

  res.json({
    message: "Playlist updated"
  })
})


// ********************************** DELETE **********************************

//Istrinti playlista
app.delete('/api/playlists/:id', sessionCheck, (req,res) => {
  const playlist_id = req.params.id

  const playlist = db.prepare(
    'SELECT id FROM playlists WHERE id = ? AND user_id = ?'
  ).get(playlist_id, req.userId);

  if (!playlist) {
    return res.status(404).json({
      message: 'Playlist not found'
    });
  }

  db.prepare(
    'DELETE FROM playlist_songs WHERE playlist_id = ?'
  ).run(
    playlist_id
  )

  db.prepare(
    'DELETE FROM playlists WHERE id = ? AND user_id = ?'
  ).run(
    playlist_id, req.userId
  )

  return res.json({
    message: "Playlist deleted"
  })
})

// Istrinti daina is playlisto
app.delete('/api/playlists/:id/songs/:playlistSongId', sessionCheck, (req,res) => {
  const playlist_id = req.params.id
  const playlist_song_id = req.params.playlistSongId

  const playlist = db.prepare(
    'SELECT id FROM playlists WHERE id = ? AND user_id = ?'
  ).get(playlist_id, req.userId);

  if (!playlist) {
    return res.status(404).json({
      message: 'Playlist not found'
    });
  }

  db.prepare(
    'DELETE FROM playlist_songs WHERE id = ? AND playlist_id = ?'
  ).run(playlist_song_id, playlist_id)

  return res.json({
    message: "Song removed from playlist"
  })
})

app.listen(3001, () => console.log('Serveris veikia: http://localhost:3001'))