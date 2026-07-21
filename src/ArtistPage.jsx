import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"


function ArtistPage(){
    let params = useParams()
    const artistId = params.id
    const [artistData, setArtistData] = useState(null)
    useEffect(() => {
            fetch(`http://localhost:3001/api/artists/${artistId}`)
            .then(res => res.json())
            .then(data => setArtistData(data))
    }, [artistId])
    
    return(
        <>
            {artistData === null ? (
                <p>Loading artist data...</p>
            ) : 
            <div className="mainContent" key={artistData.id}>
                <p>{artistData.name}</p>
                <p>Monthly listeners: {artistData.monthly_listeners}</p>
            </div>
            }
        </>
    )
}

export default ArtistPage