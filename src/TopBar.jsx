import spotifyLogo from "./assets/Spotify_White.png"
import { GoHome } from "react-icons/go";
import { Tooltip } from 'react-tooltip'
import { FaRegUser } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import SearchBar from "./SeachBar"
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useState } from "react";


function TopBar({handleSongSelect, currentUser}){
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    return(
        <>
            <AuthModal setIsAuthModalOpen={setIsAuthModalOpen} authMode={authMode} isAuthModalOpen={isAuthModalOpen}/>
            <div className="mainTheme">
                <img src={spotifyLogo} alt="spotifyLogo" className="spotifyLogo"/>
                <div className="topCenter">
                    <div className="homeButton" onClick={() => navigate(`/`)}>
                        <button data-tooltip-id="home-tooltip" data-tooltip-content="Home" className="homeBackground"><GoHome className="homeButton"/></button>
                        <Tooltip id="home-tooltip" place="bottom" className="tooltips"/>
                    </div>
                    <SearchBar onSongSelect={handleSongSelect}/>
                </div>
                <div className="topRight">
                    {currentUser != null ? (
                        <>
                            <FaRegBell className="newsIcon"/>
                            <FaRegUser className="userIcon"/>
                        </>
                    ) : (
                        <div className="authenticationButtons">
                            <button className="signUpButton" onClick={() => {setAuthMode("sign up"); setIsAuthModalOpen(true)}}>Sign up</button>
                            <button className="logInButton" onClick={() => {setAuthMode("log in"); setIsAuthModalOpen(true)}}>Log in</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default TopBar