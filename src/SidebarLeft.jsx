import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import PlaylistItem from "./PlaylistItem";

function SidebarLeft(){
    let navigate = useNavigate()
    const [playlistData, setPlaylistData] = useState([])
    const [playlistCreationWindow, setplaylistCreationWindow] = useState(false)
    const [playlistTitle, setPlaylistTitle] = useState("")
    const [playlistDescription, setPlaylistDescription] = useState("")

    useEffect(() => {
        fetch(`http://localhost:3001/api/playlists`)
        .then(res => res.json())
        .then(data => setPlaylistData(data))
    }, [])

    function playlistCreation(){
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
        <>
            {playlistCreationWindow == false ? (
                <></>
            ) : 
            <div className="overlay">
                <div className="playlistCreationWindow">
                    <p className="playlistCreationTitle">Create your playlist</p>
                    <form onSubmit={}>
                        <label htmlFor="playlistTitle">Playlist title:</label><br/><br/>
                        <input className="playlistInput" type="text" id="playlistTitle" name="playlistTitle" onChange={() => setPlaylistTitle(value)}/><br/><br/>
                        <label htmlFor="playlistDescriptionInput">Playlist description:</label><br/><br/>
                        <textarea className="playlistDescriptionInput" id="playlistDescriptionInput" name="playlistDescriptionInput" onChange={() => setPlaylistDescription(value)} cols={"15"} rows={"5"}/><br/><br/>
                        <div className="playlistButtonRow">
                            <button type="button" onClick={() => setplaylistCreationWindow(false)} className="cancelButton">Cancel</button>
                            <button type="submit" className="createButton">Create</button>
                        </div>
                    </form>
                </div>
            </div>
            }
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
        </>
    )
}

export default SidebarLeft