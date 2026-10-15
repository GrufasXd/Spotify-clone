import { useState, useEffect, useRef } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"

import ArtistPage from "./ArtistPage"
import AlbumPage from "./AlbumPage"
import TopBar from "./TopBar"
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

  function handleSongSelect(song, songList, songIndex){
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
        fetch(`http://localhost:3001/api/songs/random?exclude=${currentSong.id}`)
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
    fetch("http://localhost:3001/api/auth/me", {
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
      setPlaylistData([]);
      return;
    }

    let isCurrentRequest = true;
    setPlaylistData([]);

    fetch(`http://localhost:3001/api/playlists`, {
        credentials: "include"
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch playlists");
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid playlists response");
        if (isCurrentRequest) setPlaylistData(data);
      })
      .catch(console.error);
    return () => {
      isCurrentRequest = false;
    };
  }, [currentUser]);

  return(<>
          <TopBar handleSongSelect={handleSongSelect} currentUser={currentUser} setCurrentUser={setCurrentUser} setPlaylistData={setPlaylistData}/>
          <Routes>
            <Route path="/" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData} leftSidebarWidth={leftSidebarWidth}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                <MainContent onSongSelect={handleSongSelect} playlistData={playlistData} addSongToQueue={addSongToQueue} isPlaying={isPlaying} pageContextQueue={pageContextQueue} currentSong={currentSong} handlePlayClick={handlePlayClick}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
              </div>
            }/>
            <Route path="/artist/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData} leftSidebarWidth={leftSidebarWidth}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                <ArtistPage onSongSelect={handleSongSelect} addSongToQueue={addSongToQueue} currentIndex={currentIndex} pageContextQueue={pageContextQueue} playlists={playlistData}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
              </div>
            }/>
            <Route path="/album/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData} leftSidebarWidth={leftSidebarWidth}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                <AlbumPage currentIndex={currentIndex} onSongSelect={handleSongSelect} addSongToQueue={addSongToQueue} currentSong={currentSong} isPlaying={isPlaying} handlePlayClick={handlePlayClick} pageContextQueue={pageContextQueue} playlists={playlistData}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
              </div>
            }/>
            <Route path="/playlist/:id" element={
              <div className="contentArea">
                <SidebarLeft playlistData={playlistData} setPlaylistData={setPlaylistData} leftSidebarWidth={leftSidebarWidth}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("left"); setIsResizing(true)}}></div>
                <PlaylistPage currentIndex={currentIndex} onSongSelect={handleSongSelect} removePlaylistFromSidebar={removePlaylistFromSidebar} updatePlaylistInSidebar={updatePlaylistInSidebar} addSongToQueue={addSongToQueue} playlists={playlistData} currentSong={currentSong} isPlaying={isPlaying} handlePlayClick={handlePlayClick} pageContextQueue={pageContextQueue}/>
                <div className="resizeHandle" onMouseDown={() => {setResizeSide("right"); setIsResizing(true)}}></div>
                <SidebarRight currentSong={currentSong} userQueue={userQueue} setUserQueue={setUserQueue} onSongSelect={handleSongSelect} queueItemClick={queueItemClick} playlistData={playlistData} addSongToQueue={addSongToQueue} clearQueue={clearQueue} rightSidebarWidth={rightSidebarWidth} sidebarRightClosed={sidebarRightClosed} setSidebarRightClosed={setSidebarRightClosed}/>
              </div>
            }/>
          </Routes>
          <div>
            <SongBottomLine currentSong={currentSong} nextSong={nextSong} previousSong={previousSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} handlePlayClick={handlePlayClick} audioRef={audioRef} currentIndex={currentIndex} shuffle={shuffle} toggleShuffle={toggleShuffle} repeat={repeat} setRepeat={setRepeat} toggleRepeat={toggleRepeat} volume={volume} setVolume={setVolume} toggleMute={toggleMute}/>
          </div>
        </>)
}

export default App
