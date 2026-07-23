import { useState } from "react"
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


function App() {
  let navigate = useNavigate()
  const [currentSong, setCurrentSong] = useState(null)

  function handleSongSelect(song){
    setCurrentSong(song)
  }


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
                <SidebarLeft/>
                <MainContent onSongSelect={handleSongSelect}/>
                <SidebarRight/>
              </div>
            }/>
            <Route path="/artist/:id" element={
              <div className="contentArea">
                <SidebarLeft/>
                <ArtistPage onSongSelect={handleSongSelect}/>
                <SidebarRight/>
              </div>
              }/>
              <Route path="/album/:id" element={
              <div className="contentArea">
                <SidebarLeft/>
                <AlbumPage onSongSelect={handleSongSelect}/>
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
