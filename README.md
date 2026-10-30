# Spotify Clone 🎵

A full-stack music streaming application inspired by Spotify, built with React, Vite, Node.js, Express, and SQLite.

The project recreates a Spotify-inspired music experience with a music catalog, audio playback, user authentication, personal playlists, and liked songs.

## ✨ Features

- **User authentication** — register, log in, and log out using cookie-based sessions.
- **Home page** — a time-of-day greeting, your recently played songs, and scrollable rows of albums and artists. Albums can be played straight from the home page.
- **Music search** — search for artists, songs, and albums; song results also include songs by matching artists.
- **Artist and album pages** — artist pages have a header photo, popular songs, and a scrollable row of albums; album pages list the album's songs and total duration.
- **Audio player** — play, pause, skip forward and backward, seek through a song, and adjust or mute the volume.
- **Playback options** — shuffle the current song list or repeat a song once or continuously. Album and playlist pages have their own play/pause and shuffle buttons.
- **Now playing indicators** — the current song is highlighted in every list with an animated equalizer that pauses with the music.
- **Queue management** — add songs to the queue, play queued songs, remove individual songs, and clear the queue.
- **Personal playlists** — create, edit, and delete playlists; add songs to a playlist or remove them. The same song can be added more than once. Playlist covers are built from the album covers of the songs inside them.
- **Liked songs** — like songs with the heart button in song lists or the player bar; they are collected on a Liked Songs page in your library.
- **Recently played** — the last six songs you played are saved to your account and shown on the home page.
- **Resizable sidebars** — show or hide the library and queue panels and adjust their widths.
- **Persistent storage** — store users, sessions, artists, albums, songs, playlists, liked songs, and listening history in SQLite.

## 🛠️ Tech Stack

**Frontend**

- React (hooks and Context)
- React Router
- Vite
- JavaScript
- CSS
- react-icons and react-tooltip

**Backend**

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Session-based authentication with cookies

## 📸 Screenshots

### Home Page

![Home Page](docs/screenshots/home.png)

### Playlist View

![Playlist View](docs/screenshots/playlist.png)

### Authentication

![Authentication](docs/screenshots/authentication.png)

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

1. Clone the repository and install the frontend dependencies from the project root:

   ```bash
   git clone https://github.com/GrufasXd/Spotify-clone.git
   cd Spotify-clone
   npm install
   ```

2. Start the frontend development server:

   ```bash
   npm run dev
   ```

3. In a separate terminal, install the backend dependencies and start the Express server:

   ```bash
   cd backend
   npm install
   node server.js
   ```

4. Open the frontend URL displayed by Vite, usually `http://localhost:5173`.

   The backend runs separately at `http://localhost:3001`.

### Backend address (optional)

The frontend reads the backend address from the `VITE_API_URL` environment variable and falls back to `http://localhost:3001`. To use a different address, create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:3001
```

## 🗄️ Database

The application uses SQLite through `better-sqlite3` to store user accounts, sessions, artists, albums, songs, playlists, liked songs, and recently played songs. On startup, the backend creates the required tables and adds sample music data when the songs table is empty.

## 📚 What I Learned

- Building a full-stack application with React and Express.
- Designing and connecting REST API endpoints.
- Implementing session-based authentication with HTTP cookies.
- Working with relational databases and SQL queries, including JOINs across songs, albums, and artists.
- Managing user-specific data and playlist relationships.
- Connecting frontend components to a backend API.
- Using React Context to avoid passing props through many component levels.
- Splitting reusable UI and helper functions into their own components and modules.
- Building CSS animations and transitions, such as the playing equalizer and hover effects.

## 📌 Future Improvements

- Add catalog filters and sorting, such as filtering songs by artist or album.
- Save the playback queue between app sessions.
- Add genre- or mood-based browsing and personalized recommendations.
- Improve the layout and controls for small screens.
- Deploy the application and provide an online live demo.

---

**Note:** This is an independent project inspired by Spotify's user interface and functionality. It is not affiliated with or endorsed by Spotify.
