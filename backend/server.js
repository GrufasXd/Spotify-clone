const express = require('express')
const cors = require('cors')
const db = require('./database')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/songs', express.static(path.join(__dirname, 'songs')))

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
  const searchedString = db.prepare('SELECT s.*, a.* FROM songs AS s JOIN artists AS a ON s.artist_id = a.id WHERE a.name LIKE ?').all('%' + query + '%')
  res.json(searchedString)
})

app.listen(3001, () => console.log('Serveris veikia: http://localhost:3001'))