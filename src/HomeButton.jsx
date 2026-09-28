import { GoHome } from "react-icons/go";
import { Tooltip } from 'react-tooltip'

function HomeButton(){
    return(
    <>
        <button data-tooltip-id="home-tooltip" data-tooltip-content="Home" className="homeBackground"><GoHome className="homeButton"/></button>
        <Tooltip id="home-tooltip" place="bottom" className="tooltips"/>
    </>
)
    
}

export default HomeButton