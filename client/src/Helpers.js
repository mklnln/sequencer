import { useContext } from "react";
import { MusicParametersContext } from "./App";

export const generateAreBeatsCheckedInitialState = (
  makeNotesState,
  blankStepCountArray
) => {
  const makeAreBeatsChecked = {};
  makeNotesState.forEach((num) => {
    makeAreBeatsChecked[`chord-${num}`] = blankStepCountArray;
  });
  return makeAreBeatsChecked;
};

export const clearAreBeatsChecked = (
  makeNotesState,
  blankStepCountArray,
  setAreBeatsChecked
) => {
  const makeAreBeatsChecked = {};
  makeNotesState.forEach((num) => {
    makeAreBeatsChecked[`chord-${num}`] = blankStepCountArray;
  });
  setAreBeatsChecked(makeAreBeatsChecked);
};
