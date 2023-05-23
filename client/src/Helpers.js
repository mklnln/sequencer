// ? trying to use useContext, i can only import those things inside of a custom hook or a react function component. otherwise, it may need to be tons of arguments passed to JS functions.

export const generateAreChordBeatsCheckedInitialState = (
    makeChordNotesState,
    makeMelodyNotesState,
    blankStepCountArray,
    whichGrid
) => {
    const makeAreChordBeatsChecked = {}
    // DRYDRYDRY
    // TODO refactor and only pass in one of the makeXNotesState, no need to check chords/melody
    // ! did        makeAreChordBeatsChecked[`note-${num}`].push(0) because using blankstepcountarray caused problems with spread operator down the road, each array used the same reference and so a change to one lead to a change to all
    let amtOfArraysToMake

    whichGrid === 'chords'
        ? (amtOfArraysToMake = makeChordNotesState)
        : (amtOfArraysToMake = makeMelodyNotesState)
    // if (whichGrid === 'chords') {
    //     amtOfArraysToMake = makeChordNotesState
    // } else {
    //     amtOfArraysToMake = makeMelodyNotesState
    // }
    amtOfArraysToMake.forEach((num) => {
        makeAreChordBeatsChecked[`note-${num}`] = []
        blankStepCountArray.forEach((step) => {
            makeAreChordBeatsChecked[`note-${num}`].push(0)
        })
    })
    return makeAreChordBeatsChecked
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
        newMaster[`note-${note}`] = areChordBeatsChecked[`note-${note}`]
        // this takes away if the new length is smaller
        while (newMaster[`note-${note}`].length > blankStepCountArray.length) {
            newMaster[`note-${note}`].pop()
        }

        // this puts more in if the new length is greater
        while (newMaster[`note-${note}`].length < blankStepCountArray.length) {
            newMaster[`note-${note}`].push(0)
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
        newMelodyMaster[`note-${note}`] = areMelodyBeatsChecked[`note-${note}`]
        // this takes away if the new length is smaller
        while (
            newMelodyMaster[`note-${note}`].length > blankStepCountArray.length
        ) {
            newMelodyMaster[`note-${note}`].pop()
        }

        // this puts more in if the new length is greater
        while (
            newMelodyMaster[`note-${note}`].length < blankStepCountArray.length
        ) {
            newMelodyMaster[`note-${note}`].push(0)
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
        areXBeatsChecked[note].forEach((beat) => {
            arr.push(beat)
        })
        obj[note] = arr
    })
    return obj
}
export const handleCheckbox = (
    noteIndex,
    beatIndex,
    areXBeatsChecked,
    setAreXBeatsChecked,
    type
) => {
    console.log(areXBeatsChecked, 'before ANYTHING')
    const arrayKey = `note-${noteIndex}`
    // const checkboxObjCopy = { ...areXBeatsChecked } // ! makes a shallow copy
    const checkboxObjCopy = makeDeepCopy(areXBeatsChecked)

    checkboxObjCopy[arrayKey][beatIndex] = checkboxObjCopy[arrayKey][beatIndex] // toggle  the value
        ? 0
        : 1

    setAreXBeatsChecked(checkboxObjCopy)
    // ! how tf does this work?? it doesnt return anything! it just makes a copy of an object
    // i suppose that a copy is being made of the original and now the new one points to it
    // toggling the value to a string 'hi' will make that string show up in the console.logs before it should..
}
