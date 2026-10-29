import { API_URL } from "./config"
import { durationToText } from "./utils"

import { useEffect, useRef, useState, useContext } from "react"
import { useParams, useNavigate} from "react-router-dom"

import { IoPauseOutline } from "react-icons/io5";
import { IoShuffle } from "react-icons/io5";
import { CgPlayButton } from "react-icons/cg";

import { Tooltip } from 'react-tooltip'
import SongBlock from "./SongBlock"
import PlaylistCover from "./PlaylistCover";
import { PlaylistContext } from "./PlaylistContext"


function PlaylistPage({currentIndex, onSongSelect, addSongToQueue, currentSong, isPlaying, handlePlayClick, pageContextQueue, shuffle, toggleShuffle}){
    const { refreshPlaylists, removePlaylistFromSidebar, updatePlaylistInSidebar } = useContext(PlaylistContext)
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
    const covers = [...new Set(playlistSongs.map(song => song.cover_url))]

    playlistSongs.forEach(song => {
        playlistDuration += song.duration
    });

    useEffect(() => {
        fetch(`${API_URL}/api/playlists/${playlistId}`, {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch playlist");
                return res.json();
            })
            .then(data => setPlaylistData(data));

        fetch(`${API_URL}/api/playlists/${playlistId}/songs`, {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch playlist songs");
                return res.json();
            })
            .then(data => setPlaylistSongs(data))
            .catch(console.error);
    }, [playlistId]);

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

    function removeSongFromPlaylist(e, playlistSongId){
        e.stopPropagation()
        fetch(`${API_URL}/api/playlists/${playlistId}/songs/${playlistSongId}`, {
            method: "DELETE",
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to remove song");
            setPlaylistSongs(prev => prev.filter(song => song.playlist_song_id !== playlistSongId));
            refreshPlaylists();
        })
        .catch(console.error);
    }

    function deletePlaylist(){
        fetch(`${API_URL}/api/playlists/${playlistId}`, {
            method: "DELETE",
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to delete playlist");
            removePlaylistFromSidebar(playlistId);
            navigate("/");
        })
        .catch(console.error);
    }

    function updatePlaylist(e, playlistTitle, playlistDescription){
        e.preventDefault()

        fetch(`${API_URL}/api/playlists/${playlistId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: playlistTitle,
                description: playlistDescription
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to update playlist");
            return res.json();
        })
        .then(() => {
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


    function handlePlaylistPlay(){
        
        if(pageContextQueue !== playlistSongs || currentSong == null){
            onSongSelect(playlistSongs[0], playlistSongs,0)
        }
        else{
            handlePlayClick()
        }
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
                        <div className="modalButtonRow">
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
                    <div className="modalButtonRow">
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
                    <PlaylistCover covers={covers} className="albumCoverInPage"/>
                    <div className="albumInfo">
                        <p className="albumTitle">{playlistData.name}</p>
                        <p>{playlistData.description}</p>
                        <p>{playlistSongs.length} songs, {durationToText(playlistDuration)}</p>
                    </div>
                    <div className="playlistOptionsWrapper" ref={playlistRef}>
                        <button data-tooltip-id="playlist-tooltip" data-tooltip-content="Playlist options" className="albumOptions" onClick={() => setOpenPlaylistOptions(true)}>...</button>
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
                    <div className="playlistPlayButtonWrapper">
                        <IoShuffle data-tooltip-id="playlist-tooltip" data-tooltip-content={shuffle ? "Disable shuffle" : "Enable shuffle"} className={shuffle ? "shuffleButton active" : "shuffleButton"} onClick={toggleShuffle}/>
                        {isPlaying && pageContextQueue == playlistSongs ? (
                            <IoPauseOutline data-tooltip-id="playlist-tooltip" data-tooltip-content="Pause" className="playlistPlayButton" onClick={() => handlePlaylistPlay()}/>
                        ) : (
                            <CgPlayButton data-tooltip-id="playlist-tooltip" data-tooltip-content="Play" className="playlistPlayButton" onClick={() => handlePlaylistPlay()}/>
                        )}
                    </div>
                </div>
                {playlistSongs.map((song, index) => ( 
                    <SongBlock key={song.playlist_song_id} song={song} songNumber={index + 1} songIndex={index} currentIndex={currentIndex} onSongSelect={(song) => onSongSelect(song, playlistSongs, index)} addSongToQueue={addSongToQueue} isPlaylistPage={true} removeSongFromPlaylist={removeSongFromPlaylist} currentSong={currentSong} pageContextQueue={pageContextQueue} songList={playlistSongs} isPlaying={isPlaying}/>
                ))}
                <Tooltip id="playlist-tooltip" place="top" positionStrategy="fixed"/>
            </div>
        </>
    )
}

export default PlaylistPage