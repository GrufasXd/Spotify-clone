import RecentCard from "./RecentCard"
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { Tooltip } from 'react-tooltip'
import { CgPlayButton } from "react-icons/cg";
import { IoPauseOutline } from "react-icons/io5";

function MainContent({onSongSelect, playlistData, addSongToQueue, isPlaying, pageContextQueue, currentSong, handlePlayClick}){
    let navigate = useNavigate()
    const [songs, setSongs] = useState([])
    const [mainAlbums, setMainAlbums] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/api/songs')
        .then(res => res.json())
        .then(data => setSongs(data))
        fetch('http://localhost:3001/api/albums')
        .then(res => res.json())
        .then(data => setMainAlbums(data))
    }, [])

    // Albumas aktyvus, jei dabar grojamas sarasas susideda tik is sio albumo dainu
    function isAlbumActive(album){
        return currentSong?.album_id === album.id
            && pageContextQueue.length > 0
            && pageContextQueue.every(song => song.album_id === album.id)
    }

    function handleAlbumPlay(e, album){
        e.stopPropagation()

        if(isAlbumActive(album)){
            handlePlayClick()
            return
        }

        fetch(`http://localhost:3001/api/albums/${album.id}/songs`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch album songs")
            return res.json()
        })
        .then(albumSongs => {
            if (albumSongs.length === 0) return
            onSongSelect(albumSongs[0], albumSongs, 0)
        })
        .catch(console.error)
    }

    return(
        <div className="mainContent">
            <h2 className="greetingText">Good morning!</h2>
            <div className="recentlyViewedCards">
                {songs.map ((song, index) => (
                    <RecentCard
                        key={song.id}
                        title={song.title}
                        song={song}
                        onSongSelect={(song) => onSongSelect(song, songs, index)}
                        playlistData={playlistData}
                        addSongToQueue={addSongToQueue}
                    />
                ))}
            </div>
            <h2>Albums</h2>
            <div className="mainAlbums">
                {mainAlbums.map(album => {
                    const albumIsPlaying = isPlaying && isAlbumActive(album)

                    return(
                        <div className="mainAlbumObject" key={album.id} onClick={() => navigate(`/album/${album.id}`)}>
                            <div className="mainAlbumCoverWrapper">
                                <img className="mainAlbumCover" src={`http://localhost:3001${album.cover_url}`} alt={album.title}/>
                                {albumIsPlaying ? (
                                    <IoPauseOutline data-tooltip-id="mainAlbum-tooltip" data-tooltip-content="Pause" className="mainAlbumPlayButton visible" onClick={(e) => handleAlbumPlay(e, album)}/>
                                ) : (
                                    <CgPlayButton data-tooltip-id="mainAlbum-tooltip" data-tooltip-content="Play" className="mainAlbumPlayButton" onClick={(e) => handleAlbumPlay(e, album)}/>
                                )}
                            </div>
                            <p>{album.title}</p>
                            <p className="mainAlbumArtist">{album.artist_name}</p>
                        </div>
                    )
                })}
            </div>
            <Tooltip id="mainAlbum-tooltip" place="top" positionStrategy="fixed"/>
        </div>
    )
}

export default MainContent