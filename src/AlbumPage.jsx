import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"



function AlbumPage({onSongSelect}){
    const navigate = useNavigate()
    let params = useParams()
    const albumId = params.id
    const [albumData, setAlbumData] = useState(null)
    const [albumSongs, setAlbumSongs] = useState([])
    const [songOptionsWindow, setSongOptionsWindow] = useState(null)
    const [playlistsWindow, setPlaylistsWindow] = useState(null)
    const [playlists, setPlaylists] = useState([])
    let albumDuration = 0

    albumSongs.forEach(song => {
        albumDuration += song.duration
    });

    function durationConverter(duration){
        const mins = Math.floor(duration / 60)
        const secs = Math.floor(duration % 60)
        return (`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }

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
        .then(setSongOptionsWindow(null),
        setPlaylistsWindow(null))
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
                <div className="scrollContainer">
                    <div className="albumPageTop">
                        <img className="albumCoverInPage" src={`http://localhost:3001${albumData.cover_url}`}/>
                        <div className="albumInfo">
                            <p className="albumTitle">{albumData.title}</p>
                            <p className="albumArtistName" onClick={() => navigate(`/artist/${albumData.artist_id}`)}>{albumData.artist_name}</p>
                            <p>{albumSongs.length} songs, {durationToText(albumDuration)}</p>
                        </div>
                    </div>
                    {albumSongs.map(song => (
                        <div className="artistSong" key={song.id} onClick={() => onSongSelect(song)}>
                            <p>{song.title}</p>
                            <p className="songDuration">{durationConverter(song.duration)}</p>
                            <button className="songOptions" onClick={(e) => openSongOptions(e, song.id)}>...</button>
                            {songOptionsWindow === song.id ? (
                            <>
                                <div className="songOptionsList">
                                    <p className="addSongToPlaylistButton" onClick={(e) => openPlaylistOptions(e, song.id)}>Add to playlist</p>
                                </div>
                                {playlistsWindow === song.id ? (
                                    <div className="playlistsWindow">
                                        {playlists.map(playlist => (
                                            <p key={playlist.id} onClick={(e) => addSongToPlaylist(e, playlist.id, song.id)}>{playlist.name}</p>
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
                    ))}
                </div>
            </div>
            }
        </>
    )

}

export default AlbumPage