import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate} from "react-router-dom"
import { IoMusicalNotesOutline } from "react-icons/io5";

import SongBlock from "./SongBlock"

function PlaylistPage({onSongSelect, removePlaylistFromSidebar}){
    let params = useParams()
    const playlistId = params.id
    let navigate = useNavigate()
    let playlistDuration = 0
    const [playlists, setPlaylists] = useState([])
    const [playlistData, setPlaylistData] = useState([])
    const [playlistSongs, setPlaylistSongs] = useState([])
    const [openPlaylistOptions, setOpenPlaylistOptions] = useState(false)
    const playlistRef = useRef(null)

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

    useEffect(() => {
        function handleClickOutside(e){
            if(!playlistRef.current.contains(e.target)){
                setOpenPlaylistOptions(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return(() => {
            document.removeEventListener('click', handleClickOutside)
        })
    }, [])

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

    function deletePlaylist(){
        fetch(`http://localhost:3001/api/playlists/${playlistId}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then(() => removePlaylistFromSidebar(playlistId))
        .then(() => navigate(`/`))
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
                    <div className="playlistOptionsWrapper" ref={playlistRef}>
                        <button className="albumOptions" onClick={() => setOpenPlaylistOptions(true)}>...</button>
                        {openPlaylistOptions === true ? (
                            <div className="playlistOptionsList">
                                <p className="deletePlaylist" onClick={() => deletePlaylist()}>Delete playlist</p>
                                <p className="editPlaylist">Edit playlist details</p>
                            </div>
                        ) :
                        <></>
                        }
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