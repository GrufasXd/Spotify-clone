import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosBrowsers } from "react-icons/io";
import { useNavigate } from "react-router-dom"


function SearchBar({onSongSelect}){
    let navigate = useNavigate()
    const [searchString, setSearchString] = useState("")
    const [artistsResults, setArtistsResults] = useState([])
    const [songResults, setSongResults] = useState([])
    const [songRelatedResults, setSongRelatedResults] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)

    function handleSearch(event){
        setSearchString(event.target.value)
        setDropdownOpen(true)
    }

    function handleArtistClick(artistId){
        navigate(`/artist/${artistId}`)
        setDropdownOpen(false)
    }

    useEffect(() => {
        if (searchString != ""){
            fetch(`http://localhost:3001/api/artists/search?q=${searchString}`)
            .then(res => res.json())
            .then(data => setArtistsResults(data))
            fetch(`http://localhost:3001/api/songs/search?q=${searchString}`)
            .then(res => res.json())
            .then(data => setSongResults(data))
            fetch(`http://localhost:3001/api/artists/songs?q=${searchString}`)
            .then(res => res.json())
            .then(data => setSongRelatedResults(data))
            console.log(songResults)
            console.log(songRelatedResults)
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
        {searchString != "" && dropdownOpen ?  (
            <div className="searchResults">
                {artistsResults.length === 0 && songResults.length === 0 ? (
                    <p>No results found</p>
                ) :
                    <>
                    {artistsResults.length === 0 ? (
                            <></>
                    ) : 
                        <>
                        <b>Artists</b>
                        {artistsResults.map(artist =>(
                            <div key={artist.id} className="searchResult" onClick={() => handleArtistClick(artist.id)}>
                                <p>{artist.name}</p>
                            </div>
                        ))}
                        </>
                    }
                    <>
                        {songResults.length === 0  && songRelatedResults.length === 0 ?(
                            <></>
                        ) :
                        <>
                            <b>Songs</b>
                            {songResults.map(song =>(
                                <div className="searchResult" key={song.id} onClick={() => onSongSelect(song)} song={song}>
                                    <p>{song.title}</p>
                                    <p className="searchTag">{song.name}</p>
                                </div>
                            ))}
                            {songRelatedResults.map(song =>(
                                <div className="searchResult" key={song.id} onClick={() => onSongSelect(song)} song={song}>
                                    <p>{song.title}</p>
                                    <p className="searchTag">{song.name}</p>
                                </div>
                            ))}
                        </>
                        }
                    </>
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