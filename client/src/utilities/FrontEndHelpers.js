export const makeDeepCopy = (original) => {
    console.log('deep copy')
    return JSON.parse(JSON.stringify(original))
}

// handles both turning off and on notes
export const handleNoteClick = (
    notesToPlay,
    setNotesToPlay,
    { beatNum, scaleIndex, whichGrid },
    setClickedNote
) => {
    console.log('note click?')
    const arrayKey = `note-${scaleIndex}`
    let obj = { ...notesToPlay }

    if (notesToPlay[`beat-${beatNum}`][arrayKey]?.[whichGrid]) {
        // if the note already exists, delete it
        if (obj[`beat-${beatNum}`][arrayKey][whichGrid]) {
            delete obj[`beat-${beatNum}`][arrayKey][whichGrid]
        }

        // if that note no longer plays anything, clean up the object
        if (Object.values(obj[`beat-${beatNum}`][arrayKey]).length === 0) {
            delete obj[`beat-${beatNum}`][arrayKey]
        }
    } else {
        obj[`beat-${beatNum}`][arrayKey] = {
            [whichGrid]: 1,
            ...obj[`beat-${beatNum}`][arrayKey],
        }
    }
    setNotesToPlay(obj)
    setClickedNote(null)
}

export const makeNotesToPlayMaster = () => {
    const obj = {}
    for (let i = 1; i <= 16; i++) {
        obj[`beat-${i}`] = {}
    }
    return obj
}

export const makeBlankStepCountArray = () => {
    let arr = []
    for (let i = 16; i > 0; i--) {
        arr.push(0)
    }
    return arr
}

export const updateBlankStepCountArray = (stepCount) => {
    let arr = []
    for (let i = stepCount; i > 0; i--) {
        arr.push(0)
    }
    console.log(arr, 'new stepcount arry')
    return arr
}

export const updateNotesToPlayMaster = (stepCount, notesToPlay) => {
    const obj = { ...notesToPlay }

    const oldLength = Object.keys(notesToPlay).length
    if (oldLength < stepCount) {
        for (let i = oldLength + 1; i <= stepCount; i++) {
            obj[`beat-${i}`] = {}
        }
    } else {
        for (let i = stepCount + 1; i <= oldLength; i++) {
            delete obj[`beat-${i}`]
        }
    }
    console.log(obj, 'new notes to play')
    return obj
}

let trackCheckboxes = 0

export const trackAndResetPattern = (sendChordPattern, setSendChordPattern) => {
    // increment track checkboxes
    trackCheckboxes++
    if (
        trackCheckboxes / sendChordPattern.pattern.length >=
        sendChordPattern.note.length
    ) {
        // re-init trackcheckboxes
        trackCheckboxes = 0
        setSendChordPattern(undefined)
    }
}
