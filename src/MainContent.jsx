import RecentCard from "./RecentCard"
import AlbumSongSection from "./AlbumSongSection"
import { useState, useEffect } from "react"

function MainContent({onSongSelect, playlistData, addSongToQueue}){
    const [songs, setSongs] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/api/songs')
        .then(res => res.json())
        .then(data => setSongs(data))
    }, [])

    return(
        <div className="mainContent">
            <h2>Good morning!</h2>
            <div className="recentlyViewedCards">
                {songs.map (song => (
                    <RecentCard 
                        key={song.id}
                        title={song.title}
                        song={song}
                        onSongSelect={(song) => onSongSelect(song, songs)}
                        playlistData={playlistData}
                        addSongToQueue={addSongToQueue}
                    />
                ))}
            </div>
            <AlbumSongSection sectionTitle="Jump back in"/>
            <AlbumSongSection sectionTitle="Made for you"/>
            <AlbumSongSection sectionTitle="Recents"/>
            <AlbumSongSection sectionTitle="Albums featuring songs you like"/>
        </div>
    )
}

export default MainContent