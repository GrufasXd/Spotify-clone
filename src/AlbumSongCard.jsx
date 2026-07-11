import { MdAlbum } from "react-icons/md";


function AlbumSongCard(){
    return(
    <div className="albumSongCard">
        <MdAlbum  className="albumSongIcon"/>
        <b>Song/album name</b>
        <p>Author(s)</p>
    </div>)
}

export default AlbumSongCard