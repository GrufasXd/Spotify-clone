import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate} from "react-router-dom"
import { IoMusicalNotesOutline } from "react-icons/io5";

import SongBlock from "./SongBlock"

function PlaylistPage({onSongSelect, removePlaylistFromSidebar, updatePlaylistInSidebar, addSongToQueue, playlists, setPlaylists}){
    let params = useParams()
    const playlistId = params.id
    let navigate = useNavigate()
    let playlistDuration = 0
    const [playlistData, setPlaylistData] = useState({})
    const [playlistSongs, setPlaylistSongs] = useState([])
    const [openPlaylistOptions, setOpenPlaylistOptions] = useState(false)
    const [playlistEditWindow, setPlaylistEditWindow] = useState(false)
    const [playlistDeletionConfirmation, setPlaylistDeletionConfirmation] = useState(false)
    const playlistRef = useRef(null)
    const playlistDeletionRef = useRef(null)
    const playlistEditRef = useRef(null)
    const [playlistTitle, setPlaylistTitle] = useState("")
    const [playlistDescription, setPlaylistDescription] = useState("")

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
    }, [playlistId])

    useEffect(() => {
        function handleClickOutside(e){
            if(!playlistRef.current.contains(e.target)){
                setOpenPlaylistOptions(false)
            }
            if(playlistDeletionRef.current && !playlistDeletionRef.current.contains(e.target)){
                setPlaylistDeletionConfirmation(false)
            }
            if(playlistEditRef.current && !playlistEditRef.current.contains(e.target)){
                setPlaylistEditWindow(false)
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
        .then(() => removePlaylistFromSidebar(playlistId))
        .then(() => navigate(`/`))
    }

    function updatePlaylist(e, playlistTitle, playlistDescription){
        e.preventDefault()

        fetch(`http://localhost:3001/api/playlists/${playlistId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: playlistTitle,
                description: playlistDescription
            })
        })
        .then(res => res.json())
        .then(data => {
            const updatedPlaylist = {
                ...playlistData,
                name: playlistTitle,
                description: playlistDescription
            }
            setPlaylistData(updatedPlaylist)
            updatePlaylistInSidebar(updatedPlaylist)
            setPlaylistEditWindow(false)
        })
    }

    return(
        <>
            {playlistEditWindow == false ? (
                <></>
            ):
            <div className="overlay">
                <div className="playlistCreationWindow" ref={playlistEditRef}>
                    <p className="playlistCreationTitle">Edit your playlist</p>
                    <form onSubmit={(e) => updatePlaylist(e, playlistTitle, playlistDescription)}>
                        <label htmlFor="playlistTitle">Playlist title:</label><br/><br/>
                        <input className="playlistInput" type="text" name="playlistTitle" value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value)}/><br/><br/>
                        <label htmlFor="playlistDescriptionInput">Playlist description:</label><br/><br/>
                        <textarea className="playlistDescriptionInput" name="playlistDescriptionInput" value={playlistDescription} onChange={(e) => setPlaylistDescription(e.target.value)} cols={"15"} rows={"5"}/><br/><br/>
                        <div className="playlistButtonRow">
                            <button type="button" onClick={() => {
                                setPlaylistEditWindow(false);
                            }} className="cancelButton">Cancel</button>
                            <button type="submit" className="createButton">Update playlist</button>
                        </div>
                    </form>
                </div>
            </div>
            }
            {playlistDeletionConfirmation && (
                <div className="overlay">
                <div className="playlistDeletionWindow" ref={playlistDeletionRef}>
                    <p className="playlistCreationTitle">Are you sure you want to delete this playlist?</p>
                    <div className="playlistButtonRow">
                        <button type="button" onClick={() => {
                            setPlaylistDeletionConfirmation(false);
                        }} className="cancelButton">Cancel</button>
                        <button type="submit" className="createButton" onClick={() => deletePlaylist()}>Delete playlist</button>
                    </div>
                </div>
            </div>
            )}
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
                                <p className="deletePlaylist" onClick={(e) => {e.stopPropagation();setPlaylistDeletionConfirmation(true); setOpenPlaylistOptions(false);}}>Delete playlist</p>
                                <p className="editPlaylist" onClick={(e) => {e.stopPropagation(); 
                                    setPlaylistEditWindow(true);
                                    setOpenPlaylistOptions(false);
                                    setPlaylistTitle(playlistData.name);
                                    setPlaylistDescription(playlistData.description);
                                    }}>Edit playlist details</p>
                            </div>
                        ) :
                        <></>
                        }
                    </div>
                </div>
                {playlistSongs.map(song => (
                    <SongBlock key={song.id} song={song} onSongSelect={(song) => onSongSelect(song, playlistSongs)} addSongToQueue={addSongToQueue} playlists={playlists} isPlaylistPage={true} removeSongFromPlaylist={removeSongFromPlaylist}/>
                ))}
            </div>
        </>
    )
}

export default PlaylistPage