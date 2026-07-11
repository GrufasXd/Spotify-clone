import { useState } from "react"

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
  const [currentSong, setCurrentSong] = useState(null)

  function handleSongSelect(song){
    setCurrentSong(song)
  }


  return(<>
          <div className="mainTheme">
            <SpotifyLogo/>
            <div className="topCenter">
              <HomeButton/>
              <SearchBar/>
            </div>
            <div className="topRight">
              <NewsButton/>
              <ProfileIcon/>
            </div>
          </div>
          <div className="contentArea">
            <SidebarLeft/>
            <MainContent onSongSelect={handleSongSelect}/>
            <SidebarRight/>
          </div>
          <div>
            <SongBottomLine currentSong={currentSong}/>
          </div>
        </>)
}

export default App
