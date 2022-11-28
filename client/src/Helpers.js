import { useContext } from "react";
import { MusicParametersContext } from "./App";

export const GenerateAreBeatsCheckedInitialState = () => {
  const makeNotesState = [];
  const { amtOfNotes } = useContext(MusicParametersContext);
  console.log("initializing master");
  console.log(amtOfNotes);
  // ! will all this break when i change these state variables outside of a useEffect?
  // ? will these for loops trigger every re-render? seems inefficient..
  for (let i = amtOfNotes; i > 0; i--) {
    makeNotesState.push(i);
  }
  const blankResolutionArray = [];
  for (let i = resolution; i > 0; i--) {
    blankResolutionArray.push(0);
  }
  setBlankResolutionSteps(blankResolutionArray);
  console.log(blankResolutionSteps);
  const makeAreBeatsChecked = {};
  makeNotesState.forEach((num) => {
    console.log(num);
    // 8,7,6,5,...
    // nest forEach to get the appropriate amt of resol'tn steps

    makeAreBeatsChecked[`chord-${num}`] = blankResolutionArray;
  });
  return makeAreBeatsChecked;
};

export const generateMakeNotesState = () => {
  const makeNotesState = [];
  // ! will all this break when i change these state variables outside of a useEffect?
  // ? will these for loops trigger every re-render? seems inefficient..
  for (let i = amtOfNotes; i > 0; i--) {
    makeNotesState.push(i);
  }
  return makeNotesState;
};
