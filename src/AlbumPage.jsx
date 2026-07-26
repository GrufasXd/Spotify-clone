import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"



function AlbumPage({onSongSelect}){
    let params = useParams()
    const albumId = params.id
    const [albumData, setAlbumData] = useState(null)
    const [albumSongs, setAlbumSongs] = useState([])
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
    }, [albumId])

    return(
        <>
            {albumData === null ? (
                <div className="mainContent">
                    <p>Loading album data...</p>
                </div>
            ): 
            <div className="mainContent" key={albumData.id}>
                <div className="albumPageTop">
                    <img className="albumCoverInPage" src={`http://localhost:3001${albumData.cover_url}`}/>
                    <div className="albumInfo">
                        <p className="albumTitle">{albumData.title}</p>
                        <p>{albumData.artist_name}</p>
                        <p>{albumSongs.length} songs, {durationToText(albumDuration)}</p>
                    </div>
                </div>
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