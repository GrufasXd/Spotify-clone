import { API_URL } from "./config"

import { useState, useEffect, useRef } from "react"
import { Routes, Route } from "react-router-dom"

import ArtistPage from "./ArtistPage"
import AlbumPage from "./AlbumPage"
import TopBar from "./TopBar"
import SidebarLeft from "./SidebarLeft"
import MainContent from "./MainContent"
import SidebarRight from "./SidebarRight"
import SongBottomLine from "./SongBottomLine"
import PlaylistPage from "./PlaylistPage"
import LikedSongsPage from "./LikedSongsPage"
import { LikedSongsContext } from "./LikedSongsContext"
import { PlaylistContext } from "./PlaylistContext"
import { PlayerContext } from "./PlayerContext"
import { AuthContext } from "./AuthContext"

// Parsiuncia prisijungusio vartotojo playlistus (su covers)
function fetchPlaylists(){
  return fetch(`${API_URL}/api/playlists`, {
      credentials: "include"
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch playlists");
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Invalid playlists response");
      return data;
    });
}

function App() {
  const [currentSong, setCurrentSong] = useState(null)
  const [playlistData, setPlaylistData] = useState([])
  const [pageContextQueue, setPageContextQueue] = useState([])
  const [userQueue, setUserQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [volume, setVolume] = useState(1)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(260)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(260)
  const [resizeSide, setResizeSide] = useState(null)
  const [isResizing, setIsResizing] = useState(false)
  const [sidebarRightClosed, setSidebarRightClosed] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const [recentSongs, setRecentSongs] = useState([])
  const [likedSongIds, setLikedSongIds] = useState(new Set())

  function handlePlayClick(){
    const audio = audioRef.current

    if(!audio) return

    if(audio.paused){
      audio.play()
    }
    else{
      audio.pause()
    }
  }

  // Jei sarasas neperduotas (pvz. is paieskos), grojama tik ta viena daina
  function handleSongSelect(song, songList = [song], songIndex = 0){
    setCurrentSong(song)
    setPageContextQueue(songList)
    setCurrentIndex(songIndex)
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

  function restartSong(){
    audioRef.current.currentTime = 0
    audioRef.current.play()
  }

  function nextSong(endedItself = false){
    if(repeat === "Once" && endedItself){
      restartSong()
      setRepeat("")
    }
    else if (repeat === "Infinite" && endedItself){
      restartSong()
    }
    else{
      if(userQueue.length != 0){
        setCurrentSong(userQueue[0].song)
        setUserQueue(prev => prev.slice(1))
      }
      else if(shuffle){
        let randomSongNumber
        do{
          randomSongNumber = Math.floor(Math.random() * (pageContextQueue.length))
        } while(
          pageContextQueue.length > 1 && randomSongNumber === currentIndex
        )
        setCurrentSong(pageContextQueue[randomSongNumber])
        setCurrentIndex(randomSongNumber)
      }
      else if(currentIndex !== pageContextQueue.length - 1){
        setCurrentSong(pageContextQueue[currentIndex + 1])
        setCurrentIndex(currentIndex + 1)
      }
      else{
        fetch(`${API_URL}/api/songs/random?exclude=${currentSong.id}`)
          .then(res => res.json())
          .then(randomSong => {
            setPageContextQueue(prev => [...prev, randomSong])
            setCurrentSong(randomSong)
            setCurrentIndex(pageContextQueue.length)
          })
      }
    }
  }

  function previousSong(){
    if(currentIndex > 0){
      setCurrentSong(pageContextQueue[currentIndex-1])
      setCurrentIndex(currentIndex - 1)
    }
  }

 function toggleShuffle(){
    setShuffle(prev => !prev)
  }

  const repeatModes = ["", "Once", "Infinite"]

  function toggleRepeat(){
    const repeatIndex = repeatModes.indexOf(repeat)
    setRepeat(repeatModes[(repeatIndex + 1) % repeatModes.length])
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

  const previousVolume = useRef(1)

  function toggleMute(){
    if(volume != 0){
      previousVolume.current = volume
      setVolume(0)
    }
    else{
      setVolume(previousVolume.current)
    }
  }

  function toggleLike(songId){
    if(!currentUser){
      return
    }
    const isLiked = likedSongIds.has(songId)
    setLikedSongIds(prev => {
      const next = new Set(prev)
      if (isLiked) next.delete(songId)
      else next.add(songId)
      return next
    })
    if(!isLiked){
      fetch(`${API_URL}/api/liked-songs`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        song_id: songId
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
      })
      .catch(console.error);
    }
    else{
      fetch(`${API_URL}/api/liked-songs/${songId}`, {
        credentials: "include",
        method: "DELETE"
      })
      .catch(console.error);
    }
  }

  function handleLogout(){
    setCurrentUser(null)
    setPlaylistData([])
    setRecentSongs([])
    setLikedSongIds(new Set())
  }

  useEffect(() => {
    function resize(e){
      if(!isResizing) return

      if(resizeSide === "left"){
        const newWidth = e.clientX
        if(newWidth >= 180 && newWidth <= 450){
          setLeftSidebarWidth(newWidth)
        }
      }
      else{
        const newWidth = window.innerWidth - e.clientX
        if(newWidth >= 180 && newWidth <= 450){
          setRightSidebarWidth(newWidth)
        }
      }
    }

    function stopResize(){
      setIsResizing(false)
      setResizeSide(null)
    }

    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResize)

    return () => {
        window.removeEventListener("mousemove", resize)
        window.removeEventListener("mouseup", stopResize)
    }
  }, [isResizing, resizeSide])

  useEffect(() => {
    const audio = audioRef.current
    if(audio){
      audio.volume = volume
    }
  }, [volume])
  
  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) return null;
        if (!res.ok) throw new Error("Failed to check the current user");
        return res.json();
      })
      .then(user => {
        if (user) setCurrentUser(user);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    let isCurrentRequest = true;

    fetchPlaylists()
      .then(data => {
        if (isCurrentRequest) setPlaylistData(data);
      })
      .catch(console.error);
    return () => {
      isCurrentRequest = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    fetch(`${API_URL}/api/recently-played`, {
      credentials: "include"
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch recently played songs");
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Invalid recently played song response");
      setRecentSongs(data);
    })
    .catch(console.error);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !currentSong) {
      return;
    }

    fetch(`${API_URL}/api/recently-played`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        song_id: currentSong.id
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(() => setRecentSongs(prev => [currentSong, ...prev.filter(song => song.id !== currentSong.id)].slice(0, 6)))
    .catch(console.error);
  }, [currentSong, currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    fetch(`${API_URL}/api/liked-songs`, {
      credentials: "include"
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch liked songs");
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Invalid liked song response");
      setLikedSongIds(new Set(data.map(song => song.id)))
    })
    .catch(console.error);
  }, [currentUser]);

  // Kvieciama, kai playlisto dainos pasikeicia, kad sidebar coveriai atsinaujintu
  function refreshPlaylists(){
    if (!currentUser) return
    fetchPlaylists()
      .then(data => setPlaylistData(data))
      .catch(console.error);
  }

  return(
  <>
  <AuthContext.Provider value={{currentUser}}>
    <PlayerContext.Provider value={{isPlaying, currentIndex, pageContextQueue, handleSongSelect, addSongToQueue, currentSong}}>
      <PlaylistContext.Provider value={{playlistData, setPlaylistData, refreshPlaylists, removePlaylistFromSidebar, updatePlaylistInSidebar}}>
        <LikedSongsContext.Provider value={{likedSongIds, toggleLike}}>
              <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} handleLogout={handleLogout}/>
              <Routes>
                <Route path="/" element={
                  <div className="contentArea">
                    <SidebarLeft currentUser={currentUser} leftSidebarWidth={leftSidebarWidth}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                    <MainContent handlePlayClick={handlePlayClick} recentSongs={recentSongs} currentUser={currentUser}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                    <SidebarRight userQueue={userQueue} setUserQueue={setUserQueue} queueItemClick={queueItemClick} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
                  </div>
                }/>
                <Route path="/artist/:id" element={
                  <div className="contentArea">
                    <SidebarLeft currentUser={currentUser} leftSidebarWidth={leftSidebarWidth}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                    <ArtistPage/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                    <SidebarRight userQueue={userQueue} setUserQueue={setUserQueue} queueItemClick={queueItemClick} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
                  </div>
                }/>
                <Route path="/album/:id" element={
                  <div className="contentArea">
                    <SidebarLeft currentUser={currentUser} leftSidebarWidth={leftSidebarWidth}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                    <AlbumPage handlePlayClick={handlePlayClick} shuffle={shuffle} toggleShuffle={toggleShuffle}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                    <SidebarRight userQueue={userQueue} setUserQueue={setUserQueue} queueItemClick={queueItemClick} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
                  </div>
                }/>
                <Route path="/playlist/:id" element={
                  <div className="contentArea">
                    <SidebarLeft currentUser={currentUser} leftSidebarWidth={leftSidebarWidth}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                    <PlaylistPage handlePlayClick={handlePlayClick} shuffle={shuffle} toggleShuffle={toggleShuffle}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                    <SidebarRight userQueue={userQueue} setUserQueue={setUserQueue} queueItemClick={queueItemClick} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
                  </div>
                }/>
                <Route path="/liked" element={
                  <div className="contentArea">
                    <SidebarLeft currentUser={currentUser} leftSidebarWidth={leftSidebarWidth}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                    <LikedSongsPage currentUser={currentUser} handlePlayClick={handlePlayClick}/>
                    <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                    <SidebarRight userQueue={userQueue} setUserQueue={setUserQueue} queueItemClick={queueItemClick} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
                  </div>
                }/>
              </Routes>
              <div>
                <SongBottomLine nextSong={nextSong} previousSong={previousSong} setIsPlaying={setIsPlaying} handlePlayClick={handlePlayClick} audioRef={audioRef} shuffle={shuffle} toggleShuffle={toggleShuffle} repeat={repeat} setRepeat={setRepeat} toggleRepeat={toggleRepeat} volume={volume} setVolume={setVolume} toggleMute={toggleMute}/>
              </div>
        </LikedSongsContext.Provider>
      </PlaylistContext.Provider>
    </PlayerContext.Provider>
  </AuthContext.Provider>
  </>)
}

export default App
