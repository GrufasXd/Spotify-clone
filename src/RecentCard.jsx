import { MdMusicNote } from "react-icons/md";


function RecentCard({title, song, onSongSelect}){
    return(
        <div className="recentCard" onClick={() => onSongSelect(song)}>
            <MdMusicNote className="recentCardImage"/>
            <p>{title}</p>
        </div>
    )
}

export default RecentCard