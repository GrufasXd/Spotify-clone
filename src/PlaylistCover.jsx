import { API_URL } from "./config"

import { IoMusicalNotesOutline } from "react-icons/io5";


function PlaylistCover({covers = [], className}) {
    if (covers.length === 0) {
        return <IoMusicalNotesOutline className={className}/>
    }
    else if (covers.length < 4) {
        return <img className={className} src={`${API_URL}${covers[0]}`} alt="Playlist cover"/>
    }

    return(
        <div className={`playlistMosaic ${className}`}>
            {covers.slice(0,4).map(cover => (
                <img key={cover} src={`${API_URL}${cover}`} alt=""/>
            ))}
        </div>
    )
}

export default PlaylistCover