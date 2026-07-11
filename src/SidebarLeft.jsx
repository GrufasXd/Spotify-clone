import PlaylistItem from "./PlaylistItem";

function SidebarLeft(){
    return(
    <div className="sidebarLeft">
        <div className="sidebarHeader">
            <b>Your Library</b>
            <button className="plusIcon">+</button>
        </div>
        <ul className="playlists">
            <li>
                <PlaylistItem playlistName="Playlist 1" playlistDescription="My playlist"/>
            </li>
            <li>
                <PlaylistItem playlistName="Playlist 2" playlistDescription="My playlist"/>
            </li>
            <li>
                <PlaylistItem playlistName="Playlist 3" playlistDescription="My playlist"/>
            </li>
            <li>
                <PlaylistItem playlistName="Playlist 4" playlistDescription="My playlist"/>
            </li>
        </ul>
    </div>
    )
}

export default SidebarLeft