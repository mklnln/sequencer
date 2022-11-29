import { useContext, useEffect, useState } from "react";
import Checkbox from "./Components.js/Checkbox";
import { MusicParametersContext } from "./App.js";
import {
  clearAreBeatsChecked,
  generateAreBeatsCheckedInitialState,
} from "./Helpers";
import { PlayBeatChord } from "./AudioEngine.js";
import styled from "styled-components";
import StartingChordButton from "./Components.js/StartingChordButton";
import RemoveChordButton from "./RemoveChordButton";
// const audioContext = new AudioContext();
const Sequencer = () => {
  const [tempo, setTempo] = useState(150);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [nextBeatTime, setNextBeatTime] = useState(0);
  const [amtOfNotes, setAmtOfNotes] = useState(8); // amt of chords, i.e. how many ROWS are there
  const [stepCount, setStepCount] = useState(32); // amt of steps, i.e. how many COLUMNS are there
  const [chordInputStep, setChordInputStep] = useState(1);
  const [buttonsPushed, setButtonsPushed] = useState(0);
  const [startingChords, setStartingChords] = useState(null);
  const [chosenAPIChords, setChosenAPIChords] = useState([]);
  const romanNumeralReference = {
    major: {
      1: "I",
      2: "ii",
      3: "iii",
      4: "IV",
      5: "V",
      6: "vi",
      7: "vii",
      8: "I",
    },
  };
  const makeNotesState = [];
  // [8,7,6,5,4,3,2,1] where amtofnotes = 8
  for (let i = amtOfNotes; i > 0; i--) {
    makeNotesState.push(i);
  }
  const blankStepCountArray = [];
  // [0,0,0,0,0,0,0,0] where stepCount = 8
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

  const handleChordClick = (chordID, index) => {
    let newChosenAPIChords = [...chosenAPIChords];
    newChosenAPIChords.push(chordID);
    setChosenAPIChords(newChosenAPIChords);
    const chordShortcut = `chord-${chordID}`;
    const arrayReplacement = [];
    blankStepCountArray.forEach((step, index) => {
      if (
        index + 1 === chordInputStep ||
        index + 1 === chordInputStep + 1 ||
        index + 1 === chordInputStep + 2 ||
        index + 1 === chordInputStep + 3
      ) {
        arrayReplacement.push(1);
      } else {
        arrayReplacement.push(areBeatsChecked[`chord-${chordID}`][index]);
      }
    });

    if (arrayReplacement.length === stepCount) {
      setAreBeatsChecked({
        ...areBeatsChecked,
        [chordShortcut]: [...arrayReplacement],
      });

      setChordInputStep((chordInputStep) => chordInputStep + 4);
    }
  };

  const handleChordRemove = (chordAtStep, chordID) => {
    const arrayReplacement = [];
    const chordShortcut = `chord-${chosenAPIChords[chordID]}`;
    const removeAtStep = (chordAtStep - 1) * 4 + 1;
    blankStepCountArray.forEach((step, index) => {
      if (
        index + 1 === removeAtStep ||
        index + 1 === removeAtStep + 1 ||
        index + 1 === removeAtStep + 2 ||
        index + 1 === removeAtStep + 3
      ) {
        arrayReplacement.push(0);
      } else {
        arrayReplacement.push(
          areBeatsChecked[`chord-${chosenAPIChords[chordID]}`][index]
        );
      }
      console.log(chordID);
      console.log(arrayReplacement);
    });
    if (arrayReplacement.length === stepCount) {
      setAreBeatsChecked({
        ...areBeatsChecked,
        [chordShortcut]: [...arrayReplacement],
      });
    }
  };

  useEffect(() => {
    fetch("https://api.hooktheory.com/v1/trends/nodes", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer 6253102743c64eb2313c2c56d40bf6a6",
      },
      // body: JSON.stringify({ order: formData }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStartingChords(data.slice(0, 4)); // slice takes only the first 4 array items
      })
      .catch((error) => {
        window.alert(error);
      });
  }, []);

  // ! this renders a few times before fulfilling the intended functionality. trying it in other ways yields absurd amounts of re-renders. it seems wonky to re-render 3-4 times.. but it works? so...
  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true);
  }, [playing]);

  useEffect(() => {
    if (chordInputStep > stepCount) setChordInputStep(1);
  }, [chordInputStep]);

  const detectKeyDown = (e) => {
    if (e.key === "s") {
      setPlaying(!playing);
    }
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
      <SequencerGrid>
        {
          // can't map an object
          makeNotesState.map((chord, notesIndex) => {
            // this first map with a div controls the note over time, i.e. the row
            const chordIndex = chord;
            return (
              <ChordDiv key={`row-${chordIndex}`}>
                <TitleDiv>
                  <ChordTitle>
                    {romanNumeralReference["major"][chordIndex]}
                  </ChordTitle>
                </TitleDiv>
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
                  // }
                })}
              </ChordDiv>
            );
          })
        }
        <PointerContainer>
          // todo import as a component cuz dis ugly af
          https://blog.logrocket.com/how-to-use-svgs-in-react/
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="128.000000pt"
            height="459.900000pt"
            viewBox="0 0 128.000000 459.900000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.16, written by Peter Selinger 2001-2019
            </metadata>
            <g
              transform="translate(0.000000,459.900000) scale(0.010000,-0.010000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M11990 45579 c-1134 -32 -2101 -129 -2895 -290 -2332 -471 -3603
-1527 -4219 -3504 -240 -768 -386 -1709 -446 -2860 -27 -527 -30 -999 -30
-5390 0 -4922 -3 -5241 -50 -5895 -61 -831 -190 -1477 -402 -2010 -424 -1064
-1238 -1778 -2623 -2300 -381 -143 -729 -250 -1277 -391 l-38 -10 0 -59 0 -59
38 -10 c1470 -379 2421 -835 3078 -1478 783 -765 1145 -1787 1239 -3493 8
-151 17 -311 20 -355 3 -44 10 -2456 14 -5360 6 -3657 11 -5334 19 -5455 19
-301 32 -479 48 -655 251 -2818 1244 -4405 3266 -5221 1064 -429 2448 -663
4348 -733 l225 -9 57 56 c32 31 56 58 53 60 -2 2 -106 21 -230 42 -2007 339
-3306 1011 -4102 2121 -432 603 -722 1337 -897 2269 -83 442 -129 850 -178
1575 -8 122 -13 1652 -18 5410 -7 5207 -8 5347 -40 5900 -72 1218 -265 2084
-625 2800 -282 561 -654 1006 -1160 1385 -633 475 -1501 849 -2561 1106 -104
25 -197 47 -206 50 -14 4 -18 16 -18 54 0 56 -25 44 200 100 744 186 1454 457
1980 758 1234 706 1914 1694 2214 3221 105 529 158 1046 198 1906 8 176 13
1748 18 5335 5 3678 10 5132 18 5255 75 1103 197 1809 433 2520 161 485 415
996 680 1368 242 338 549 659 877 914 787 614 1882 1021 3212 1193 241 31 224
21 154 91 -43 44 -65 59 -84 57 -14 0 -144 -5 -290 -9z"
              />
            </g>
          </svg>
        </PointerContainer>
        <RemoveButtonsDiv>
          {blankStepCountArray.slice(0, 4).map((step, index) => {
            return (
              <RemoveChordButton
                key={`removebutton${Math.random()}`}
                index={index}
                handleChordRemove={handleChordRemove}
              />
            );
          })}
        </RemoveButtonsDiv>
      </SequencerGrid>
      <HookTheoryChords>
        {startingChords ? (
          startingChords.map((chord, index) => {
            return (
              <StartingChordButton
                key={chord.chord_ID}
                chord={chord}
                handleChordClick={handleChordClick}
                chordInputStep={chordInputStep}
                index={index}
              />
            );
          })
        ) : (
          <>loading chords...</>
        )}
      </HookTheoryChords>
      <button
        onClick={() => {
          console.log(playing);
          console.log(areBeatsChecked);
        }}
      >
        see checked boxes
      </button>
      <button
        onClick={() => {
          console.log(makeNotesState);
          clearAreBeatsChecked(
            makeNotesState,
            blankStepCountArray,
            setAreBeatsChecked
          );
        }}
      >
        reset checked boxes
      </button>
    </MainDiv>
  );
};

export default Sequencer;
const ParameterKnob = styled.input`
  border: 1px solid fuchsia;
`;

const MainDiv = styled.div``;

const SequencerGrid = styled.section`
  padding: 20px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid fuchsia;
`;

const ChordDiv = styled.div`
  position: relative;
  right: 17px;
`;

const TitleDiv = styled.div`
  display: inline;
  width: 25px;
  display: inline-block;
  justify-content: center;
  padding-right: 8px;
`;

const ChordTitle = styled.span`
  position: relative;
  top: -8px;
  vertical-align: middle;
  text-align: left;
`;

const HookTheoryChords = styled.div`
  height: 50px;
  margin: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RemoveButtonsDiv = styled.div`
  display: flex;
  padding: 10px 0 0 0;
  justify-content: center;
  align-items: center;
`;

const PointerContainer = styled.div`
  width: calc(100% - 40px);
  height: 30px;
`;

const Pointer = styled.img`
  border: 1px solid fuchsia;
  height: 20px;
  width: 25%;
  position: relative;
  left: 50%;
`;
