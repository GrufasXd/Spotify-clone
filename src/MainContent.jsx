import RecentCard from "./RecentCard"
import { useState, useEffect, useRef} from "react"
import { useNavigate } from "react-router-dom"
import { Tooltip } from 'react-tooltip'
import { CgPlayButton } from "react-icons/cg";
import { IoPauseOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";

function MainContent({onSongSelect, playlistData, addSongToQueue, isPlaying, pageContextQueue, currentSong, handlePlayClick}){
    let navigate = useNavigate()
    const [songs, setSongs] = useState([])
    const [mainAlbums, setMainAlbums] = useState([])
    const mainAlbumsRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)


    useEffect(() => {
        fetch('http://localhost:3001/api/songs')
        .then(res => res.json())
        .then(data => setSongs(data))
        fetch('http://localhost:3001/api/albums')
        .then(res => res.json())
        .then(data => setMainAlbums(data))
    }, [])

    useEffect(() => {
        updateArrows()
    }, [mainAlbums])

    useEffect(() => {
        const observer = new ResizeObserver(() => updateArrows())
        observer.observe(mainAlbumsRef.current)
        return () => observer.disconnect()
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

    function scrollAlbums(direction){
        const list = mainAlbumsRef.current
        if(!list) return

        const distance = list.clientWidth * 0.8
        const left = direction === "right" ? distance : -distance
        list.scrollBy({
            left: left,
            behavior: "smooth"
        })
    }

    function updateArrows(){
        const list = mainAlbumsRef.current
        if(!list) return

        setCanScrollLeft(list.scrollLeft > 0)
        setCanScrollRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1)
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
            <div className="mainAlbumsWrapper">
                {canScrollLeft && (
                    <MdKeyboardArrowLeft className="mainAlbumsScrollArrow left" onClick={() => scrollAlbums("left")}/>
                )}
                <div className="mainAlbums" ref={mainAlbumsRef} onScroll={updateArrows}>
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
                {canScrollRight && (
                    <MdKeyboardArrowRight className="mainAlbumsScrollArrow right" onClick={() => scrollAlbums("right")}/>
                )}
            </div>
            <Tooltip id="mainAlbum-tooltip" place="top" positionStrategy="fixed"/>
        </div>
    )
}

export default MainContent