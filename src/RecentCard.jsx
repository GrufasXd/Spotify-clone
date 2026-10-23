import { MdMusicNote } from "react-icons/md";
import {useEffect, useState, useId} from "react";
import { Tooltip } from 'react-tooltip'
import { API_URL } from "./config"

function RecentCard({title, song, queueItem, onSongSelect, queueItemClick, playlistData, addSongToQueue, isSidebar, setUserQueue, refreshPlaylists}){
    const songTooltipId = useId()
    const [songOptionsWindow, setSongOptionsWindow] = useState(null)
    const [playlistsWindow, setPlaylistsWindow] = useState(null)
    const [showQueueMessage, setShowQueueMessage] = useState(false)
    const [showPlaylistMessage, setShowPlaylistMessage] = useState(false)

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

    function removingSongFromQueue(e, queueItemId){
        e.stopPropagation()
        setUserQueue(prev => prev.filter(queueItem => queueItem.queueItemId !== queueItemId))
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

    function recentCardClick(){
        if (isSidebar == true){
            queueItemClick(queueItem)
        }
        else{
            onSongSelect(song)
        }
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
        <div className="recentCard" onClick={() => recentCardClick()}>
            {song.cover_url ? (
                <img className="recentCardCover" src={`${API_URL}${song.cover_url}`} alt={song.album_title}/>
            ) : (
                <MdMusicNote className="recentCardImage"/>
            )}
            <div className="recentCardText">
                <p>{title}</p>
                <p className="recentCardArtistName">{song.artist_name}</p>
            </div>
            <div className="songOptionsWrapper" onClick={(e) => e.stopPropagation()}>
                <button data-tooltip-id={songTooltipId} data-tooltip-content="Song options" type="button" className="songOptions" onClick={(e) => openSongOptions(e, song.id)}>...</button>
                {songOptionsWindow === song.id ? (
                <>
                    <div className="songOptionsList">
                        <div className="addSongToPlaylistButton" onClick={(e) => openPlaylistOptions(e, song.id)}>
                            <p>Add to playlist</p>
                        </div>
                        <div className="addSongToQueueButton" onClick={(e) => addingSongToQueue(e, song)}>
                            <p>Add song to queue</p>
                        </div>
                        {isSidebar && (
                           <div className="removeSongFromQueueButton" onClick={(e) => removingSongFromQueue(e, queueItem.queueItemId)}>
                                <p>Remove song from queue</p>
                            </div> 
                        )}
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
        </div>
        <Tooltip id={songTooltipId} place="top" positionStrategy="fixed" middlewares={[]} className="tooltips"/>
        </>
    )
}

export default RecentCard