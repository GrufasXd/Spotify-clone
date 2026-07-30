const express = require('express')
const cors = require('cors')
const db = require('./database')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/songs', express.static(path.join(__dirname, 'songs')))
app.use('/album_covers', express.static(path.join(__dirname, 'album_covers')))


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
  const albumData = db.prepare('SELECT a.*, art.name AS artist_name, art.id AS artist_id FROM albums AS a JOIN artists AS art ON art.id = a.artist_id WHERE a.id = ?').get(albumId)
  res.json(albumData)
})

// Gauti albumo dainas
app.get('/api/albums/:id/songs', (req, res) => {
  const albumId = req.params.id
  const albumSongs = db.prepare('SELECT * FROM songs WHERE album_id = ?').all(albumId)
  res.json(albumSongs)
})

app.get('/api/playlists/:id/songs', (req,res) => {
  const playlist_id = req.params.id

  const playlistData = db.prepare('SELECT s.* FROM songs AS s JOIN playlist_songs AS ps ON s.id = ps.song_id WHERE ps.playlist_id = ?').all(playlist_id)
  res.json(playlistData)
})

// **********************************  POST **********************************

// Naujo playlisto sukurimas
app.post('/api/playlists', (req,res) => {
  const name = req.body.name

  const playlist = db.prepare(
    'INSERT INTO playlists (name) VALUES (?)'
  ).run(name)

  res.json({
    id: playlist.lastInsertRowid,
    name: name
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


// **********************************  DELETE **********************************

//Istrinti playlista
app.delete('/api/playlists/:id', (req,res) => {
  const playlist_id = req.params.id

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