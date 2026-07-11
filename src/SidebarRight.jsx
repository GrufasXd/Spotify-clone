import { MdMusicNote } from "react-icons/md";

function SidebarRight(){
    return(
    <div className="sidebarRight">
        <MdMusicNote className="playingSongImage"/>
        <b>Song name</b>
        <p>Song author(s)</p>
    </div>
    )
}

export default SidebarRight