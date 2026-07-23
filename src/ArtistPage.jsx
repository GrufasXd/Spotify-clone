import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"


function ArtistPage({onSongSelect}){
    const navigate = useNavigate()
    let params = useParams()
    const artistId = params.id
    const [artistData, setArtistData] = useState(null)
    const [artistSongs, setArtistSongs] = useState([])
    const [artistAlbums, setArtistAlbums] = useState([])

    function durationConverter(duration){
        const mins = Math.floor(duration / 60)
        const secs = Math.floor(duration % 60)
        return (`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }
    useEffect(() => {
            fetch(`http://localhost:3001/api/artists/${artistId}`)
            .then(res => res.json())
            .then(data => setArtistData(data))
            fetch(`http://localhost:3001/api/artists/${artistId}/songs`)
            .then(res => res.json())
            .then(data => setArtistSongs(data))
            fetch(`http://localhost:3001/api/artists/${artistId}/albums`)
            .then(res => res.json())
            .then(data => setArtistAlbums(data))
    }, [artistId])
    
    return(
        <>
            {artistData === null ? (
                <div className="mainContent">
                    <p>Loading artist data...</p>
                </div>
            ) : 
            <div className="mainContent" key={artistData.id}>
                <p className="artistName">{artistData.name}</p>
                <p className="monthlyListeners">Monthly listeners: {Number(artistData.monthly_listeners).toLocaleString('en-US')}</p>
                <b className="popularTag">Popular</b>
                <div className="artistSongs">
                    {artistSongs.map(song => (
                        <div className="artistSong" key={song.id} onClick={() => onSongSelect(song)}>
                            <p>{song.title}</p>
                            <p className="songDuration">{durationConverter(song.duration)}</p>
                        </div>
                    ))}
                </div>
                <b className="albumTag">Albums</b>
                <div className="artistAlbums">
                    {artistAlbums.map(album => (
                        <div className="artistAlbum" key={album.id} onClick={() => navigate(`/album/${album.id}`)}>
                            <img className="albumCover" src={`http://localhost:3001${album.cover_url}`}/>
                            <p>{album.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            }
        </>
    )
}

export default ArtistPage