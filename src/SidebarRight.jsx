import {useEffect, useState} from "react";
import RecentCard from "./RecentCard"

function SidebarRight({currentSong, userQueue, onSongSelect, playlistData, addSongToQueue}){

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
                <b>Next in queue</b>
                {userQueue.map(song => (
                    <RecentCard
                        key={song.id}
                        title={song.title}
                        song={song}
                        onSongSelect={onSongSelect}
                        playlistData={playlistData}
                        addSongToQueue={addSongToQueue}
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