import React, { Component } from "react";
import Checkbox from "./Checkbox";
import SoundEngine from "./SoundEngine";
// import useTimeout from "./useTimeout-hook";

const areBeatsChecked = [
  { 0: false },
  { 1: true },
  { 2: false },
  { 3: false },
  { 4: false },
  { 5: false },
  { 6: false },
  { 7: false },
];

// ? why tf do i want an object?

class Sequencer extends Component {
  // set defaults
  state = {
    beatsCheckboxes: areBeatsChecked,
    bpm: 60,
    currentBeat: 0,
    type: "sine",
    amtOfBeats: 8,
    playing: false,
  };

  play() {
    this.synth = new SoundEngine();
    const { bpm, notes, type, release, delay } = this.state;
    // todo set notes
    // const notesArray = Object.keys(notes).map((key) => notes[key]);

    this.setState(() => ({
      playing: true, // accessed via this.state.playing
    }));

    this.interval = setInterval(() => {
      // this.interval is a unique ID for the specific group of setIntervals thus created, so we can access it later and stop it
      // however, it doesn't just create one. it will trigger over and over at a specific interval
      // this.state.step cycles from 0 to 7
      // this.state.stepS us a constant at 8
      this.setState(
        (state) => ({
          currentBeat:
            state.currentBeat < state.amtOfBeats - 1
              ? state.currentBeat + 1
              : 0,
          // start, step = 0. stepS = 8
          // is 0 < 8 - 1 ?
          // if true, set step to state.step + 1
          // if false, set step to 0
        }),
        () => {
          // pads is an array that says 1 for a note to be played
          // pad refers to the beat, i refers to the note to be played. mb vice versa though

          const nextNotes = this.state.beatsCheckboxes
            // creates an array of notes at the specific step to send to the sound engine.
            .map((step) => {
              console.log(this.state.currentBeat);
              return step[this.state.currentBeat] === true;
            })
            .filter((beat) => {
              console.log(beat);
              return beat === true;
            });
          console.log(nextNotes);
          // .map((pad, i) => (pad === 1 ? notesArray[i] : null))
          // each pad's index is important as it correlates to a specific frequency in notesArray
          // .filter((x) => x);
          // filter only the values that arent null

          // sends the corresponding variables over to the this.synth created from Synth.js
          if (nextNotes.length > 0) {
            this.synth.playBeat(nextNotes, {
              bpm,
              type,
            });
          }
        }
      );
    }, (60 * 1000) / this.state.bpm / 2);
  }

  pause() {
    this.setState(() => ({
      playing: false,
      step: 0,
    }));

    clearInterval(this.interval);
  }

  toggleBeatCheckbox(beat) {
    // todo fuck this, gotta adapt it
    this.setState((state) => {
      // slice(0) just returns the whole thing unaffected
      const clonedPads = state.pads.slice(0);
      // define const as the specific note on the specific beat having been toggled
      const padState = clonedPads[group][pad];
      // reset all pads to 0
      clonedPads[group] = [0, 0, 0, 0, 0, 0, 0, 0];
      // the ternary operator just toggles the value, using padState as reference before the state was reset
      clonedPads[group][pad] = padState === 1 ? 0 : 1;
      // this resets all pads to clonedPads
      return {
        pads: clonedPads,
      };
    });
  }

  render() {
    const { pads, step, notes } = this.state;
    return (
      <div>
        jello werld
        <button
          onClick={() => {
            if (this.state.playing) {
              this.pause();
            } else {
              this.play();
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
          //   value={tempo}
          //   onInput={(e) => parseTempo(e)}
        />{" "}
        {/* <span>{tempo}</span> */}
        <section>
          {Object.keys(areBeatsChecked).map((beat) => {
            return (
              <Checkbox
                key={beat}
                string="hello"
                beat={beat}
                onClick={() => this.toggleBeatCheckbox(beat)}
                // areBeatsChecked={areBeatsChecked}
                // setAreBeatsChecked={setAreBeatsChecked}
              />
            );
          })}
        </section>
        <button onClick={() => console.log(areBeatsChecked)}>
          checked state
        </button>
      </div>
    );
  }
}
//
export default Sequencer;
