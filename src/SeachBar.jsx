import { CiSearch } from "react-icons/ci";
import { IoIosBrowsers } from "react-icons/io";


function SearchBar(){
    return(
    <div className="searchWrapper">
        <CiSearch className="searchIcon"/>
        <input type="text" className="searchBar" placeholder="What do you want to play?"/>
        <p className="searchEnd">|</p>
        <IoIosBrowsers className="browseIcon"/>
    </div>)
}

export default SearchBar