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

app.listen(3001, () => console.log('Serveris veikia: http://localhost:3001'))