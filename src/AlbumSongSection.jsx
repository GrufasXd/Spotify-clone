import AlbumSongCard from "./AlbumSongCard";

function AlbumSongSection(props){
    return(
        <div className="cardSection">
            <h3>{props.sectionTitle}</h3>
            <div className="scrollableCards">
                <AlbumSongCard/>
                <AlbumSongCard/>
                <AlbumSongCard/>
                <AlbumSongCard/>
                <AlbumSongCard/>
                <AlbumSongCard/>
                <AlbumSongCard/>
                <AlbumSongCard/>
            </div>
        </div>
    )
}

export default AlbumSongSection