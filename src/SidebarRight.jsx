import {useEffect, useRef, useState} from "react";
import RecentCard from "./RecentCard"

function SidebarRight({currentSong, userQueue, setUserQueue, onSongSelect, queueItemClick, playlistData, addSongToQueue, clearQueue}){

    const [queueClearConfirmation, setQueueClearConfirmation] = useState(false)
    const queueClearRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e){
            if(queueClearRef.current && !queueClearRef.current.contains(e.target)){
                setQueueClearConfirmation(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return(() => {
            document.removeEventListener('click', handleClickOutside)
        })
    }, [])

    return(
    <>
    {queueClearConfirmation && (
    <div className="overlay">
        <div className="playlistDeletionWindow" ref={queueClearRef}>
            <p className="playlistCreationTitle">Are you sure you want to clear the queue?</p>
            <div className="playlistButtonRow">
                <button type="button" onClick={() => {
                    setQueueClearConfirmation(false);
                }} className="cancelButton">Cancel</button>
                <button type="submit" className="createButton" onClick={() => {clearQueue(); setQueueClearConfirmation(false)}}>Clear queue</button>
            </div>
        </div>
    </div>
    )}
    <div className="sidebarRight">
        <b className="sidebarRightTitle">Queue</b>
        {currentSong != null ? (
        <>
            <b>Now playing</b>
            <RecentCard
                key={currentSong.id}
                title={currentSong.title}
                song={currentSong}
                onSongSelect={onSongSelect}
                playlistData={playlistData}
                addSongToQueue={addSongToQueue}
            />
        </>
        ): 
        <>
            <p>Play a song to show it here</p>
        </>
        }
        {userQueue.length != 0 ? (
            <>  
                <div className="sidebarRightTextWrapper">
                    <b>Next in queue</b>
                    <p className="clearQueueButton" onClick={(e) => {setQueueClearConfirmation(true); e.stopPropagation()}}>Clear queue</p>
                </div>
                {userQueue.map(queueItem => (
                    <RecentCard
                        key={queueItem.queueItemId}
                        title={queueItem.song.title}
                        song={queueItem.song}
                        queueItem={queueItem}
                        queueItemClick={queueItemClick}
                        playlistData={playlistData}
                        addSongToQueue={addSongToQueue}
                        isSidebar={true}
                        setUserQueue={setUserQueue}
                    />
                ))}
            </>
        ) : 
        <>
            <p>No songs in queue</p>
        </>
        }
    </div>
    </>
    )
}

export default SidebarRight