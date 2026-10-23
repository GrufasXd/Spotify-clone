import { useEffect, useState } from "react"
import { IoPauseOutline } from "react-icons/io5";

import SongBlock from "./SongBlock"
import { CgPlayButton } from "react-icons/cg";
import { Tooltip } from 'react-tooltip'
import { FaHeart } from "react-icons/fa";
import { API_URL } from "./config"

function LikedSongsPage({currentUser, currentIndex, onSongSelect, addSongToQueue, playlists, refreshPlaylists, currentSong, isPlaying, handlePlayClick, pageContextQueue, toggleLike, likedSongIds}){
    let playlistDuration = 0
    const [likedSongs, setLikedSongs] = useState([])

    likedSongs.forEach(song => {
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
        if(!currentUser) return 
        fetch(`${API_URL}/api/liked-songs`, {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch liked songs");
                return res.json();
            })
            .then(data => setLikedSongs(data))
            .catch(console.error);
    }, [likedSongIds, currentUser]);

    function handlePlaylistPlay(){
        if (likedSongs.length === 0) return
        if(pageContextQueue !== likedSongs || currentSong == null){
            onSongSelect(likedSongs[0], likedSongs,0)
        }
        else{
            handlePlayClick()
        }
    }

    if(!currentUser){
        return (
            <div className="mainContent">
                <p>Log in to see your liked songs</p>
            </div>
        )
    }
    return(
        <>
            <div className="mainContent">
                <div className="albumPageTop">
                    <div className="albumCoverInPage likedSongsCover">
                        <FaHeart/>
                    </div>
                    <div className="albumInfo">
                        <p className="albumTitle">Liked Songs</p>
                        <p>Your liked songs</p>
                        <p>{likedSongs.length} songs, {durationToText(playlistDuration)}</p>
                    </div>
                    <div className="playlistPlayButtonWrapper">
                        {isPlaying && pageContextQueue == likedSongs ? (
                            <IoPauseOutline data-tooltip-id="playlist-tooltip" data-tooltip-content="Pause" className="playlistPlayButton" onClick={() => handlePlaylistPlay()}/>
                        ) : (
                            <CgPlayButton data-tooltip-id="playlist-tooltip" data-tooltip-content="Play" className="playlistPlayButton" onClick={() => handlePlaylistPlay()}/>
                        )}
                    </div>
                </div>
                {likedSongs.map((song, index) => ( 
                    <SongBlock key={song.id} song={song} songNumber={index + 1} songIndex={index} currentIndex={currentIndex} onSongSelect={(song) => onSongSelect(song, likedSongs, index)} addSongToQueue={addSongToQueue} playlists={playlists} refreshPlaylists={refreshPlaylists} currentSong={currentSong} pageContextQueue={pageContextQueue} songList={likedSongs} isPlaying={isPlaying} toggleLike={toggleLike} likedSongIds={likedSongIds}/>
                ))}
                <Tooltip id="playlist-tooltip" place="top" positionStrategy="fixed"/>
            </div>
        </>
    )
}

export default LikedSongsPage