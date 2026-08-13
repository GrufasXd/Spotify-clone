import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import SongBlock from "./SongBlock"


function ArtistPage({onSongSelect}){
    const navigate = useNavigate()
    let params = useParams()
    const artistId = params.id
    const [artistData, setArtistData] = useState(null)
    const [artistSongs, setArtistSongs] = useState([])
    const [artistAlbums, setArtistAlbums] = useState([])
    const [playlists, setPlaylists] = useState([])

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
            fetch(`http://localhost:3001/api/playlists`)
            .then(res => res.json())
            .then(data => setPlaylists(data))
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
                        <SongBlock key={song.id} song={song} onSongSelect={onSongSelect} playlists={playlists}/>
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