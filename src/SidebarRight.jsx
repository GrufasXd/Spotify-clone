import {useEffect, useState} from "react";

function SidebarRight({currentSong, userQueue}){
    const [songArtist, setSongArtist] = useState(null)

    useEffect(() => {
        if(!currentSong) return

        fetch(`http://localhost:3001/api/artists/${currentSong.artist_id}`)
        .then(res => res.json())
        .then(data => setSongArtist(data))
    }, [currentSong])

    return(
    <div className="sidebarRight">
        <b className="sidebarRightTitle">Queue</b>
        {currentSong != null ? (
        <>
            <b>Now playing</b>
            <div>
                <b>{currentSong.title}</b>
                {songArtist && (
                <p>{songArtist.name}</p>
                )}
            </div>
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
                    <div>
                        <b>{song.title}</b>
                        <p>{song.artist_name}</p>
                    </div>
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