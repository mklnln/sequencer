// ? trying to use useContext, i can only import those things inside of a custom hook or a react function component. otherwise, it may need to be tons of arguments passed to JS functions.

// ideally i can make things super pretty by having all the ugly shit over here. mb thats not realistic though. who knows.

export const generateAreBeatsCheckedInitialState = (
    makeChordNotesState,
    makeMelodyNotesState,
    blankStepCountArray,
    whichGrid
) => {
    const makeAreBeatsChecked = {}

    if (whichGrid === 'chords') {
        makeChordNotesState.forEach((num) => {
            makeAreBeatsChecked[`chord-${num}`] = blankStepCountArray
        })
        return makeAreBeatsChecked
    }
    if (whichGrid === 'melody') {
        makeMelodyNotesState.forEach((num) => {
            makeAreBeatsChecked[`${num}`] = blankStepCountArray
        })
        return makeAreBeatsChecked
    }
}

export const clearAreBeatsChecked = (
    makeChordNotesState,
    blankStepCountArray,
    setAreBeatsChecked,
    setChosenAPIChords,
    setChordInputStep,
    setHookTheoryChords
) => {
    const makeAreBeatsChecked = {}
    makeChordNotesState.forEach((num) => {
        makeAreBeatsChecked[`chord-${num}`] = blankStepCountArray
    })
    setAreBeatsChecked(makeAreBeatsChecked)
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
        makeAreMelodyBeatsChecked[num] = blankStepCountArray
    })
    setAreMelodyBeatsChecked(makeAreMelodyBeatsChecked)
}

export const makeNewChordMaster = (
    makeChordNotesState,
    areBeatsChecked,
    blankStepCountArray
) => {
    const newMaster = {}
    makeChordNotesState.forEach((note) => {
        newMaster[`chord-${note}`] = areBeatsChecked[`chord-${note}`]
        // this takes away if the new length is smaller
        while (newMaster[`chord-${note}`].length > blankStepCountArray.length) {
            newMaster[`chord-${note}`].pop()
        }

        // this puts more in if the new length is greater
        while (newMaster[`chord-${note}`].length < blankStepCountArray.length) {
            newMaster[`chord-${note}`].push(0)
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
        newMelodyMaster[note] = areMelodyBeatsChecked[note]
        // this takes away if the new length is smaller
        while (newMelodyMaster[note].length > blankStepCountArray.length) {
            newMelodyMaster[note].pop()
        }

        // this puts more in if the new length is greater
        while (newMelodyMaster[note].length < blankStepCountArray.length) {
            newMelodyMaster[note].push(0)
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
