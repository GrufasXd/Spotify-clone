import { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { API_URL } from "./config"


function AuthModal({setIsAuthModalOpen, authMode, isAuthModalOpen, setCurrentUser}){
    const [userEmail, setUserEmail] = useState("")
    const [username, setUsername] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [authError, setAuthError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    function closeAuthModal(){
        setIsAuthModalOpen(false)
        setUserEmail("")
        setUsername("")
        setUserPassword("")
        setAuthError("")
        setShowPassword(false)
    }

    function signUp(e){
        e.preventDefault();
        fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: userEmail,
                password: userPassword
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }
            return data;
        })
        .then(() => {
            logIn();
        })
        .catch(error => {
            setAuthError(error.message);
            console.error(error);
        });
    }

    function logIn(e){
        e?.preventDefault();
        fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                email: userEmail,
                password: userPassword
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Log in failed");
            }
            return fetch(`${API_URL}/api/auth/me`, {
                credentials: "include"
            });
        })
       .then(async res => {
            if (!res.ok) {
                throw new Error("Failed to get user data");
            }

            return res.json();
        })
        .then(data => {
            setCurrentUser(data);
            closeAuthModal();
        })
        .catch(error => {
            setAuthError(error.message)
            console.error(error);
        });
    }

    if (!isAuthModalOpen) return null;
    return(
        <>  
            {authMode === "sign up" ? (
                <div className="overlay">
                    <div className="authenticationWindow">
                        <p className="authenticationTitle">Sign up</p>
                        <form onSubmit={(e) => signUp(e)}>
                            <label htmlFor="emailInput">Email:</label><br/><br/>
                            <input className="emailInput" type="email" name="emailInput" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/><br/><br/>
                            <label htmlFor="usernameInput">Username:</label><br/><br/>
                            <input className="usernameInput" type="text" name="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)}/><br/><br/>
                            <label htmlFor="passwordInput">Password:</label><br/><br/>
                            <div className="passwordInputWrapper">
                                <input className="passwordInput" type={showPassword ? "text" : "password"} name="passwordInput" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/><br/><br/>
                                <button type="button" className="passwordToggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                </button>
                            </div>
                            {authError && (
                                <p className="authError">{authError}</p>
                            )}
                            <div className="modalButtonRow">
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
                        <form onSubmit={(e) => logIn(e)}>
                            <label htmlFor="emailInput">Email:</label><br/><br/>
                            <input className="emailInput" type="email" name="emailInput" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/><br/><br/>
                            <label htmlFor="passwordInput">Password:</label><br/><br/>
                            <div className="passwordInputWrapper">
                                <input className="passwordInput" type={showPassword ? "text" : "password"} name="passwordInput" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/><br/><br/>
                                <button type="button" className="passwordToggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                </button>
                            </div>
                            {authError && (
                                <p className="authError">{authError}</p>
                            )}
                            <div className="modalButtonRow">
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