import { useEffect, useState } from "react"
import { useParams} from "react-router-dom"
import { IoMusicalNotesOutline } from "react-icons/io5";

import SongBlock from "./SongBlock"

function PlaylistPage({onSongSelect}){
    let params = useParams()
    const playlistId = params.id
    let playlistDuration = 0
    const [playlists, setPlaylists] = useState([])
    const [playlistData, setPlaylistData] = useState([])
    const [playlistSongs, setPlaylistSongs] = useState([])

    playlistSongs.forEach(song => {
        playlistDuration += song.duration
    });

    function durationToText(duration){
        const hours = Math.floor(duration / 3600)
        if (hours > 0){
            const mins = Math.floor((duration % 3600) / 60)
            const secs = Math.floor(duration % 60)
            return(`${hours} h ${mins} min ${secs} s`)
        }
        else{
            const mins = Math.floor(duration / 60)
            const secs = Math.floor(duration % 60)
            return(`${mins} min ${secs} s`)
        }
    }

    useEffect(() => {
        fetch(`http://localhost:3001/api/playlists/${playlistId}`)
        .then(res => res.json())
        .then(data => setPlaylistData(data))
        fetch(`http://localhost:3001/api/playlists/${playlistId}/songs`)
        .then(res => res.json())
        .then(data => setPlaylistSongs(data))
        fetch(`http://localhost:3001/api/playlists`)
        .then(res => res.json())
        .then(data => setPlaylists(data))
    }, [playlistId])

    function removeSongFromPlaylist(e, songId){
        e.stopPropagation()
        fetch(`http://localhost:3001/api/playlists/${playlistId}/songs/${songId}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then(() => {
            setPlaylistSongs(prev => prev.filter(song => song.id !== songId))
        })
    }

    return(
        <>
            <div className="mainContent">
                <div className="albumPageTop">
                    <IoMusicalNotesOutline className="albumCoverInPage"/>
                    <div className="albumInfo">
                        <p className="albumTitle">{playlistData.name}</p>
                        <p>{playlistData.description}</p>
                        <p>{playlistSongs.length} songs, {durationToText(playlistDuration)}</p>
                    </div>
                </div>
                {playlistSongs.map(song => (
                    <SongBlock key={song.id} song={song} onSongSelect={onSongSelect} playlists={playlists} isPlaylistPage={true} removeSongFromPlaylist={removeSongFromPlaylist}/>
                ))}
            </div>
        </>
    )
}

export default PlaylistPage