import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import PlaylistItem from "./PlaylistItem";

function SidebarLeft({playlistData, setPlaylistData}){
    let navigate = useNavigate()
    const [playlistCreationWindow, setplaylistCreationWindow] = useState(false)
    const [playlistTitle, setPlaylistTitle] = useState("")
    const [playlistDescription, setPlaylistDescription] = useState("")

    function playlistCreation(e, playlistTitle, playlistDescription){
        e.preventDefault()
        if(playlistTitle != null){
            fetch(`http://localhost:3001/api/playlists`, {
                method: "POST",
                body: JSON.stringify({
                    name: playlistTitle,
                    description: playlistDescription
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(res => res.json())
            .then(data => {
                setPlaylistData(prev => [...prev, data]);
                setPlaylistTitle("");
                setPlaylistDescription("");
                setplaylistCreationWindow(false);
            })
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
                    <form onSubmit={(e) => playlistCreation(e, playlistTitle, playlistDescription)}>
                        <label htmlFor="playlistTitle">Playlist title:</label><br/><br/>
                        <input className="playlistInput" type="text" name="playlistTitle" value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value)}/><br/><br/>
                        <label htmlFor="playlistDescriptionInput">Playlist description:</label><br/><br/>
                        <textarea className="playlistDescriptionInput" name="playlistDescriptionInput" value={playlistDescription} onChange={(e) => setPlaylistDescription(e.target.value)} cols={"15"} rows={"5"}/><br/><br/>
                        <div className="playlistButtonRow">
                            <button type="button" onClick={() => {
                                setPlaylistTitle(null);
                                setPlaylistDescription(null);
                                setplaylistCreationWindow(false);
                            }} className="cancelButton">Cancel</button>
                            <button type="submit" className="createButton">Create</button>
                        </div>
                    </form>
                </div>
            </div>
            }
            <div className="sidebarLeft">
                <div className="sidebarHeader">
                    <b>Your Library</b>
                    <button className="plusIcon" onClick={() => setplaylistCreationWindow(true)}>+</button>
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