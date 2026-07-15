import { CgPlayButton } from "react-icons/cg";
import { FaStepForward } from "react-icons/fa";
import { FaStepBackward } from "react-icons/fa";
import { IoPauseOutline } from "react-icons/io5";
import { useRef, useEffect, useState, useDebugValue } from "react";

function SongBottomLine({currentSong}){
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00")
    const [duration, setDuration] = useState(0)
    const [durationDisplay, setDurationDisplay] = useState("00:00")
    const audioRef = useRef(null)

    useEffect(() => {
        if(currentSong && audioRef.current){
            audioRef.current.play()
            setIsPlaying(true)
        }
    }, [currentSong])

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

    function handlePlayClick(){
        const audio = audioRef.current

        if(!audio) return

        if(audio.paused){
            audio.play()
            setIsPlaying(true)
        }
        else{
            audio.pause()
            setIsPlaying(false)
        }
    }

    function handleProgressClick(e){
        var placeToMoveBar = ((e.clientX - e.currentTarget.getBoundingClientRect().left)  * audioRef.current.duration) / e.currentTarget.offsetWidth
        audioRef.current.currentTime = placeToMoveBar
    }

    return(
        <div className="songBottomLine">
            {currentSong != null ? (
                <div className="songName">
                    <b>{currentSong.title}</b>
                    <p>{currentSong.artist}</p>
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
                onEnded={() => setIsPlaying(false)}
            />
            <div className="songBottomControls">
                <div className="songBottomButtons">
                    <FaStepBackward className="previousSongButton"/>
                    {isPlaying ? (
                        <IoPauseOutline className="pauseButton" onClick={handlePlayClick}/>
                    ) : (
                        <CgPlayButton className="playButton" onClick={handlePlayClick}/>
                    )}
                    <FaStepForward className="nextSongButton"/>
                </div>
                <div className="songBottomInfo">
                    <span>{currentTimeDisplay}</span>
                    <div className="songBottomLineProgress"
                        onClick={handleProgressClick}
                        >
                        <div className="songBottomLineProgressFill"
                            style={{ width: `${(currentTime / duration) * 100}%`}} 
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