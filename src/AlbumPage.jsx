import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"



function AlbumPage({onSongSelect}){
    let params = useParams()
    const albumId = params.id
    const [albumData, setAlbumData] = useState(null)
    const [albumSongs, setAlbumSongs] = useState([])

    function durationConverter(duration){
        const mins = Math.floor(duration / 60)
        const secs = Math.floor(duration % 60)
        return (`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }

    useEffect(() => {
            fetch(`http://localhost:3001/api/albums/${albumId}`)
            .then(res => res.json())
            .then(data => setAlbumData(data))
            fetch(`http://localhost:3001/api/albums/${albumId}/songs`)
            .then(res => res.json())
            .then(data => setAlbumSongs(data))
    }, [albumId])

    return(
        <>
            {albumData === null ? (
                <div className="mainContent">
                    <p>Loading artist data...</p>
                </div>
            ): 
            <div className="mainContent" key={albumData.id}>
                <p className="albumTitle">{albumData.title}</p>
                {albumSongs.map(song => (
                    <div className="artistSong" key={song.id} onClick={() => onSongSelect(song)}>
                        <p>{song.title}</p>
                        <p className="songDuration">{durationConverter(song.duration)}</p>
                    </div>
                ))}
            </div>
            }
        </>
    )

}

export default AlbumPage