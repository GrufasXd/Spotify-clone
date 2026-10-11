import spotifyLogo from "./assets/Spotify_White.png"
import { GoHome } from "react-icons/go";
import { Tooltip } from 'react-tooltip'
import { FaRegUser } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import SearchBar from "./SeachBar"
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useState } from "react";


function TopBar({handleSongSelect, currentUser, setCurrentUser}){
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)

    function logout(e){
        e.preventDefault();
        fetch(`http://localhost:3001/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Logout failed");
            }
            return res.json();
        })
        .then(data => {
            setLogoutModalOpen(false)
            setCurrentUser(null)
        })
        .catch(error => {
            console.error(error);
        });
    }

    return(
        <>
            <AuthModal setIsAuthModalOpen={setIsAuthModalOpen} authMode={authMode} isAuthModalOpen={isAuthModalOpen} setCurrentUser={setCurrentUser}/>
            {logoutModalOpen && (
                <>
                    <div className="overlay">
                        <div className="logoutWindow">
                            <p className="logoutConfirmationTitle">Are you sure you want to log out?</p>
                            <div className="modalButtonRow">
                                <button type="button" onClick={() => setLogoutModalOpen(false)} className="cancelButton">Cancel</button>
                                <button type="button" onClick={(e) => logout(e)} className="logoutConfirmationButton">Confirm</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="mainTheme">
                <img src={spotifyLogo} alt="spotifyLogo" className="spotifyLogo"/>
                <div className="topCenter">
                    <div className="homeButton" onClick={() => navigate(`/`)}>
                        <button data-tooltip-id="topbar-tooltip" data-tooltip-content="Home" className="homeBackground"><GoHome className="homeButton"/></button>
                    </div>
                    <SearchBar onSongSelect={handleSongSelect}/>
                </div>
                <div className="topRight">
                    {currentUser != null ? (
                        <>
                            <FaRegUser data-tooltip-id="topbar-tooltip" data-tooltip-content={currentUser.username} className="userIcon"/>
                            <FiLogOut data-tooltip-id="logout-tooltip" data-tooltip-content="Log out" className="logoutButton" onClick={() => setLogoutModalOpen(true)}/>
                        </>
                    ) : (
                        <div className="authenticationButtons">
                            <button className="signUpButton" onClick={() => {setAuthMode("sign up"); setIsAuthModalOpen(true)}}>Sign up</button>
                            <button className="logInButton" onClick={() => {setAuthMode("log in"); setIsAuthModalOpen(true)}}>Log in</button>
                        </div>
                    )}
                </div>
            </div>
            <Tooltip id="topbar-tooltip" place="bottom" className="tooltips"/>
            <Tooltip id="logout-tooltip" place="bottom-start" className="tooltips"/>
        </>
    )
}

export default TopBar