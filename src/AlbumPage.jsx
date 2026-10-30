import { API_URL } from "./config"
import { durationToText } from "./utils"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { CgPlayButton } from "react-icons/cg";
import { IoPauseOutline } from "react-icons/io5";
import { IoShuffle } from "react-icons/io5";

import { Tooltip } from 'react-tooltip'
import SongBlock from "./SongBlock"
import { PlayerContext } from "./PlayerContext";


function AlbumPage({handlePlayClick, shuffle, toggleShuffle}){
    const { isPlaying, currentSong, pageContextQueue, handleSongSelect } = useContext(PlayerContext)
    const navigate = useNavigate()
    let params = useParams()
    const albumId = params.id
    const [albumData, setAlbumData] = useState(null)
    const [albumSongs, setAlbumSongs] = useState([])
    let albumDuration = 0

    albumSongs.forEach(song => {
        albumDuration += song.duration
    });

    useEffect(() => {
            fetch(`${API_URL}/api/albums/${albumId}`)
            .then(res => res.json())
            .then(data => setAlbumData(data))
            fetch(`${API_URL}/api/albums/${albumId}/songs`)
            .then(res => res.json())
            .then(data => setAlbumSongs(data))
    }, [albumId])

    function handleAlbumPlay(){
        
        if(pageContextQueue !== albumSongs || currentSong == null){
            handleSongSelect(albumSongs[0], albumSongs, 0)
        }
        else{
            handlePlayClick()
        }
    }

    return(
        <>
            {albumData === null ? (
                <div className="mainContent">
                    <div className="scrollContainer">
                        <p>Loading album data...</p>
                    </div>
                </div>
            ): 
            <div className="mainContent" key={albumData.id}>
                <div className="albumPageTop">
                    <img className="albumCoverInPage" src={`${API_URL}${albumData.cover_url}`}/>
                    <div className="albumInfo">
                        <p className="albumTitle">{albumData.title}</p>
                        <p className="albumArtistName" onClick={() => navigate(`/artist/${albumData.artist_id}`)}>{albumData.artist_name}</p>
                        <p>{albumSongs.length} songs, {durationToText(albumDuration)}</p>
                    </div>
                    <div className="playlistPlayButtonWrapper">
                        <IoShuffle data-tooltip-id="playlist-tooltip" data-tooltip-content={shuffle ? "Disable shuffle" : "Enable shuffle"} className={shuffle ? "shuffleButton active" : "shuffleButton"} onClick={toggleShuffle}/>
                        {isPlaying && pageContextQueue == albumSongs ? (
                            <IoPauseOutline data-tooltip-id="playlist-tooltip" data-tooltip-content="Pause" className="playlistPlayButton" onClick={() => handleAlbumPlay()}/>
                        ) : (
                            <CgPlayButton data-tooltip-id="playlist-tooltip" data-tooltip-content="Play" className="playlistPlayButton" onClick={() => handleAlbumPlay()}/>
                        )}
                        <Tooltip id="playlist-tooltip" place="top" positionStrategy="fixed"/>
                    </div>
                </div>
                {albumSongs.map((song,index) => (
                    <SongBlock key={song.id} song={song} songNumber={index + 1} songIndex={index} onSongSelect={(song) => handleSongSelect(song, albumSongs, index)} songList={albumSongs} hideCover={true}/>
                ))}
            </div>
            }
        </>
    )

}

export default AlbumPage