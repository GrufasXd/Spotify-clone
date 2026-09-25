import { CgPlayButton } from "react-icons/cg";
import { FaStepForward } from "react-icons/fa";
import { FaStepBackward } from "react-icons/fa";
import { IoPauseOutline } from "react-icons/io5";
import { IoShuffle } from "react-icons/io5";
import {useEffect, useState} from "react";
import { BsRepeat } from "react-icons/bs";
import { BsRepeat1 } from "react-icons/bs";

function SongBottomLine({currentSong, nextSong, previousSong, isPlaying, setIsPlaying, handlePlayClick, audioRef, currentIndex, shuffle, toggleShuffle, repeat, setRepeat, toggleRepeat}){
    const [currentTime, setCurrentTime] = useState(0)
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00")
    const [duration, setDuration] = useState(0)
    const [durationDisplay, setDurationDisplay] = useState("00:00")
    const [songArtist, setSongArtist] = useState(null)

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

        fetch(`http://localhost:3001/api/artists/${currentSong.artist_id}`)
        .then(res => res.json())
        .then(data => setSongArtist(data))
    }, [currentSong])

    function handleProgressClick(e){
        var placeToMoveBar = ((e.clientX - e.currentTarget.getBoundingClientRect().left)  * audioRef.current.duration) / e.currentTarget.offsetWidth
        audioRef.current.currentTime = placeToMoveBar
    }

    return(
        <div className="songBottomLine">
            {currentSong != null ? (
                <div className="songName">
                    <b>{currentSong.title}</b>
                    {songArtist &&
                        <p>{songArtist.name}</p>
                    }
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
                    <IoShuffle className={shuffle ? "shuffleButton active" : "shuffleButton"} onClick={toggleShuffle}/>
                    <FaStepBackward className="previousSongButton" onClick={previousSong}/>
                    {isPlaying ? (
                        <IoPauseOutline className="pauseButton" onClick={handlePlayClick}/>
                    ) : (
                        <CgPlayButton className="playButton" onClick={handlePlayClick}/>
                    )}
                    <FaStepForward className="nextSongButton" onClick={() => {nextSong(), setRepeat("")}}/>
                    {repeat === "Infinite" ? (
                        <BsRepeat className="repeatButton active" onClick={toggleRepeat}/>
                    ) : (
                        <BsRepeat1 className={repeat === "Once" ? "repeatButton active" : "repeatButton"} onClick={toggleRepeat}/>
                    )}
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
            </div>
        </div>
    )
}

export default SongBottomLine