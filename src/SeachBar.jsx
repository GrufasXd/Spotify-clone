import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom"


function SearchBar({onSongSelect}){
    let navigate = useNavigate()
    const [searchString, setSearchString] = useState("")
    const [artistsResults, setArtistsResults] = useState([])
    const [songResults, setSongResults] = useState([])
    const [songRelatedResults, setSongRelatedResults] = useState([])
    const [albumResults, setAlbumResults] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const searchContainerRef = useRef(null)

    function handleSearch(event){
        setSearchString(event.target.value)
        setDropdownOpen(true)
    }

    function handleNavigationClick(navigationSpot, artistId){
        navigate(`/${navigationSpot}/${artistId}`)
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
            fetch(`http://localhost:3001/api/albums/search?q=${searchString}`)
            .then(res => res.json())
            .then(data => setAlbumResults(data))
            console.log(albumResults)
        }
        else if (searchString == ""){
            setArtistsResults([])
            setSongResults([])
        }
    },[searchString])

    useEffect(() => {
        function handleClickOutside(e){
            if(!searchContainerRef.current.contains(e.target)){
                setDropdownOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return(() => {
            document.removeEventListener('click', handleClickOutside)
        })
    }, [])

    const filteredRelatedResults = songRelatedResults.filter(relatedSong => !songResults.find(song => song.id === relatedSong.id ))
    
    return(
    <div className="searchContainer" ref={searchContainerRef}>
        <div className="searchWrapper">
            <CiSearch className="searchIcon"/>
            <input type="text" value={searchString} onChange={handleSearch} className="searchBar" placeholder="What do you want to play?"/>
        </div>
        {searchString != "" && dropdownOpen ?  (
            <div className="searchResults">
                {artistsResults.length === 0 && songResults.length === 0 && albumResults.length === 0 && songRelatedResults.length === 0 ? (
                    <p>No results found</p>
                ) :
                    <>
                        {artistsResults.length === 0 ? (
                                <></>
                        ) : 
                            <>
                            <b className="searchSection">Artists</b>
                            {artistsResults.map(artist =>(
                                <div key={artist.id} className="searchResult" onClick={() => handleNavigationClick("artist", artist.id)}>
                                    <p>{artist.name}</p>
                                </div>
                            ))}
                            </>
                        }
                        {songResults.length === 0  && songRelatedResults.length === 0 ?(
                            <></>
                        ) :
                        <>
                            <b className="searchSection">Songs</b>
                            {songResults.map(song =>(
                                <div className="searchResult" key={song.id} onClick={() => onSongSelect(song)} song={song}>
                                    <p>{song.title}</p>
                                    <p className="searchTag">{song.name}</p>
                                </div>
                            ))}
                            {filteredRelatedResults.map(song =>(
                                <div className="searchResult" key={song.id} onClick={() => onSongSelect(song)} song={song}>
                                    <p>{song.title}</p>
                                    <p className="searchTag">{song.name}</p>
                                </div>
                            ))}
                        </>
                        }
                        {albumResults.length == 0 ? (
                            <></>
                        ):
                        <>
                            <p className="searchSection">Albums</p>
                            {albumResults.map(album => (
                                <div className="searchResult" key={album.id} onClick={() => handleNavigationClick("album", album.id)}>
                                    <p>{album.title}</p>
                                    <p className="searchTag">{album.artist_name}</p>
                                </div>
                            ))}
                        </>
                        }
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