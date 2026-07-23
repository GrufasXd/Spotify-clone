const express = require('express')
const cors = require('cors')
const db = require('./database')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/songs', express.static(path.join(__dirname, 'songs')))
app.use('/album_covers', express.static(path.join(__dirname, 'album_covers')))

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

// Tik searchinti artistai
app.get('/api/artists/search', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT * FROM artists WHERE name LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Tik searchintos dainos
app.get('/api/songs/search', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT s.*, a.* FROM songs AS s JOIN artists AS a ON s.artist_id = a.id WHERE title LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Searchintu artistu dainos
app.get('/api/artists/songs', (req, res) => {
  const query = req.query.q
  const searchedString = db.prepare('SELECT s.*, a.id AS artist_id, a.name FROM songs AS s JOIN artists AS a ON s.artist_id = a.id WHERE a.name LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

// Gauti artisto duomenis is backendo
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
  const albumData = db.prepare('SELECT * FROM albums WHERE id = ?').get(albumId)
  res.json(albumData)
})

// Gauti albumo dainas
app.get('/api/albums/:id/songs', (req, res) => {
  const albumId = req.params.id
  const albumSongs = db.prepare('SELECT * FROM songs WHERE album_id = ?').all(albumId)
  res.json(albumSongs)
})

app.listen(3001, () => console.log('Serveris veikia: http://localhost:3001'))