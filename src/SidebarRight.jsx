import {useEffect, useState} from "react";
import RecentCard from "./RecentCard"

function SidebarRight({currentSong, userQueue, setUserQueue, onSongSelect, queueItemClick, playlistData, addSongToQueue, clearQueue}){

    return(
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
                    <p className="clearQueueButton" onClick={() => clearQueue()}>Clear queue</p>
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
    )
}

export default SidebarRight