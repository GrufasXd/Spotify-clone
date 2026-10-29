import { useState, useEffect, useRef} from "react"

import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";

function ScrollRow({title, children}){
    const mainAlbumsRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    useEffect(() => {
        updateArrows()
    }, [children])

    useEffect(() => {
        const observer = new ResizeObserver(() => updateArrows())
        observer.observe(mainAlbumsRef.current)
        return () => observer.disconnect()
    }, [])

    function scrollAlbums(direction){
        const list = mainAlbumsRef.current
        if(!list) return

        const distance = list.clientWidth * 0.8
        const left = direction === "right" ? distance : -distance
        list.scrollBy({
            left: left,
            behavior: "smooth"
        })
    }

    function updateArrows(){
        const list = mainAlbumsRef.current
        if(!list) return

        setCanScrollLeft(list.scrollLeft > 0)
        setCanScrollRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1)
    }

    return(
    <>
    <h2>{title}</h2>
    <div className="mainAlbumsWrapper">
        {canScrollLeft && (
            <MdKeyboardArrowLeft className="mainAlbumsScrollArrow left" onClick={() => scrollAlbums("left")}/>
        )}
         <div className="mainAlbums" ref={mainAlbumsRef} onScroll={updateArrows}>
            {children}
        </div>
        {canScrollRight && (
            <MdKeyboardArrowRight className="mainAlbumsScrollArrow right" onClick={() => scrollAlbums("right")}/>
        )}
    </div>
    </>
)}

export default ScrollRow