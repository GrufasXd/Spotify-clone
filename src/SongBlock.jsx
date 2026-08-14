import { useEffect, useState } from "react"


function SongBlock({song,onSongSelect,playlists,isPlaylistPage, removeSongFromPlaylist}){
    const [songOptionsWindow, setSongOptionsWindow] = useState(null)
    const [playlistsWindow, setPlaylistsWindow] = useState(null)

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
        .then(() => {setSongOptionsWindow(null)
        setPlaylistsWindow(null)})
    }

    return(
        <>
            <div className="artistSong" onClick={() => onSongSelect(song)}>
                <p>{song.title}</p>
                <p className="songDuration">{durationConverter(song.duration)}</p>
                <button className="songOptions" onClick={(e) => openSongOptions(e, song.id)}>...</button>
                {songOptionsWindow === song.id ? (
                <>
                    <div className="songOptionsList">
                        <div className="addSongToPlaylistButton" onClick={(e) => openPlaylistOptions(e, song.id)}>
                            <p>Add to playlist</p>
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