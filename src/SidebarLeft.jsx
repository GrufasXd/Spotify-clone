import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import PlaylistItem from "./PlaylistItem";

function SidebarLeft(){
    let navigate = useNavigate()
    const [playlistData, setPlaylistData] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3001/api/playlists`)
        .then(res => res.json())
        .then(data => setPlaylistData(data))
    }, [])

    function playlistCreation(){
        const name = prompt("Playlist name: ")
        const description = prompt("Playlist description: ")
        if(name != null){
            fetch(`http://localhost:3001/api/playlists`, {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    description: description
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(res => res.json())
            .then(data => setPlaylistData(prev => [...prev, data]))
        }
    }

    return(
    <div className="sidebarLeft">
        <div className="sidebarHeader">
            <b>Your Library</b>
            <button className="plusIcon" onClick={() => playlistCreation()}>+</button>
        </div>
        <ul className="playlists">
            {playlistData.map(playlist => (
                <li onClick={() => navigate(`/playlist/${playlist.id}`)} key={playlist.id}>
                    <PlaylistItem playlistName={playlist.name} playlistDescription={playlist.description}/>
                </li>
            ))}
        </ul>
    </div>
    )
}

export default SidebarLeft