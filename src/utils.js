
export function durationToText(duration){
    const hours = Math.floor(duration / 3600)
    if (hours > 0){
        const mins = Math.floor((duration % 3600) / 60)
        const secs = Math.floor(duration % 60)
        return(`${hours} h ${mins} min ${secs} s`)
    }
    else{
        const mins = Math.floor(duration / 60)
        const secs = Math.floor(duration % 60)
        return(`${mins} min ${secs} s`)
    }
}

export function formatTime(duration){
    const mins = Math.floor(duration / 60)
    const secs = Math.floor(duration % 60)
    return (`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
}