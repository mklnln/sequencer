// ? trying to use useContext, i can only import those things inside of a custom hook or a react function component. otherwise, it may need to be tons of arguments passed to JS functions.

export const generateAreXBeatsCheckedInitialState = (
    makeChordNotesState,
    makeMelodyNotesState,
    blankStepCountArray,
    whichGrid
) => {
    const makeAreXBeatsChecked = {}
    // DRYDRYDRY
    // TODO refactor and only pass in one of the makeXNotesState, no need to check chords/melody
    // ! did        makeAreXBeatsChecked[`note-${num}`].push(0) because using blankstepcountarray caused problems with spread operator down the road, each array used the same reference and so a change to one lead to a change to all
    let amtOfArraysToMake

    whichGrid === 'chords'
        ? (amtOfArraysToMake = makeChordNotesState)
        : (amtOfArraysToMake = makeMelodyNotesState)

    amtOfArraysToMake.forEach((num) => {
        makeAreXBeatsChecked[`${num}`] = []
        blankStepCountArray.forEach((step) => {
            makeAreXBeatsChecked[`${num}`].push(0)
        })
    })
    return makeAreXBeatsChecked
}

export const clearAreChordBeatsChecked = (
    makeChordNotesState,
    blankStepCountArray,
    setAreChordBeatsChecked,
    setChosenAPIChords,
    setChordInputStep,
    setHookTheoryChords
) => {
    const makeAreChordBeatsChecked = {}
    makeChordNotesState.forEach((num) => {
        makeAreChordBeatsChecked[`note-${num}`] = [...blankStepCountArray]
    })
    setAreChordBeatsChecked(makeAreChordBeatsChecked)
    setChosenAPIChords('')
    setChordInputStep(1)
    setHookTheoryChords([])
}
export const clearAreMelodyBeatsChecked = (
    makeMelodyNotesState,
    blankStepCountArray,
    setAreMelodyBeatsChecked
) => {
    const makeAreMelodyBeatsChecked = {}
    makeMelodyNotesState.forEach((num) => {
        makeAreMelodyBeatsChecked[`note-${num}`] = [...blankStepCountArray]
    })
    setAreMelodyBeatsChecked(makeAreMelodyBeatsChecked)
    console.log('set new melody beats')
}

export const makeNewChordMaster = (
    makeChordNotesState,
    areChordBeatsChecked,
    blankStepCountArray
) => {
    const newMaster = {}
    makeChordNotesState.forEach((note) => {
        newMaster[`${note}`] = areChordBeatsChecked[`${note}`]
        // this takes away if the new length is smaller
        while (newMaster[`${note}`].length > blankStepCountArray.length) {
            newMaster[`${note}`].pop()
        }

        // this puts more in if the new length is greater
        while (newMaster[`${note}`].length < blankStepCountArray.length) {
            newMaster[`${note}`].push(0)
        }
    })
    return newMaster
}

export const makeNewMelodyMaster = (
    makeMelodyNotesState,
    areMelodyBeatsChecked,
    blankStepCountArray
) => {
    const newMelodyMaster = {}
    makeMelodyNotesState.forEach((note) => {
        newMelodyMaster[`${note}`] = areMelodyBeatsChecked[`${note}`]
        // this takes away if the new length is smaller
        while (newMelodyMaster[`${note}`].length > blankStepCountArray.length) {
            newMelodyMaster[`${note}`].pop()
        }

        // this puts more in if the new length is greater
        while (newMelodyMaster[`${note}`].length < blankStepCountArray.length) {
            newMelodyMaster[`${note}`].push(0)
        }
    })
    return newMelodyMaster
}

export const loadChangedSongList = (
    songSavedOrDeleted,
    user,
    setLoadUserSongs,
    setSongSavedOrDeleted,
    handleLoadSongsFetch
) => {
    const newSongList = {}
    if (
        songSavedOrDeleted === 'Song saved!' ||
        songSavedOrDeleted === 'Song deleted!'
    ) {
        fetch(`/api/user-login/${user.sub}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data, 'loading user and songs')
                setLoadUserSongs(handleLoadSongsFetch(data.data))
            })
        setTimeout(() => {
            setSongSavedOrDeleted(false)
        }, 5000)
    }
    return newSongList
}

export const giveOctaveNumber = (note) => {
    // change numbers 8 and above into their equivalents in the octave below (e.g. 9 becomes 2)
    if (note > 14) {
        note = note - 14
    } else if (note > 7) {
        note = note - 7
    }
    return note
}

const makeDeepCopy = (areXBeatsChecked) => {
    const obj = {}
    Object.keys(areXBeatsChecked).forEach((note) => {
        const arr = []
        areXBeatsChecked[note].forEach((beat, index) => {
            arr.push(beat)
        })
        obj[note] = arr
    })
    return obj
}
export const handleNoteClick = (
    notesToPlay,
    setNotesToPlay,
    { beatNum, scaleIndex, whichGrid },
    setClickedNote
) => {
    console.log('we clicked  NOTeeeEEEEEEEEEE')
    const arrayKey = `note-${scaleIndex}`
    let obj = { ...notesToPlay }
    if (obj[`beat-${beatNum + 1}`][arrayKey]) {
        delete obj[`beat-${beatNum + 1}`][arrayKey][whichGrid]

        // ? couldn't figure out another way to validate obj[whichGrid][`beat-${beatNum+1}`]. even if it was an empty object, i couldn't test its equivalency at all at all
        if (Object.values(obj[`beat-${beatNum + 1}`][arrayKey]).length === 0) {
            delete obj[`beat-${beatNum + 1}`][arrayKey]
        }

        setNotesToPlay(obj)
        setClickedNote(null)
    } else {
        // obj[`beat-${beatNum}`] = {
        //     [arrayKey]: {
        //         [whichGrid]: 1,
        //         ...obj[`beat-${beatNum}`][arrayKey],
        //     },
        //     ...obj[`beat-${beatNum}`],
        // }
        obj[`beat-${beatNum + 1}`] = {
            [arrayKey]: {
                [whichGrid]: 1,
                ...obj[`beat-${beatNum + 1}`][arrayKey],
            },
            ...obj[`beat-${beatNum + 1}`],
        }
        // ? hopefully does something idfk
        setNotesToPlay(obj)
        setClickedNote(null)
    }
}

export const makeNotesToPlayMaster = (stepCount) => {
    const obj = {}
    console.log('makeNotesToPlayMaster')
    for (let i = 1; i <= stepCount; i++) {
        obj[`beat-${i}`] = {}
    }
    return obj
}

// export const bubbleUpCheckboxInfo = (beatNum, scaleIndex, whichGrid) => {
//     handleNoteClick(
//         beatNum,
//         scaleIndex,
//         whichGrid,
//         // ! gotta adapt away from areXChecked stuff
//         notesToPlay,
//         setNotesToPlay
//     )
// }
