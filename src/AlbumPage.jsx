import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import SongBlock from "./SongBlock"
import { CgPlayButton } from "react-icons/cg";
import { IoPauseOutline } from "react-icons/io5";


function AlbumPage({currentIndex, onSongSelect, addSongToQueue, currentSong,isPlaying,handlePlayClick,pageContextQueue}){
    const navigate = useNavigate()
    let params = useParams()
    const albumId = params.id
    const [albumData, setAlbumData] = useState(null)
    const [albumSongs, setAlbumSongs] = useState([])
    const [playlists, setPlaylists] = useState([])
    let albumDuration = 0

    albumSongs.forEach(song => {
        albumDuration += song.duration
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
            fetch(`http://localhost:3001/api/albums/${albumId}`)
            .then(res => res.json())
            .then(data => setAlbumData(data))
            fetch(`http://localhost:3001/api/albums/${albumId}/songs`)
            .then(res => res.json())
            .then(data => setAlbumSongs(data))
            fetch(`http://localhost:3001/api/playlists`)
            .then(res => res.json())
            .then(data => setPlaylists(data))
    }, [albumId])

    function handleAlbumPlay(){
        
        if(pageContextQueue !== albumSongs || currentSong == null){
            onSongSelect(albumSongs[0], albumSongs)
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
                    <img className="albumCoverInPage" src={`http://localhost:3001${albumData.cover_url}`}/>
                    <div className="albumInfo">
                        <p className="albumTitle">{albumData.title}</p>
                        <p className="albumArtistName" onClick={() => navigate(`/artist/${albumData.artist_id}`)}>{albumData.artist_name}</p>
                        <p>{albumSongs.length} songs, {durationToText(albumDuration)}</p>
                    </div>
                    <div className="playlistPlayButtonWrapper">
                        {isPlaying && pageContextQueue == albumSongs ? (
                            <IoPauseOutline className="playlistPlayButton" onClick={() => handleAlbumPlay()}/>
                        ) : (
                            <CgPlayButton className="playlistPlayButton" onClick={() => handleAlbumPlay()}/>
                        )}
                    </div>
                </div>
                {albumSongs.map((song,index) => (
                    <SongBlock key={song.id} song={song} songNumber={index + 1} songIndex={index} currentIndex={currentIndex} onSongSelect={(song) => onSongSelect(song, albumSongs, index)} addSongToQueue={addSongToQueue} playlists={playlists}/>
                ))}
            </div>
            }
        </>
    )

}

export default AlbumPage