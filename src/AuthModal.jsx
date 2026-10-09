import { useState } from "react";


function AuthModal({setIsAuthModalOpen, authMode, isAuthModalOpen}){
    const [userEmail, setUserEmail] = useState("");
    const [username, setUsername] = useState("");
    const [userPassword, setUserPassword] = useState("");

    function closeAuthModal(){
        setIsAuthModalOpen(false)
        setUserEmail("")
        setUsername("")
        setUserPassword("")
    }

    if (!isAuthModalOpen) return null;
    return(
        <>  
            {authMode === "sign up" ? (
                <div className="overlay">
                    <div className="authenticationWindow">
                        <p className="authenticationTitle">Sign up</p>
                        <form onSubmit={(e) => signUp(e, userEmail, username, userPassword)}>
                            <label htmlFor="emailInput">Email:</label><br/><br/>
                            <input className="emailInput" type="email" name="emailInput" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/><br/><br/>
                            <label htmlFor="usernameInput">Username:</label><br/><br/>
                            <input className="usernameInput" type="text" name="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)}/><br/><br/>
                            <label htmlFor="passwordInput">Password:</label><br/><br/>
                            <input className="passwordInput" type="password" name="passwordInput" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/><br/><br/>
                            <div className="playlistButtonRow">
                                <button type="button" onClick={() => closeAuthModal()} className="cancelButton">Cancel</button>
                                <button type="submit" className="authSubmitButton">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="overlay">
                    <div className="authenticationWindow">
                        <p className="authenticationTitle">Log in</p>
                        <form onSubmit={(e) => logIn(e, userEmail, userPassword)}>
                            <label htmlFor="emailInput">Email:</label><br/><br/>
                            <input className="emailInput" type="email" name="emailInput" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/><br/><br/>
                            <label htmlFor="passwordInput">Password:</label><br/><br/>
                            <input className="passwordInput" type="password" name="passwordInput" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/><br/><br/>
                            <div className="playlistButtonRow">
                                <button type="button" onClick={() => closeAuthModal()} className="cancelButton">Cancel</button>
                                <button type="submit" className="authSubmitButton">Log in</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AuthModal