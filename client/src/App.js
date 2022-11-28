import { useEffect, useState, useRef } from "react";
import Checkbox from "./Checkbox";
import useTimeout from "./useTimeout-hook";
const audioContext = new AudioContext();
const App = () => {
  const [tempo, setTempo] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [nextBeatTime, setNextBeatTime] = useState(0);
  // const audioContext =
  const [triggerNextBeat, setTriggerNextBeat] = useState(false);
  // make some resoltuion
  const [resolution, setResolution] = useState(8);
  const [amtOfNotes, setAmtOfNotes] = useState(8);
  const [blankResolutionSteps, setBlankResolutionSteps] = useState([]);
  // these two blank arrays used to be inside generateAreBeats.. fyi in case something breaks
  const makeNotesState = [];
  const generateAreBeatsCheckedInitialState = () => {
    console.log("initializing master");
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
  const generateMakeNotesState = () => {
    const makeNotesState = [];
    // ! will all this break when i change these state variables outside of a useEffect?
    // ? will these for loops trigger every re-render? seems inefficient..
    for (let i = amtOfNotes; i > 0; i--) {
      makeNotesState.push(i);
    }
    return makeNotesState;
  };
  const [areBeatsChecked, setAreBeatsChecked] = useState(
    generateAreBeatsCheckedInitialState
  );
  // areBeatsChecked[0][0] refers to the top left
  // "" [7][7] "" bottom right
  // "" [0][7] top right
  // "" [7][0] bottom left
  // ? considering how to lay it out, it's tempting to do so where the below is the same as the FE. it might be a PITA to set up tho
  // ? can i set it up as an object where beatschecked is [8:{[1,0,1,1,0etc]}, 7:{[1,0,8,6]}]
  // todo generate the below object dependent on state "resolution"
  // * wanna make sure that i set this up for the last time. object keys will be roman numeral chords, length of array is resolution

  // ` areBeatsChecked should now look like this
  // i put chord-${num} so that it wouldn't console log back in ascending numerical order. it still does, though...
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
  //
  // areBeatsCheckedArray is basically serving as Object.keys of our grand areBeatsChecked reference object. the numbers should be unchanging as long as amtOfNotes stays the same
  const [areBeatsCheckedArray, setAreBeatsCheckedArray] = useState(
    generateMakeNotesState
  );
  // select dropdown choose amt resolution, 16 stesp, 32
  // test synth, it works, but only once
  // must recreate node with each note.
  // thus we call playBeat and use it to create a new oscillator each time
  const playBeat = (index) => {
    // ! ideally we're not making a new context every time, but for some reason keeping this outside of playBeat scope means that currentTime counts down and eventually makes the audiocontext stop working.
    // if index = 0, no need to multiply
    // if index = 1, then multiply by 1
    // if index = 1, then multiply by 2/12
    const rootFrequency = 440;
    // todo change rootfreq to reflect key, mb set to state variable from drop-down on FE, C C# D D# etc
    // !
    // todo change index into chromatic scale degrees. if index = 1, make it scale degree 0. 2, degree 2
    // ? this could be a state KEY as in major, minor, harmonic minor
    const note = rootFrequency * 2 ** (parseInt(index) / 12);
    console.log(2 ** parseInt(index));
    console.log(note);
    // 440 is just a placehodlder thats going to C, D# or
    // octave / 12 = chromatic scale
    // major 1, 3, 5, 6, 8, 10, 11, 12
    // hard code skipping notes to create major scale
    console.log(note, "play this hz");
    // todo different note
    const tone = audioContext.createOscillator();
    const now = audioContext.currentTime;
    const randomFreq = Math.random() * 500 + 100;
    tone.frequency.value = note; // (1.1/12) 1.075*
    tone.type = "sine";
    const synthGain = audioContext.createGain();
    // shape the ADSR (attack, decay, sustain, release) envelope of the sound
    // todo could easily set ADSR in FE as state variables
    // todo filter, wave, etc
    const attackTime = 0.005;
    const decayTime = 0.3;
    const sustainLevel = 0.0;
    const releaseTime = 0.0;
    const duration = 1;
    synthGain.gain.setValueAtTime(0, 0);
    // increase or decrease gain based on the above ADSR values
    synthGain.gain.linearRampToValueAtTime(0.3, now + attackTime);
    synthGain.gain.linearRampToValueAtTime(
      sustainLevel,
      now + attackTime + decayTime
    );
    synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
    synthGain.gain.linearRampToValueAtTime(0, now + duration);
    tone.connect(synthGain);
    synthGain.connect(audioContext.destination);
    tone.start();
    // const stopBeat = () => {};
    setTimeout(() => {}, 500);
    // tone.stop(time + 100); // 100 milliseconds?
  };
  // ! this will maybe break when the tempo is set too high. there are notes on this in the tale of two clocks article.
  const lookahead = 25.0; // calls scheduling fxn (in milliseconds)
  const scheduleAheadTime = 0.1; // how far ahead the scheduling fxn will schedule audio (in seconds)
  // ! this will maybe break when the tempo is set too high. there are notes on this in the tale of two clocks article.
  const parseTempo = (e) => {
    setTempo(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    setTriggerNextBeat(false);
    // const secondsPerBeat = 60.0 / tempo; // good
    // setNextBeatTime(nextBeatTime + secondsPerBeat);
    // // todo need to ask each item in the areBeatsChecked array if its item at index currentBeat is 1
    // areBeatsChecked.forEach((noteRow, index) => {
    //   // chord array
    //   if (noteRow[currentBeat - 1] === 1) {
    //     playBeat(index);
    //   }
    // });
  }, [triggerNextBeat, currentBeat]);

  const nextBeat = () => {
    // const secondsPerBeat = 60.0 / tempo; // good
    // setNextBeatTime(nextBeatTime + secondsPerBeat);
    // setCurrentBeat((currentBeat + 1) % 4);
    // where 4 is our # beats in the sequencer
    // ` currentBeat = (currentBeat + 1) % 4
    // ` pink is old code. new setState may not give me 1->16
    // add 1, but reset to 0 any multiple of 4, i.e. we keep 4/4 time
    // todo switch to 16 for 16th note resolution
  };

  // * this array is for visual purposes. try state though?
  const notesInQueue = [];
  const scheduleBeat = (beatNumber, time) => {
    notesInQueue.push({ note: beatNumber, time });
    if (areBeatsChecked[beatNumber] === true) {
      playBeat();
      // send index of the note
    }
  };

  let timerID;
  // ! scheduler may just work turning into a useEffect and dependent on state isPlaying set by clicking start
  useEffect(() => {
    // if (audioContext.state === "suspended") {
    //   // web etiquette mandates that the user must interact with the page before hearing sound
    //   audioContext.resume();
    // }
    const interval = setInterval(() => {
      //   if (playing){
      // currentBeat <= 0 || currentBeat >= 4 // ` was set to 16, this is part of resolution
      // ? setCurrentBeat(1)
      // : setCurrentBeat(currentBeat + 1);
      //while there are unscheduled notes within the present interval, schedule them and advance the pointer...
      // while (nextBeatTime < audioContext.currentTime + scheduleAheadTime) {
      if (playing) {
        currentBeat <= 0 || currentBeat >= 8 // ` was set to 16, this is part of resolution
          ? setCurrentBeat(1)
          : setCurrentBeat(currentBeat + 1);
        scheduleBeat(currentBeat, nextBeatTime);
        setTriggerNextBeat(true);
        // }
      }
      // ! the below was taken from a useEffect specifically set up to just follow line 134. consider erasing
      const secondsPerBeat = 60.0 / tempo; // good
      setNextBeatTime(nextBeatTime + secondsPerBeat);
      // todo need to ask each item in the areBeatsChecked array if its item at index currentBeat is 1
      areBeatsCheckedArray.forEach((noteRow, index) => {
        // chord array, either I ii iii, etc
        if (areBeatsChecked[`chord-${noteRow}`][currentBeat - 1] === 1) {
          // need to invert index to reflect the scale degree, i.e. index 0 should be scale degree 8.
          // length - index? 8-0 = 8. 8-1 = 7. perfect
          playBeat(areBeatsCheckedArray.length - index);
        }
      });
    }, (1000 / tempo) * 15); // ! not sure what 15 means, but this does mean that the interval gets constantly set and cleared
    return () => clearInterval(interval);
  }, [playing, currentBeat]);

  const handleBeatCheckbox = (chordIndex, beatIndex, checked) => {
    const chordShortcut = `chord-${chordIndex}`;
    const arrayReplacement = [];
    blankResolutionSteps.forEach((step, index) => {
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
    // }
  };
  console.log(areBeatsChecked);
  return (
    <div>
      jello werld
      <button
        onClick={() => {
          if (!playing) {
            console.log("play");
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
      <input
        type="range"
        min="30.0"
        max="160.0"
        step="1"
        value={tempo}
        onInput={(e) => parseTempo(e)}
      />{" "}
      <span>{tempo}</span>
      <section>
        {
          // can't map an object
          areBeatsCheckedArray.map((chord) => {
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
      </section>
      <button
        onClick={() => {
          console.log(playing);
          console.log(areBeatsChecked);
        }}
      >
        checked state
      </button>
    </div>
  );
};

export default App;
