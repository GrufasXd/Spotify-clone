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
  const [pageContextQueue, setPageContextQueue] = useState([])
  const [userQueue, setUserQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(null)

  function handleSongSelect(song, songList){
    setCurrentSong(song)
    setPageContextQueue(songList)
    setCurrentIndex(songList.findIndex((songInList) => songInList.id === song.id))
  }

  function queueItemClick(queueItem){
    setCurrentSong(queueItem.song)
    setUserQueue(prev => prev.filter(previousQueueItem => previousQueueItem.queueItemId !== queueItem.queueItemId))
  }

  function clearQueue(){
    setUserQueue([])
  }

  function addSongToQueue(song){
    const queueItem = {
      song: song,
      queueItemId: crypto.randomUUID()
    }
    setUserQueue(prev => [...prev, queueItem])
  }

  function nextSong(){
    if(userQueue.length != 0){
      setCurrentSong(userQueue[0].song)
      setUserQueue(prev => prev.slice(1))
    }
    else if(currentIndex !== pageContextQueue.length - 1){
      setCurrentSong(pageContextQueue[currentIndex+1])
      setCurrentIndex(currentIndex + 1)
    }
  }

  function previousSong(){
    if(currentIndex > 0){
      setCurrentSong(pageContextQueue[currentIndex-1])
      setCurrentIndex(currentIndex - 1)
    }
  }

  function removePlaylistFromSidebar(playlistId){
    setPlaylistData(prev => prev.filter(playlist => playlist.id != playlistId))
  }

  function updatePlaylistInSidebar(updatedPlaylist){
    setPlaylistData(prev => 
      prev.map(playlist => 
        playlist.id == updatedPlaylist.id ? updatedPlaylist : playlist
      )
    )
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
                <MainContent onSongSelect={handleSongSelect} playlistData={playlistData} addSongToQueue={addSongToQueue}/>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue}/>
              </div>
            }/>
            <Route path="/artist/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData}/>
                <ArtistPage onSongSelect={handleSongSelect} addSongToQueue={addSongToQueue}/>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue}/>
              </div>
            }/>
            <Route path="/album/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData}/>
                <AlbumPage onSongSelect={handleSongSelect} addSongToQueue={addSongToQueue}/>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue}/>
              </div>
            }/>
            <Route path="/playlist/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData}/>
                <PlaylistPage onSongSelect={handleSongSelect} removePlaylistFromSidebar={removePlaylistFromSidebar} updatePlaylistInSidebar={updatePlaylistInSidebar} addSongToQueue={addSongToQueue} playlists={playlistData} setPlaylists={setPlaylistData}/>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue}/>
              </div>
            }/>
          </Routes>
          <div>
            <SongBottomLine currentSong={currentSong} nextSong={nextSong} previousSong={previousSong}/>
          </div>
        </>)
}

export default App
