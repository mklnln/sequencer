export const generateAreBeatsCheckedInitialState = (
  makeChordNotesState,
  makeMelodyNotesState,
  blankStepCountArray,
  whichGrid
) => {
  const makeAreBeatsChecked = {}

  if (whichGrid === "chords") {
    makeChordNotesState.forEach((num) => {
      makeAreBeatsChecked[`chord-${num}`] = blankStepCountArray
    })
    return makeAreBeatsChecked
  }
  if (whichGrid === "melody") {
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
  setChosenAPIChords("")
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
