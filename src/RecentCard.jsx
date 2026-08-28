import { MdMusicNote } from "react-icons/md";
import {useEffect, useState} from "react";


function RecentCard({title, song, onSongSelect, playlistData, addSongToQueue}){

    const [songOptionsWindow, setSongOptionsWindow] = useState(null)
    const [playlistsWindow, setPlaylistsWindow] = useState(null)

    const [songArtist, setSongArtist] = useState(null)

    useEffect(() => {
        if(!song) return

        fetch(`http://localhost:3001/api/artists/${song.artist_id}`)
        .then(res => res.json())
        .then(data => setSongArtist(data))
    }, [song])

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

    function addingSongToQueue(e, songToAdd){
        e.stopPropagation()
        addSongToQueue(songToAdd)
        setSongOptionsWindow(null)
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
        .then(() => {setSongOptionsWindow(null)
        setPlaylistsWindow(null)})
    }

    return(
        <div className="recentCard" onClick={() => onSongSelect(song)}>
            <MdMusicNote className="recentCardImage"/>
            <div className="recentCardText">
                <p>{title}</p>
                {songArtist && (
                    <p className="recentCardArtistName">{songArtist.name}</p>
                )}
            </div>
            <div className="songOptionsWrapper" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="songOptions" onClick={(e) => openSongOptions(e, song.id)}>...</button>
                {songOptionsWindow === song.id ? (
                <>
                    <div className="songOptionsList">
                        <div className="addSongToPlaylistButton" onClick={(e) => openPlaylistOptions(e, song.id)}>
                            <p>Add to playlist</p>
                        </div>
                        <div className="addSongToQueueButton" onClick={(e) => addingSongToQueue(e, song)}>
                            <p>Add song to queue</p>
                        </div>
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
    )
}

export default RecentCard