import { IoMusicalNotesOutline } from "react-icons/io5";

function PlaylistItem(props) {
    return(
        <div className="playlistItem">
            <IoMusicalNotesOutline className="playlistIcon"/>
            <div className="playlistItemText">
                <b className="playlistName">{props.playlistName}</b>
                <p className="playlistDescription">{props.playlistDescription}</p>
            </div>
        </div>
    )
}

export default PlaylistItem