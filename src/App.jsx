import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"

import ArtistPage from "./ArtistPage"
import AlbumPage from "./AlbumPage"
import SpotifyLogo from "./SpotifyLogo"
import HomeButton from "./HomeButton"
import SearchBar from "./SeachBar"
import ProfileIcon from "./ProfileIcon"
import NewsButton from "./NewsButton"
import SidebarLeft from "./SidebarLeft"
import MainContent from "./MainContent"
import SidebarRight from "./SidebarRight"
import SongBottomLine from "./SongBottomLine"
import PlaylistPage from "./PlaylistPage"


function App() {
  let navigate = useNavigate()
  const [currentSong, setCurrentSong] = useState(null)
  const [playlistData, setPlaylistData] = useState([])

  function handleSongSelect(song){
    setCurrentSong(song)
  }

  function removePlaylistFromSidebar(playlistId){
    console.log("REMOVING:", playlistId)
    setPlaylistData(prev => prev.filter(playlist => playlist.id != playlistId))
  }

  useEffect(() => {
      fetch(`http://localhost:3001/api/playlists`)
      .then(res => res.json())
      .then(data => setPlaylistData(data))
  }, [])

  return(<>
          <div className="mainTheme">
            <SpotifyLogo/>
            <div className="topCenter">
              <div className="homeButton" onClick={() => navigate(`/`)}>
                <HomeButton/>
              </div>
              <SearchBar onSongSelect={handleSongSelect}/>
            </div>
            <div className="topRight">
              <NewsButton/>
              <ProfileIcon/>
            </div>
          </div>
          <Routes>
            <Route path="/" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData}/>
                <MainContent onSongSelect={handleSongSelect}/>
                <SidebarRight/>
              </div>
            }/>
            <Route path="/artist/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData}/>
                <ArtistPage onSongSelect={handleSongSelect}/>
                <SidebarRight/>
              </div>
            }/>
            <Route path="/album/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData}/>
                <AlbumPage onSongSelect={handleSongSelect}/>
                <SidebarRight/>
              </div>
            }/>
            <Route path="/playlist/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData}/>
                <PlaylistPage onSongSelect={handleSongSelect} removePlaylistFromSidebar={removePlaylistFromSidebar}/>
                <SidebarRight/>
              </div>
            }/>
          </Routes>
          <div>
            <SongBottomLine currentSong={currentSong}/>
          </div>
        </>)
}

export default App
