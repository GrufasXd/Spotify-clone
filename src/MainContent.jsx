import { API_URL } from "./config"

import { useState, useEffect, useContext} from "react"
import { useNavigate } from "react-router-dom"

import { CgPlayButton } from "react-icons/cg";
import { IoPauseOutline } from "react-icons/io5";

import { Tooltip } from 'react-tooltip'
import RecentCard from "./RecentCard"
import ScrollRow from "./ScrollRow"
import { PlayerContext } from "./PlayerContext";


function MainContent({handlePlayClick, recentSongs, currentUser}){
    let navigate = useNavigate()
    const { isPlaying, currentSong, pageContextQueue, handleSongSelect } = useContext(PlayerContext)
    const [songs, setSongs] = useState([])
    const [mainAlbums, setMainAlbums] = useState([])
    const [mainArtists, setMainArtists] = useState([])
    const cardsToShow = recentSongs.length > 0 ? recentSongs : songs.slice(0, 6)
    const currentTime = new Date().getHours()
    const greetingText = currentTime < 12 ? "Good morning" : currentTime < 19 ? "Good afternoon" : "Good evening"

    useEffect(() => {
        fetch(`${API_URL}/api/songs`)
        .then(res => res.json())
        .then(data => setSongs(data))
        fetch(`${API_URL}/api/albums`)
        .then(res => res.json())
        .then(data => setMainAlbums(data))
        fetch(`${API_URL}/api/artists`)
        .then(res => res.json())
        .then(data => setMainArtists(data))
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

        fetch(`${API_URL}/api/albums/${album.id}/songs`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch album songs")
            return res.json()
        })
        .then(albumSongs => {
            if (albumSongs.length === 0) return
            handleSongSelect(albumSongs[0], albumSongs, 0)
        })
        .catch(console.error)
    }

    return(
        <div className="mainContent">
            <h2 className="greetingText">{greetingText} {currentUser?.username}</h2>
            <div className="recentlyViewedCards">
                {cardsToShow.map ((song, index) => (
                    <RecentCard
                        key={song.id}
                        title={song.title}
                        song={song}
                        onSongSelect={(song) => handleSongSelect(song, cardsToShow, index)}
                    />
                ))}
            </div>
            <ScrollRow title="Albums">
                {mainAlbums.map(album => {
                    const albumIsPlaying = isPlaying && isAlbumActive(album)

                    return(
                        <div className="mainAlbumObject" key={album.id} onClick={() => navigate(`/album/${album.id}`)}>
                            <div className="mainAlbumCoverWrapper">
                                <img className="mainAlbumCover" src={`${API_URL}${album.cover_url}`} alt={album.title}/>
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
            </ScrollRow>
            <ScrollRow title="Artists">
                {mainArtists.map(artist => (
                    <div className="mainArtist" key={artist.id} onClick={() => navigate(`/artist/${artist.id}`)}>
                        <img className="mainArtistCover" src={`${API_URL}${artist.header_photo}`} alt={artist.name}/>
                        <p>{artist.name}</p>
                    </div>
                ))}
            </ScrollRow>
            <Tooltip id="mainAlbum-tooltip" place="top" positionStrategy="fixed"/>
        </div>
    )
}

export default MainContent