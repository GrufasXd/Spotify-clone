import { useEffect, useState } from "react"
import { useParams} from "react-router-dom"
import { IoMusicalNotesOutline } from "react-icons/io5";

function PlaylistPage({onSongSelect}){
    let params = useParams()
    const playlistId = params.id
    let playlistDuration = 0

    const [playlistData, setPlaylistData] = useState([])
    const [playlistSongs, setPlaylistSongs] = useState([])

    playlistSongs.forEach(song => {
        playlistDuration += song.duration
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
        fetch(`http://localhost:3001/api/playlists/${playlistId}`)
        .then(res => res.json())
        .then(data => setPlaylistData(data))
        fetch(`http://localhost:3001/api/playlists/${playlistId}/songs`)
        .then(res => res.json())
        .then(data => setPlaylistSongs(data))
    })

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
                    <div className="artistSong" key={song.id} onClick={() => onSongSelect(song)}>
                        <p>{song.title}</p>
                        <p className="songDuration">{durationConverter(song.duration)}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default PlaylistPage