import PlaylistCover from "./PlaylistCover";

function PlaylistItem({playlistName, playlistDescription, covers}) {
    return(
        <div className="playlistItem">
            <PlaylistCover covers={covers} className="playlistIcon"/>
            <div className="playlistItemText">
                <b className="playlistName">{playlistName}</b>
                <p className="playlistDescription">{playlistDescription}</p>
            </div>
        </div>
    )
}

export default PlaylistItem