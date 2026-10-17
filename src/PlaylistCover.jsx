import { IoMusicalNotesOutline } from "react-icons/io5";


function PlaylistCover({covers = [], className}) {
    if (covers.length === 0) {
        return <IoMusicalNotesOutline className={className}/>
    }
    else if (covers.length < 4) {
        return <img className={className} src={`http://localhost:3001${covers[0]}`} alt="Playlist cover"/>
    }

    return(
        <div className={`playlistMosaic ${className}`}>
            {covers.slice(0,4).map(cover => (
                <img key={cover} src={`http://localhost:3001${cover}`} alt=""/>
            ))}
        </div>
    )
}

export default PlaylistCover