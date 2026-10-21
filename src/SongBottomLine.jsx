import { CgPlayButton } from "react-icons/cg";
import { FaStepForward } from "react-icons/fa";
import { FaStepBackward } from "react-icons/fa";
import { IoPauseOutline } from "react-icons/io5";
import { IoShuffle } from "react-icons/io5";
import {useEffect, useRef, useState} from "react";
import { BsRepeat } from "react-icons/bs";
import { BsRepeat1 } from "react-icons/bs";
import { Tooltip } from 'react-tooltip'
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeDown } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

function SongBottomLine({currentSong, nextSong, previousSong, isPlaying, setIsPlaying, handlePlayClick, audioRef, currentIndex, shuffle, toggleShuffle, repeat, setRepeat, toggleRepeat, volume, setVolume, toggleMute, toggleLike, likedSongIds}){
    const [currentTime, setCurrentTime] = useState(0)
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00")
    const [duration, setDuration] = useState(0)
    const [durationDisplay, setDurationDisplay] = useState("00:00")
    const [songArtist, setSongArtist] = useState(null)
    const [songAlbum, setSongAlbum] = useState(null)
    const [songAlbumSongId, setSongAlbumSongId] = useState(null)
    const [titleOverflow, setTitleOverflow] = useState(0)
    const titleContainerRef = useRef(null)
    const isLiked = likedSongIds.has(currentSong?.id)

    function handleTitleMouseEnter(){
        const title = titleContainerRef.current
        if (!title) return

        const overflow = title.scrollWidth - title.clientWidth
        setTitleOverflow(Math.max(0, overflow))
    }

    const VolumeIcon = volume === 0 ? FaVolumeMute :
    volume < 0.5 ? FaVolumeDown : FaVolumeUp

    useEffect(() => {
        if(currentSong && audioRef.current){
            audioRef.current.currentTime = 0
            audioRef.current.play()
        }
    }, [currentSong, currentIndex])

    useEffect(() => {
        const audio = audioRef.current

        audio.ontimeupdate = () => {
            setCurrentTime(audio.currentTime)
            const mins = Math.floor(audio.currentTime / 60)
            const secs = Math.floor(audio.currentTime % 60)
            setCurrentTimeDisplay(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
        }

        audio.onloadedmetadata = () => {
            setDuration(audio.duration)
            const mins = Math.floor(audio.duration / 60)
            const secs = Math.floor(audio.duration % 60)
            setDurationDisplay(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
        }
    }, [])

    useEffect(() => {
        if(!currentSong) return
        let isCurrentSong = true

        fetch(`http://localhost:3001/api/artists/${currentSong.artist_id}`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch song artist")
            return res.json()
        })
        .then(data => {
            if (isCurrentSong) setSongArtist(data)
        })
        .catch(console.error)

        fetch(`http://localhost:3001/api/songs/${currentSong.id}/album`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch song album")
            return res.json()
        })
        .then(data => {
            if (isCurrentSong) {
                setSongAlbum(data)
                setSongAlbumSongId(currentSong.id)
            }
        })
        .catch(console.error)

        return () => {
            isCurrentSong = false
        }
    }, [currentSong])

    function handleProgressClick(e){
        let placeToMoveBar = ((e.clientX - e.currentTarget.getBoundingClientRect().left)  * audioRef.current.duration) / e.currentTarget.offsetWidth
        audioRef.current.currentTime = placeToMoveBar
    }

    return(
        <div className="songBottomLine">
            {currentSong != null ? (
                <div className="songBottomTrackInfo">
                    {songAlbumSongId === currentSong.id && songAlbum?.cover_url && (
                        <div className="songAlbumCover">
                            <img src={`http://localhost:3001${songAlbum.cover_url}`} alt={`${songAlbum.title} album cover`}/>
                        </div>
                    )}
                    <div className="songName">
                        <b
                            ref={titleContainerRef}
                            onMouseEnter={handleTitleMouseEnter}
                            style={titleOverflow > 0 ? {
                                "--title-scroll-distance": `-${titleOverflow}px`,
                                "--title-scroll-duration": `${1.5}s`,
                            } : undefined}
                        >
                            <span>{currentSong.title}</span>
                        </b>
                        {songArtist &&
                            <p>{songArtist.name}</p>
                        }
                    </div>
                </div>
            ) : 
                <div className="songName">
                        <p></p>
                        <p></p>
                </div>
            }
            <audio
                ref={audioRef}
                src={`http://localhost:3001${currentSong?.file_url}`}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {setIsPlaying(false); nextSong(true)}}
            />
            <div className="songBottomControls">
                <div className="songBottomButtons">
                    <IoShuffle data-tooltip-id="player-tooltip" data-tooltip-content={shuffle ? "Disable shuffle" : "Enable shuffle"} className={shuffle ? "shuffleButton active" : "shuffleButton"} onClick={toggleShuffle}/>
                    <FaStepBackward data-tooltip-id="player-tooltip" data-tooltip-content="Previous" className="previousSongButton" onClick={previousSong}/>
                    {isPlaying ? (
                        <IoPauseOutline data-tooltip-id="player-tooltip" data-tooltip-content="Pause" className="pauseButton" onClick={handlePlayClick}/>
                    ) : (
                        <CgPlayButton data-tooltip-id="player-tooltip" data-tooltip-content="Play" className="playButton" onClick={handlePlayClick}/>
                    )}
                    <FaStepForward data-tooltip-id="player-tooltip" data-tooltip-content="Next" className="nextSongButton" onClick={() => {nextSong(), setRepeat("")}}/>
                    {repeat === "Infinite" ? (
                        <BsRepeat data-tooltip-id="player-tooltip" data-tooltip-content="Disable repeat" className="repeatButton active" onClick={toggleRepeat}/>
                    ) : (
                        <BsRepeat1 data-tooltip-id="player-tooltip" data-tooltip-content={repeat === "Once" ? "Repeat infinite" : "Repeat once"} className={repeat === "Once" ? "repeatButton active"  : "repeatButton"} onClick={toggleRepeat}/>
                    )}
                    <Tooltip id="player-tooltip" place="top" className="projectTooltip" />
                </div>
                <div className="songBottomInfo">
                    <span>{currentTimeDisplay}</span>
                    <div className="songBottomLineProgress"
                        onClick={handleProgressClick}
                        >
                        <div className="songBottomLineProgressFill"
                            style={{ width: `${(currentTime / duration) * 100}%`}} 
                        />
                        <div className="songBottomLineThumb"
                            style={{ left: `${(currentTime / duration) * 100}%`}} 
                        />
                    </div>
                    <span>{durationDisplay}</span>
                </div>
            </div>
            <div className="songBottomRight">
                {isLiked === true ? (
                    <FaHeart className="likeButton bottom liked" onClick={(e) => {e.stopPropagation(); toggleLike(currentSong.id)}}/>
                ) : (
                    <FaRegHeart className="likeButton bottom" onClick={(e) => {e.stopPropagation(); toggleLike(currentSong.id)}}/>
                )}
                <VolumeIcon data-tooltip-id="player-tooltip" data-tooltip-content="Toggle mute" className="volumeIcon" onClick={toggleMute}/>
                <input className="volumeSlider" type="range" min="0" max="1" step="0.01" value={volume} style={{ "--volume-level": `${volume * 100}%` }} onChange={(e) => {setVolume(Number(e.target.value)); e.stopPropagation()}} />
            </div>
        </div>
    )
}

export default SongBottomLine