import { API_URL } from "./config"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import SongBlock from "./SongBlock"
import ScrollRow from "./ScrollRow"


function ArtistPage({onSongSelect, addSongToQueue, currentIndex, pageContextQueue, isPlaying}){
    const navigate = useNavigate()
    let params = useParams()
    const artistId = params.id
    const [artistData, setArtistData] = useState(null)
    const [artistSongs, setArtistSongs] = useState([])
    const [artistAlbums, setArtistAlbums] = useState([])

    useEffect(() => {
            fetch(`${API_URL}/api/artists/${artistId}`)
            .then(res => res.json())
            .then(data => setArtistData(data))
            fetch(`${API_URL}/api/artists/${artistId}/songs`)
            .then(res => res.json())
            .then(data => setArtistSongs(data))
            fetch(`${API_URL}/api/artists/${artistId}/albums`)
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
            <div
                className="mainContent artistMainContent"
                key={artistData.id}
                style={{"--artist-header": `url("${API_URL}${artistData.header_photo}")`}}
                onScroll={(e) => e.currentTarget.style.setProperty("--scroll-y", e.currentTarget.scrollTop)}
            >
                <div className="artistPageTop">
                    <p className="artistName">{artistData.name}</p>
                    <p className="monthlyListeners">Monthly listeners: {Number(artistData.monthly_listeners).toLocaleString('en-US')}</p>
                </div>
                <b className="popularTag">Popular</b>
                <div className="artistSongs">
                    {artistSongs.map((song,index) => (
                        <SongBlock key={song.id} song={song} songNumber={index + 1} songIndex={index} currentIndex={currentIndex} onSongSelect={(song) => onSongSelect(song, artistSongs, index)} addSongToQueue={addSongToQueue} pageContextQueue={pageContextQueue} songList={artistSongs} isPlaying={isPlaying}/>
                    ))}
                </div>
                <ScrollRow title="Albums">
                    {artistAlbums.map(album => (
                        <div className="artistAlbum" key={album.id} onClick={() => navigate(`/album/${album.id}`)}>
                            <img className="albumCover" src={`${API_URL}${album.cover_url}`}/>
                            <p>{album.title}</p>
                        </div>
                    ))}
                </ScrollRow>
            </div>
            }
        </>
    )
}

export default ArtistPage