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

async function hashPassword(password){
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password,salt)
  return passwordHash
}

async function comparePassword(userPassword, passwordHash){
  const result = await bcrypt.compare(userPassword, passwordHash)
  return result
}


// **********************************  GET **********************************

// Visos dainos
app.get('/api/songs', (req, res) => {
  const songs = db.prepare('SELECT * FROM songs').all()
  res.json(songs)
})

// Visi playlist'ai
app.get('/api/playlists', (req, res) => {
  const playlists = db.prepare('SELECT * FROM playlists').all()
  res.json(playlists)
})

// Gauti viena playlista pagal id
app.get('/api/playlists/:id', (req, res) => {
  const playlist_id = req.params.id
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
  const searchedString = db.prepare('SELECT s.*, a.id AS artist_id, a.name FROM songs AS s JOIN artists AS a ON s.artist_id = a.id WHERE s.title LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Searchintu artistu dainos
app.get('/api/artists/songs', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT s.*, a.id AS artist_id, a.name FROM songs AS s JOIN artists AS a ON s.artist_id = a.id WHERE a.name LIKE ?').all('%' + query + '%')
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
  const artistSongs = db.prepare('SELECT * FROM songs WHERE artist_id = ?').all(artistId)
  res.json(artistSongs)
})

// Gauti artisto albumus
app.get('/api/artists/:id/albums', (req, res) => {
  const artistId = req.params.id
  const artistAlbums = db.prepare('SELECT * FROM albums WHERE artist_id = ?').all(artistId)
  res.json(artistAlbums)
})

// Gauti albuma pagal id
app.get('/api/albums/:id', (req, res) => {
  const albumId = req.params.id
  const albumData = db.prepare('SELECT a.*, art.name AS artist_name, art.id AS artist_id FROM albums AS a JOIN artists AS art ON art.id = a.artist_id WHERE a.id = ?').get(albumId)
  res.json(albumData)
})

// Gauti albumo dainas
app.get('/api/albums/:id/songs', (req, res) => {
  const albumId = req.params.id
  const albumSongs = db.prepare('SELECT * FROM songs WHERE album_id = ?').all(albumId)
  res.json(albumSongs)
})

// Gauti dainas kurios yra playliste
app.get('/api/playlists/:id/songs', (req,res) => {
  const playlist_id = req.params.id

  const playlistData = db.prepare('SELECT s.* FROM songs AS s JOIN playlist_songs AS ps ON s.id = ps.song_id WHERE ps.playlist_id = ?').all(playlist_id)
  res.json(playlistData)
})

app.get('/api/songs/random', (req, res) =>{
  const currentSongId = req.query.exclude
  const randomSong = db.prepare('SELECT * FROM songs WHERE id != ? ORDER BY RANDOM() LIMIT 1').get(currentSongId)
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
app.post('/api/playlists', (req,res) => {
  const name = req.body.name
  const description = req.body.description

  const playlist = db.prepare(
    'INSERT INTO playlists (name, description) VALUES (?,?)'
  ).run(name, description)

  res.json({
    id: playlist.lastInsertRowid,
    name: name,
    description: description
  })
})

// Dainos pridejimas i playlista
app.post('/api/playlists/:id/songs', (req,res) => {
  const playlist_id = req.params.id
  const song_id = req.body.song_id

  db.prepare(
    'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?,?)'
  ).run(playlist_id, song_id)

  res.json({
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
app.put('/api/playlists/:id', (req, res) => {
  const playlist_id = req.params.id
  const name = req.body.name
  const description = req.body.description

  db.prepare(
    'UPDATE playlists SET name = ?, description = ? WHERE id = ?'
  ).run(name, description, playlist_id)

  res.json({
    message: "Playlist updated"
  })
})


// ********************************** DELETE **********************************

//Istrinti playlista
app.delete('/api/playlists/:id', (req,res) => {
  const playlist_id = req.params.id

  db.prepare(
    'DELETE FROM playlist_songs WHERE playlist_id = ?'
  ).run(
    playlist_id
  )

  db.prepare(
    'DELETE FROM playlists WHERE id = ?'
  ).run(
    playlist_id
  )

  res.json({
    message: "Playlist deleted"
  })
})

// Istrinti daina is playlisto
app.delete('/api/playlists/:id/songs/:songId', (req,res) => {
  const playlist_id = req.params.id
  const song_id = req.params.songId

  db.prepare(
    'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?'
  ).run(playlist_id, song_id)

  res.json({
    message: "Song removed from playlist"
  })
})

app.listen(3001, () => console.log('Serveris veikia: http://localhost:3001'))