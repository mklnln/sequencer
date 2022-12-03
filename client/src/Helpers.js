import {useContext} from "react"
import {MusicParametersContext} from "./App"

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
  setAreBeatsChecked
) => {
  const makeAreBeatsChecked = {}
  makeChordNotesState.forEach((num) => {
    makeAreBeatsChecked[`chord-${num}`] = blankStepCountArray
  })
  setAreBeatsChecked(makeAreBeatsChecked)
}
