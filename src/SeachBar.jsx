import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosBrowsers } from "react-icons/io";


function SearchBar(){
    const [searchString, setSearchString] = useState("")
    const [artistsResults, setArtistsResults] = useState([])
    const [songResults, setSongResults] = useState([])

    function handleSearch(event){
        setSearchString(event.target.value)
    }

    useEffect(() => {
        if (searchString != ""){
            fetch(`http://localhost:3001/api/artists/search?q=${searchString}`)
            .then(res => res.json())
            .then(data => setArtistsResults(data))
            fetch(`http://localhost:3001/api/songs/search?q=${searchString}`)
            .then(res => res.json())
            .then(data => setSongResults(data))
            console.log(artistsResults)
            console.log(songResults)
        }
        else if (searchString == ""){
            setArtistsResults([])
            setSongResults([])
        }
    },[searchString])
    
    return(
    <div className="searchContainer">
        <div className="searchWrapper">
            <CiSearch className="searchIcon"/>
            <input type="text" value={searchString} onChange={handleSearch} className="searchBar" placeholder="What do you want to play?"/>
            <p className="searchEnd">|</p>
            <IoIosBrowsers className="browseIcon"/>
        </div>
        {searchString != "" ?  (
            <div className="searchResults">
                {artistsResults.length === 0 && songResults.length === 0 ? (
                    <p>No results found</p>
                ) :
                    <>
                    <b>Artists</b>
                    {artistsResults.map(artist =>(
                        <div key={artist.id}>
                            <p>{artist.name}</p>
                            <p className="searchTag">Artist</p>
                        </div>
                    ))}
                    <b>Songs</b>
                    {songResults.map(song =>(
                        <div key={song.id}>
                            <p>{song.title}</p>
                            <p className="searchTag">Song</p>
                        </div>
                    ))}
                    </>
                }
            </div>
        ) : 
            <></>
        }
    </div>
    )
}

export default SearchBar