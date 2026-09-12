import { useEffect, useState } from "react"
import { FaPlay } from "react-icons/fa";


function SongBlock({song,songNumber,onSongSelect,playlists,isPlaylistPage,removeSongFromPlaylist, addSongToQueue, currentSong}){
    const [songOptionsWindow, setSongOptionsWindow] = useState(null)
    const [playlistsWindow, setPlaylistsWindow] = useState(null)
    const [showQueueMessage, setShowQueueMessage] = useState(false)
    const [showPlaylistMessage, setShowPlaylistMessage] = useState(false)
    const [artistData, setArtistData] = useState({})

    useEffect(() => {
        function handleClickOutside(){
            setSongOptionsWindow(null)
            setPlaylistsWindow(null)
        }

        document.addEventListener('click', handleClickOutside)

        return(() => {
            document.removeEventListener('click', handleClickOutside)
        })
    }, [])

    useEffect(() => {
        fetch(`http://localhost:3001/api/artists/${song.artist_id}`)
        .then(res => res.json())
        .then(data => setArtistData(data))
    }, [song.artist_id])

    function durationConverter(duration){
        const mins = Math.floor(duration / 60)
        const secs = Math.floor(duration % 60)
        return (`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }

    function openSongOptions(e, songId){
        e.stopPropagation()
        setSongOptionsWindow(songId)
    }

    function openPlaylistOptions(e, songId){
        e.stopPropagation()
        setPlaylistsWindow(songId)
    }

    function addSongToPlaylist(e, playlistId, songId){
        e.preventDefault()
        fetch(`http://localhost:3001/api/playlists/${playlistId}/songs`, {
                method: "POST",
                body: JSON.stringify({
                    song_id: songId
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
        })
        .then(res => res.json())
        .then(async () => {setSongOptionsWindow(null)
        setPlaylistsWindow(null)
        setShowPlaylistMessage(true)
        await wait(2500)
        setShowPlaylistMessage(false)})
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function addingSongToQueue(e, song){
        e.stopPropagation() 
        addSongToQueue(song)
        setSongOptionsWindow(null)
        setShowQueueMessage(true)
        await wait(2500)
        setShowQueueMessage(false)
    }

    return(
        <>
            {showPlaylistMessage && (
                <div className="queueMessage">
                    <p>Added to playlist</p>
                </div>
            )}
            {showQueueMessage &&(
                <div className="queueMessage">
                    <p>Added to queue</p>
                </div>
            )}
            <div className="artistSong" onClick={() => {onSongSelect(song)}}>
                <div className="songNumberWrapper">
                    <p className="songNumber">{songNumber}</p>
                    <FaPlay className="playIcon"/>
                </div> 
                <div className="songBlockTextWrapper">
                    <b className={currentSong?.id === song.id ? "activeSong" : ""}>
                        {song.title}
                    </b>
                    <p>{artistData.name}</p>
                </div>
                <p className="songDuration">{durationConverter(song.duration)}</p>
                <button className="songOptions" onClick={(e) => openSongOptions(e, song.id)}>...</button>
                {songOptionsWindow === song.id ? (
                <>
                    <div className="songOptionsList">
                        <div className="addSongToPlaylistButton" onClick={(e) => openPlaylistOptions(e, song.id)}>
                            <p>Add to playlist</p>
                        </div>
                        <div className="addSongToQueueButton" onClick={(e) => addingSongToQueue(e, song)}>
                            <p>Add song to queue</p>
                        </div>
                        {isPlaylistPage === true ? (
                            <div className="removeSongFromPlaylistButton" onClick={(e) => removeSongFromPlaylist(e, song.id)}>
                                <p>Remove from playlist</p>
                            </div>
                        ):
                        <></>
                        }
                    </div>
                    {playlistsWindow === song.id ? (
                        <div className="playlistsWindow" onClick={(e) => e.stopPropagation()}>
                            <p>Your playlists:</p>
                            {playlists.map(playlist => (
                                <div className="playlistInWindow" key={playlist.id} onClick={(e) => addSongToPlaylist(e, playlist.id, song.id)}>
                                    <p key={playlist.id}>{playlist.name}</p>
                                </div>
                            ))}
                        </div>
                    ):
                    <></>
                    }
                </>
                ) : 
                <></>
                }
            </div>
        </>
    )
}

export default SongBlock