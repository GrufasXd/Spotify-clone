import { API_URL } from "./config"
import { formatTime } from "./utils"

import { useEffect, useId, useState, useContext } from "react"

import { FaPlay } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import { Tooltip } from 'react-tooltip'
import { LikedSongsContext } from "./LikedSongsContext"
import { PlaylistContext } from "./PlaylistContext"
import { PlayerContext } from "./PlayerContext"
import { AuthContext } from "./AuthContext";


function SongBlock({song, songNumber, songIndex, onSongSelect, isPlaylistPage, removeSongFromPlaylist, songList, hideCover}){
    const { likedSongIds, toggleLike } = useContext(LikedSongsContext)
    const { playlistData, refreshPlaylists } = useContext(PlaylistContext)
    const { isPlaying, currentIndex, pageContextQueue, addSongToQueue, currentSong } = useContext(PlayerContext)
    const { currentUser } = useContext(AuthContext)
    const songTooltipId = useId()
    const [songOptionsWindow, setSongOptionsWindow] = useState(null)
    const [playlistsWindow, setPlaylistsWindow] = useState(null)
    const [showQueueMessage, setShowQueueMessage] = useState(false)
    const [showPlaylistMessage, setShowPlaylistMessage] = useState(false)
    const isLiked = likedSongIds.has(song.id)
    const isActive = song.playlist_song_id ? 
    currentSong?.playlist_song_id === song.playlist_song_id:
    songIndex === currentIndex && pageContextQueue === songList

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
        fetch(`${API_URL}/api/playlists/${playlistId}/songs`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    song_id: songId
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add song to playlist")
            return res.json()
        })
        .then(async () => {refreshPlaylists()
        setSongOptionsWindow(null)
        setPlaylistsWindow(null)
        setShowPlaylistMessage(true)
        await wait(2500)
        setShowPlaylistMessage(false)})
        .catch(error => {
            console.error(error)
        })
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
                    {isActive ? (
                        <div className={`equalizer ${isPlaying ? "" : "paused"}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    ) : (
                        <p className="songNumber">{songNumber}</p>
                    )}
                    <FaPlay className="playIcon"/>
                </div>
                {!hideCover && song.cover_url && (
                    <img className="songBlockCover" src={`${API_URL}${song.cover_url}`} alt={song.album_title}/>
                )}
                <div className="songBlockTextWrapper">
                    <b className={isActive ? "activeSong" : ""}>
                        {song.title}
                    </b>
                    <p>{song.artist_name}</p>
                </div>
                {currentUser != null ? (
                    isLiked === true ? (
                        <FaHeart className="likeButton liked" onClick={(e) => {e.stopPropagation(); toggleLike(song.id)}}/>
                    ) : (
                        <FaRegHeart className="likeButton" onClick={(e) => {e.stopPropagation(); toggleLike(song.id)}}/>
                    )
                ) : (
                    <FaHeart className="likeButton hidden"/>
                )}
                <p className="songDuration">{formatTime(song.duration)}</p>
                <button data-tooltip-id={songTooltipId} data-tooltip-content="Song options" className="songOptions" onClick={(e) => openSongOptions(e, song.id)}>...</button>
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
                            <div className="removeSongFromPlaylistButton" onClick={(e) => removeSongFromPlaylist(e, song.playlist_song_id)}>
                                <p>Remove from playlist</p>
                            </div>
                        ):
                        <></>
                        }
                    </div>
                    {playlistsWindow === song.id ? (
                        <div className="playlistsWindow" onClick={(e) => e.stopPropagation()}>
                            <p>Your playlists:</p>
                            {playlistData.map(playlist => (
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
            <Tooltip id={songTooltipId} place="top" positionStrategy="fixed" middlewares={[]} className="tooltips"/>
        </>
    )
}

export default SongBlock