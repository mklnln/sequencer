import { useContext, useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import { MusicParametersContext } from "./App.js";
import { generateAreBeatsCheckedInitialState } from "./Helpers";
import { PlayBeatChord } from "./AudioEngine.js";
import styled from "styled-components";
// const audioContext = new AudioContext();
const Sequencer = () => {
  const [tempo, setTempo] = useState(150);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [nextBeatTime, setNextBeatTime] = useState(0);
  const [amtOfNotes, setAmtOfNotes] = useState(8); // amt of chords, i.e. how many ROWS are there
  const [stepCount, setStepCount] = useState(32); // amt of steps, i.e. how many COLUMNS are there

  const makeNotesState = [];
  for (let i = amtOfNotes; i > 0; i--) {
    makeNotesState.push(i);
  }
  const blankStepCountArray = [];
  for (let i = stepCount; i > 0; i--) {
    blankStepCountArray.push(0);
  }
  const [areBeatsChecked, setAreBeatsChecked] = useState(
    generateAreBeatsCheckedInitialState(makeNotesState, blankStepCountArray)
  );
  // this is the proper format of the master reference of notes areBeatsChecked. the amtOfNotes would be 8
  // {
  // chord-8: [1, 0, 0, 0, 0, 0, 0, 1],
  // chord-7: [0, 1, 0, 0, 0, 0, 0, 0],
  // chord-6: [0, 0, 0, 0, 0, 0, 0, 0],
  // chord-5: [0, 0, 0, 0, 0, 1, 0, 0],
  // chord-4: [0, 0, 0, 0, 0, 0, 0, 0],
  // chord-3: [0, 0, 0, 0, 0, 0, 0, 0],
  // chord-2: [0, 0, 0, 0, 0, 0, 0, 0],
  // chord-1: [0, 0, 0, 1, 0, 0, 0, 0],
  // }
  const parseTempo = (e) => {
    setTempo(parseInt(e.target.value, 10));
  };

  // * this array is for visual purposes. try state though?
  const notesInQueue = [];
  const scheduleBeat = (beatNumber, time) => {
    notesInQueue.push({ note: beatNumber, time });
  };

  const secondsPerBeat = 60.0 / tempo;
  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        currentBeat <= 0 || currentBeat >= stepCount
          ? setCurrentBeat(1)
          : setCurrentBeat(currentBeat + 1);
        scheduleBeat(currentBeat, nextBeatTime); // todo needed for visual
      } else {
        setCurrentBeat(1); // ! this resets the playback to the beginning. remove to just make it a pause button.
      }
      setNextBeatTime(nextBeatTime + secondsPerBeat); // todo need for visual
      makeNotesState.forEach((noteRow, index) => {
        if (
          areBeatsChecked[`chord-${noteRow}`][currentBeat - 1] === 1 &&
          playing
        ) {
          PlayBeatChord(makeNotesState.length - index, playing);
        }
      });
    }, (secondsPerBeat * 1000) / 2);
    // ! even set manually at 1000ms (i.e. one second), this will oscillate in and out of rhythm with a clock ticking each second. the 2 refers to how many subdivisions a quarter note gives. our stepCount is 8th notes.
    return () => clearInterval(interval);
  }, [playing, currentBeat]);

  const handleBeatCheckbox = (chordIndex, beatIndex, checked) => {
    const chordShortcut = `chord-${chordIndex}`;
    const arrayReplacement = [];
    blankStepCountArray.forEach((step, index) => {
      if (beatIndex !== index) {
        arrayReplacement.push(areBeatsChecked[`chord-${chordIndex}`][index]);
      } else {
        arrayReplacement.push(checked ? 0 : 1);
      }
    });
    setAreBeatsChecked({
      ...areBeatsChecked,
      [chordShortcut]: [...arrayReplacement],
    });
  };

  return (
    <MainDiv>
      jello werld
      <button
        onClick={() => {
          if (!playing) {
            setPlaying(true);
          } else {
            setPlaying(false);
          }
        }}
      >
        start/stop
      </button>
      {/* <button onClick={() => synth.stop()}>stop synth</button> */}
      <span>Tempo</span>
      <ParameterKnob
        type="range"
        min="30.0"
        max="300.0"
        step="1"
        value={tempo}
        onInput={(e) => parseTempo(e)}
      />{" "}
      <span>{tempo}</span>
      <ToggleNotes>
        {
          // can't map an object
          makeNotesState.map((chord) => {
            // this first map with a div controls the note over time, i.e. the row
            const chordIndex = chord;
            return (
              <div key={`row-${chordIndex}`}>
                {areBeatsChecked[`chord-${chordIndex}`].map((check, index) => {
                  return (
                    <Checkbox
                      key={`row-${chordIndex}-beat-${index}`}
                      chord={chord}
                      areBeatsChecked={areBeatsChecked}
                      beatIndex={index}
                      chordIndex={chordIndex}
                      handleBeatCheckbox={handleBeatCheckbox}
                    />
                  );
                })}
              </div>
            );
          })
        }
      </ToggleNotes>
      <button
        onClick={() => {
          console.log(playing);
          console.log(areBeatsChecked);
        }}
      >
        checked state
      </button>
    </MainDiv>
  );
};

export default Sequencer;
const ParameterKnob = styled.input`
  border: 1px solid fuchsia;
`;

const MainDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleNotes = styled.section`
  border: 1px solid fuchsia;
`;
