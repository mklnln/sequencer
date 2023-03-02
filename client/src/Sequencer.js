import {useContext, useEffect, useRef, useState} from "react"
import Checkbox from "./Components/Checkbox"
import {MusicParametersContext} from "./App.js"
import {generateAreBeatsCheckedInitialState} from "./Helpers"
import {playSample, playSynth} from "./AudioEngine.js"
import styled from "styled-components"
import HookTheoryChordButton from "./Components/HookTheoryChordButton"
import Parameters from "./Components/Parameters"
import {useAuth0} from "@auth0/auth0-react"
import MelodyCheckbox from "./Components/MelodyCheckbox"
const Sequencer = () => {
  const {
    audioContext,
    playing,
    setPlaying,
    tempo,
    setTempo,
    stepCount,
    setStepCount,
    rootNote,
    setRootNote,
    wonkFactor,
    setWonkFactor,
    chordInputStep,
    setChordInputStep,
    loadUserSongs,
    setLoadUserSongs,
    melodyVolume,
    chordsVolume,
    sound,
    filterCutoff,
    attack,
    decay,
    sustain,
    release,
    setMelodyVolume,
    setChordsVolume,
    setSound,
    setFilterCutoff,
    setAttack,
    setDecay,
    setSustain,
    setRelease,
    songSaved,
    setSongSaved,
    songDeleted,
    setSongDeleted,
    handleLoadSongsFetch,
    loadSong,
    setLoadSong,
    setSongName,
    areBeatsChecked,
    setAreBeatsChecked,
    areMelodyBeatsChecked,
    setAreMelodyBeatsChecked,
    makeChordNotesState,
    makeMelodyNotesState,
    blankStepCountArray,
    chosenAPIChords,
    setChosenAPIChords,
    hookTheoryChords,
    setHookTheoryChords,
  } = useContext(MusicParametersContext)
  const {user} = useAuth0()

  const [currentBeat, setCurrentBeat] = useState(0)
  const [nextNoteTime, setNextNoteTime] = useState(0)
  const [notesToBePlayed, setNotesToBePlayed] = useState({})
  const [calcTime, setCalcTime] = useState(0)

  // const [stepCount, setStepCount] = useState(16) // amt of steps, i.e. how many COLUMNS are there
  // 1 pointer width covers 2 steps, or 1/4 of 8. set to 2 for 16, 3 for 32
  // ! don't forget to also set

  const [pointerWidth, setPointerWidth] = useState(2)

  const [buttonsPushed, setButtonsPushed] = useState(0)

  const [userIsTyping, setUserIsTyping] = useState(false)

  const playingRef = useRef(playing)
  const currentBeatRef = useRef(currentBeat)
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
  }

  const milliSecondsPerBeat = ((60 / tempo / 2) * 1000) / 10

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

  // * this array is for visual purposes. try state though?
  const notesInQueue = []
  const scheduleBeat = (beatNumber, time) => {
    notesInQueue.push({note: beatNumber, time})
  }
  const secondsPerBeat = 30 / tempo // 120 because with 60 bpm, we set resolution to 1/8th notes
  // 30 / 60 = 0.5s
  // 30 / 120 = 0.25s
  // 30 / 240 = 0.125s

  // secondsPerBeat should be inversely proportional to the tempo, i.e. gets smaller as tempo increases.
  // ?
  // how do we math into seconds per bpm? beats per minute. divided by 60, thats beats per second.
  // 120bpm / 60 = 2 beats per second.
  // want ms? need to divide further, so by 2000 in total
  // 120 / 60000 = 0.002 beats per ms
  // audioContext.currentTime gives seconds but to 16 decimals of precision i.e. 1.3893333333333333s
  // ? is beat a quarter note or eighth? cuz my resolution is 8th seemingly. mb just leave bpm quarter but behind the scenes i call it 8th

  // * a tale of two clocks
  // setTimeout looks ahead and finds if any notes are due to be played
  // ? math'ly, what does that look like?
  // ? startTime + secondsPerBeat.
  // okay if its delayed because it looks at an interval of time in the future
  // it schedules web audio events in the future
  // "The setTimeout timer basically just checks to see if any notes are going to need to be scheduled “soon” based on the current tempo, and then schedules them"
  // the setTimeout plays any notes that need to be played now as well as in its future interval
  // How much the lookahead overlaps with the next interval’s start time is determines how resilient your app will be across different machines, and as it becomes more complex (and layout and garbage collection may take longer).
  //  resilient to slower machines and operating systems, it’s best to have a large overall lookahead and a reasonably short interval
  //
  //
  // while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
  //   scheduleNote( current16thNote, nextNoteTime );
  //   nextNote();
  // }
  // ? need fxn nextNote that will change the time value of nextNoteTime such that the while condition evaluates true if any notes are to be scheduled
  // ? scheduleNote sends the appropriate time to the AudioEngine. not sure what current16thNote is for

  // * lookahead is the amt of the future interval
  // * timeout interval is how often the setTimeout is called with its lookahead
  // * A good place to start is probably 100ms of “lookahead” time, with intervals set to 25ms.

  const scheduleAheadTime = 100 // ms? idk
  const contextTime = audioContext.currentTime
  let notesToBePlayedObj = {}
  useEffect(() => {
    // this useEffect creates an object of arrays containing the melody notes to be played
    for (let i = 0; i < stepCount; i++) {
      // need to check first index of all note arrays separately, checking every column along X-axis
      const notesOfSameBeat = []
      for (let j = 15; j >= 1; j--) {
        // checking every row along Y-axis
        if (areMelodyBeatsChecked[j][i] === 1) {
          notesOfSameBeat.push(j)
          notesToBePlayedObj = {
            ...notesToBePlayedObj,
            [`beat${i + 1}`]: [...notesOfSameBeat],
          }
        }
      }
    }
    setNotesToBePlayed(notesToBePlayedObj)
    console.log(notesToBePlayedObj)
  }, [tempo, areMelodyBeatsChecked])
  useEffect(() => {
    setNextNoteTime(0)
  }, [areMelodyBeatsChecked, areBeatsChecked, playing])

  useEffect(() => {
    // ! mb prefer setTimeout? if the useEffect gets called every time, a new interval will be made and may consistently keep going, looping over and over on itself.
    // this useEffect is called for every single beat
    // currentNoteStartTime keeps counting up
    // audioContext.currentTime resets
    // i think we need this useEffect in audioEngine.js
    // reason being we need audioContext.currentTime while scheduling, i.e. before sending notes over to the engine.
    // mb we can share the audioContext between files?
    setTimeout(() => {
      // * a tale of two clocks
      // Chris: I’m not keeping track of “sequence time” - that is, time since the beginning of starting the metronome. All we have to do is remember when we played the last note, and figure out when the next note is scheduled to play.
      // e.g. fxn nextNote = const secondsPerBeat = 60/tempo, nextNoteTime += 0.25 *secondsPerBeat (1/4 note resolution)
      // if you calculate next beat time for each note, you don't have to worry about keeping track of global time, only need nextNoteTime

      currentBeatRef.current = currentBeat
      // setNextBeatTime(nextNoteTime + secondsPerBeat) // todo need for visual

      // todo kek this is not it
      const currentNoteStartTime = nextNoteTime

      // while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
      //   scheduleNote( current16thNote, nextNoteTime );
      //   nextNote();
      // }

      console.log(
        `is ${calcTime} < ${contextTime} + ${scheduleAheadTime / 1000} ? === `,
        calcTime < contextTime + scheduleAheadTime / 1000
      )

      // * nextNoteTime must be turned into a calculation based off of what notes are to be scheduled based off of the 'areMelodyBeatsChecked' array of arrays.

      // note at beat 1 should play at time = 0 seconds
      // note at beat 2 should play at time = (secondsPerBeat * 1) seconds
      // this is true while currentBeat is at 1, i.e. the beginning
      // eventually need to make nextNoteTime greater than contextTime & scheduleAhead so that whole thing can be an if else, the else advancing currentBeat.
      // in other words, we need to do one of two things: schedule a note to be played if nextNoteTime is < blabla, or advance currentBeat
      // at the moment, nextNoteTime is not set to anything
      // set nextBeat after scheduling a note
      console.log(calcTime, "time")
      //!  experimenting with calcTime, trying to avoid useState
      if (calcTime < contextTime + scheduleAheadTime / 1000) {
        // scheduleNote(current16thNote, nextNoteTime)
        // nextNote()

        // todo i've already checked to see if a note is played, so we just need to send the scale degree over to the synth engine, based off of notesToBePlayedObj
        makeMelodyNotesState.forEach((noteRow, index) => {
          if (
            areMelodyBeatsChecked[noteRow][currentBeat - 1] === 1 &&
            playing
          ) {
            if (!sound.includes("sample")) {
              playSynth(
                makeMelodyNotesState.length - index,
                playing,
                rootNote,
                wonkFactor,
                melodyVolume,
                chordsVolume,
                sound,
                filterCutoff,
                attack,
                decay,
                sustain,
                release,
                "melody",
                audioContext,
                currentNoteStartTime
              )
            } else {
              playSample(
                makeMelodyNotesState.length - index,
                playing,
                rootNote,
                wonkFactor,
                "melody",
                audioContext,
                currentNoteStartTime
              )
            }
          }
        })

        makeChordNotesState.forEach((noteRow, index) => {
          if (
            areBeatsChecked[`chord-${noteRow}`][currentBeat - 1] === 1 &&
            playing
          ) {
            if (!sound.includes("sample")) {
              playSynth(
                makeChordNotesState.length - index,
                playing,
                rootNote,
                wonkFactor,
                melodyVolume,
                chordsVolume,
                sound,
                filterCutoff,
                attack,
                decay,
                sustain,
                release,
                "chords",
                audioContext,
                currentNoteStartTime
              )
            } else {
              playSample(
                makeChordNotesState.length - index,
                playing,
                rootNote,
                wonkFactor,
                "chords",
                audioContext,
                currentNoteStartTime
              )
            }
          }
        })

        // todo assess notesToBePlayedObj and advance nextNoteTime so that we can re-do ye olde CW if
        // starts at 0, so the first note to be played will be on beat 1.
        // ! we may have an issue in assuming it's always on beat 1 tho.
        // whatever. assume start on beat 1.
        //
        console.log(notesToBePlayed)
        // we want seconds. find the next note to be played, first of all
        // we are by necessity having just played a note, so we can assume that we're looking for the second one
        // notesToBePlayed looks like {beat1: [1,2], beat4: [3,5]}

        // * for tomorrow:
        // * i tried to calculate the time to the next beat to be played. it's not working, lol. it may just be a confusion with nextNoteTime, which also exists and is not being used. I think i avoided it cuz i wanted to avoid state, but i think i need to use state regardless, as it needs to persist between renders.... is that what i mean?
        // it's also not changing every beat, but rather every reset of currentBeat. perhaps related to my for loop.

        // setNextNoteTime(calcTime)
        console.log(calcTime)
        // * put this to an else condition of CW's while (now my if). i was hoping to either set a note to play or change the current beat so the sequencer keeps moving. atm its stopped. mb maybe a state that says notePlayed = true then flip to false?
      }
      for (let i = currentBeat + 1; i <= stepCount; i++) {
        if (notesToBePlayed[`beat${i}`]) {
          let calculation = 0
          calculation = (i - currentBeat) * secondsPerBeat + calcTime
          console.log(secondsPerBeat)
          console.log(calculation, "reset calcTime")
          setCalcTime(calculation)
          setNextNoteTime(calculation)
        }
      }
      if (playing) {
        if (currentBeat <= 0 || currentBeat >= stepCount) {
          setCurrentBeat(1)
        } else {
          // ! currentBeat is advanced every scheduleAheadTime, not based on tempo!! wtf
          // ! currentBeat is advanced every scheduleAheadTime, not based on tempo!! wtf
          // ! currentBeat is advanced every scheduleAheadTime, not based on tempo!! wtf
          // ! currentBeat is advanced every scheduleAheadTime, not based on tempo!! wtf
          // ! currentBeat is advanced every scheduleAheadTime, not based on tempo!! wtf
          setCurrentBeat(currentBeat + 1)
          // setNextBeatTime(nextNoteTime + secondsPerBeat)
        }
        scheduleBeat(currentBeat, nextNoteTime) // todo needed for visual
      } else {
        setCurrentBeat(1) // this resets the playback to the beginning. remove to just make it a pause button.
      }
    }, scheduleAheadTime)
  }, [playing, currentBeat])

  const handleBeatCheckbox = (chordIndex, beatIndex, checked) => {
    const chordShortcut = `chord-${chordIndex}`
    // set loaded song to a value the user will never accidentally save to
    if (loadSong !== "75442486-0878-440c-9db1-a7006c25a39f")
      setLoadSong("75442486-0878-440c-9db1-a7006c25a39f")
    setHookTheoryChords("")
    const arrayReplacement = []
    // replace just the one note in the master array given the box that is checked
    blankStepCountArray.forEach((step, index) => {
      if (beatIndex !== index) {
        arrayReplacement.push(areBeatsChecked[`chord-${chordIndex}`][index])
      } else {
        arrayReplacement.push(checked ? 0 : 1)
      }
    })
    setAreBeatsChecked({
      ...areBeatsChecked,
      [chordShortcut]: [...arrayReplacement],
    })
  }

  const handleMelodyBeatCheckbox = (scaleIndex, beatIndex, checked) => {
    // beatIndex represents the specific beat (x-axis) that was clicked
    const chordShortcut = scaleIndex // y-axis
    const arrayReplacement = []
    if (loadSong !== "75442486-0878-440c-9db1-a7006c25a39f")
      setLoadSong("75442486-0878-440c-9db1-a7006c25a39f")
    blankStepCountArray.forEach((step, index) => {
      if (beatIndex !== index) {
        arrayReplacement.push(areMelodyBeatsChecked[scaleIndex][index])
      } else {
        arrayReplacement.push(checked ? 0 : 1)
      }
    })

    setAreMelodyBeatsChecked({
      ...areMelodyBeatsChecked,
      [chordShortcut]: [...arrayReplacement],
    })
  }

  const handleChordClick = (chordID, index) => {
    // set state once a user clicks on a suggested chord from HookTheory
    setHookTheoryChords([])
    let newChosenAPIChords = []
    if (chosenAPIChords === "") {
      newChosenAPIChords.push(chordID)
    } else {
      newChosenAPIChords = [...chosenAPIChords]
      newChosenAPIChords.push(chordID)
    }
    setChosenAPIChords(newChosenAPIChords)
    const chordShortcut = `chord-${chordID}`
    const arrayReplacement = []
    // push triggered value of 1 into note array if we're near the desired spot on the timeline (chordInputStep), otherwise put existing notes back
    blankStepCountArray.forEach((step, index) => {
      if (
        index + 1 === chordInputStep ||
        index + 1 === chordInputStep + 1 ||
        index + 1 === chordInputStep + 2 ||
        index + 1 === chordInputStep + 3
      ) {
        arrayReplacement.push(1)
      } else {
        arrayReplacement.push(areBeatsChecked[`chord-${chordID}`][index])
      }
    })
    if (arrayReplacement.length === stepCount) {
      setAreBeatsChecked({
        ...areBeatsChecked,
        [chordShortcut]: [...arrayReplacement],
      })

      setChordInputStep((chordInputStep) => chordInputStep + 4)
    }
  }

  // suggest chords to the user. when a new chord is chosen, update the suggested chords
  useEffect(() => {
    fetch("https://api.hooktheory.com/v1/trends/nodes", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer 6253102743c64eb2313c2c56d40bf6a6",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHookTheoryChords(data.slice(0, 4)) // slice takes only the first 4 array items
      })
      .catch((error) => {
        console.log(error)
      })
    if (chosenAPIChords.length > 0) {
      fetch(
        `https://api.hooktheory.com/v1/trends/nodes?cp=${chosenAPIChords.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer 6253102743c64eb2313c2c56d40bf6a6",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          // only take chords from the api that match those i've put in the sequencer
          const removeUnsupportedChords = data.filter((chord) => {
            return chord["chord_ID"].length <= 1
          })
          setHookTheoryChords(removeUnsupportedChords.slice(0, 4)) // slice takes only the first 4 array items
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [chosenAPIChords])

  useEffect(() => {
    // when initializing this event listener, detectKeyDown only has the value of playing at the time it was initialized, because callbacks are dinosaurs and cant really access up-to-date state variables
    const detectKeyDown = (e) => {
      document.removeEventListener("keydown", detectKeyDown, true)

      // check event target for type, which should give an input text field. check for this type and change state based on it not being an text input.
      // can't access current state with event listener, thus we need useRef
      if (e.key === "s" && e.target.type !== "text") {
        playingRef.current = !playingRef.current
        setPlaying(playingRef.current)
        document.addEventListener("keydown", detectKeyDown, true)
        // ! this is a peculiarity unique to hooks/functional components (what we use, i.e. not class). class react would indeed have access to up to date state variables. this is mainly an edge case given we're using an event listener. generally they're up to date, no issue.
      }
    }
    // still debugging. sometimes multiple event listeners are added, due to the magic of react.
    document.removeEventListener("keydown", detectKeyDown, true)
    document.addEventListener("keydown", detectKeyDown, true)
  }, [])

  // when adding many suggested chords, eventually you start adding to the beginning again
  useEffect(() => {
    if (chordInputStep > stepCount) setChordInputStep(1)
  }, [chordInputStep])

  // necessary in order to update the page when stepCount changes
  useEffect(() => {
    // update chord master when the step count changes
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
    setAreBeatsChecked(newMaster)

    // update melody master when step count changes
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
    setAreMelodyBeatsChecked(newMelodyMaster)
  }, [stepCount])

  useEffect(() => {
    // when the user clicks on a note after loading a song, consider that loadSong is no longer the song on the screen, so we can't delete it. we can only delete it if no changes are made.
    if (loadSong !== "75442486-0878-440c-9db1-a7006c25a39f") {
      const song = loadUserSongs[loadSong]
      setRootNote(song["rootNote"])
      setStepCount(song["stepCount"])
      setTempo(song["tempo"])
      setWonkFactor(song["wonkFactor"])
      setMelodyVolume(song["melodyVolume"])
      setChordsVolume(song["chordsVolume"])
      setSound(song["sound"])
      setFilterCutoff(song["filterCutoff"])
      setAttack(song["attack"])
      setDecay(song["decay"])
      setSustain(song["sustain"])
      setRelease(song["release"])
      setAreBeatsChecked(song["areBeatsChecked"])
      setAreMelodyBeatsChecked(song["areMelodyBeatsChecked"])
    }
  }, [loadSong])

  // reloads song list after saving a song. removes notifications after 5s
  useEffect(() => {
    if (songSaved === "Song saved!") {
      fetch(`/api/user-login/${user.sub}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "loading user and songs")
          setLoadUserSongs(handleLoadSongsFetch(data.data))
        })
      setTimeout(() => {
        setSongSaved(false)
      }, 5000)
    }
    if (songDeleted === "Song deleted!") {
      fetch(`/api/user-login/${user.sub}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "loading user and songs")
          setLoadUserSongs(handleLoadSongsFetch(data.data))
          setSongName("")
        })
      setTimeout(() => {
        setSongDeleted(false)
      }, 5000)
    }
  }, [songSaved, songDeleted])

  return (
    <>
      <Parameters
        playing={playing}
        setPlaying={setPlaying}
        tempo={tempo}
        setAreBeatsChecked={setAreBeatsChecked}
        generateAreBeatsCheckedInitialState={
          generateAreBeatsCheckedInitialState
        }
        makeChordNotesState={makeChordNotesState}
        blankStepCountArray={blankStepCountArray}
      />
      <MelodySequencerGrid>
        <AllBoxesDiv>
          {makeMelodyNotesState.map((note) => {
            const scaleIndex = note
            if (note / 8 === 0 || (note > 7 && note <= 14)) {
              note = note - 7
            } else if (note > 14) {
              note = note - 14
            }
            return (
              <TitleAndBoxesDiv>
                <TitleSpanDiv>
                  <NoteTitle>
                    {note}
                    <br />
                  </NoteTitle>
                </TitleSpanDiv>
                <ChordDiv key={`row-${scaleIndex}`}>
                  {areMelodyBeatsChecked[scaleIndex].map((check, index) => {
                    return (
                      <MelodyCheckbox
                        key={`row-${scaleIndex}-beat-${index}`}
                        note={note}
                        areMelodyBeatsChecked={areMelodyBeatsChecked}
                        beatIndex={index}
                        scaleIndex={scaleIndex}
                        handleMelodyBeatCheckbox={handleMelodyBeatCheckbox}
                      />
                    )
                  })}
                </ChordDiv>
              </TitleAndBoxesDiv>
            )
          })}

          <PointerContainer>
            <BlankDiv />
            {blankStepCountArray.map((step, index) => {
              const num = index + 1
              // every 2 beats make a div
              if ((index + 1) % 2 === 0) {
                return (
                  <>
                    <BeatMarker
                      key={num * Math.random()}
                      className={
                        currentBeat === num ||
                        currentBeat === num + 1 ||
                        num === currentBeatRef.current
                          ? "current"
                          : ""
                      }
                    >
                      <BeatSpan
                        key={num * Math.random()}
                        className={
                          currentBeat === num ||
                          currentBeat === num + 1 ||
                          num === currentBeatRef.current
                            ? "current"
                            : ""
                        }
                      >
                        {num / 2}
                      </BeatSpan>
                    </BeatMarker>
                  </>
                )
              }
            })}
          </PointerContainer>
        </AllBoxesDiv>
      </MelodySequencerGrid>
      <ChordSequencerGrid>
        <AllBoxesDiv>
          {makeChordNotesState.map((chord) => {
            const chordIndex = chord

            return (
              <TitleAndBoxesDiv>
                <TitleSpanDiv>
                  <ChordTitle>
                    {romanNumeralReference["major"][chord]}
                    <br />
                  </ChordTitle>
                </TitleSpanDiv>
                <ChordDiv key={`row-${chordIndex}`}>
                  {areBeatsChecked[`chord-${chordIndex}`].map(
                    (check, index) => {
                      return (
                        <Checkbox
                          key={`row-${chordIndex}-beat-${index}`}
                          chord={chord}
                          areBeatsChecked={areBeatsChecked}
                          beatIndex={index}
                          chordIndex={chordIndex}
                          handleBeatCheckbox={handleBeatCheckbox}
                        />
                      )
                    }
                  )}
                </ChordDiv>
              </TitleAndBoxesDiv>
            )
          })}
          <PointerContainer>
            <BlankDiv />
            {blankStepCountArray.map((step, index) => {
              const num = index + 1
              // every 2 beats make a div
              if ((index + 1) % 2 === 0) {
                return (
                  <>
                    <BeatMarker
                      className={
                        currentBeat === num ||
                        currentBeat === num + 1 ||
                        num === currentBeatRef.current
                          ? "current"
                          : ""
                      }
                    >
                      <BeatSpan
                        className={
                          currentBeat === num ||
                          currentBeat === num + 1 ||
                          num === currentBeatRef.current
                            ? "current"
                            : ""
                        }
                      >
                        {num / 2}
                      </BeatSpan>
                    </BeatMarker>
                  </>
                )
              }
            })}
          </PointerContainer>
        </AllBoxesDiv>
      </ChordSequencerGrid>
      <HookTheoryChordsDiv>
        {hookTheoryChords.length !== 0 && hookTheoryChords !== "" ? (
          hookTheoryChords.map((chord, index) => {
            return (
              <HookTheoryChordButton
                key={chord.chord_ID}
                chord={chord}
                handleChordClick={handleChordClick}
                chordInputStep={chordInputStep}
                index={index}
                blankStepCountArray={blankStepCountArray}
                hookTheoryChords={hookTheoryChords}
              />
            )
          })
        ) : (
          <>
            {hookTheoryChords === "" ? (
              <>reset the chords to see suggestions</>
            ) : (
              <>loading chords from the HookTheory API...</>
            )}
          </>
        )}
      </HookTheoryChordsDiv>
    </>
  )
}

export default Sequencer

const ChordSequencerGrid = styled.div`
  height: 270px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const MelodySequencerGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`

const ChordDiv = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`

const AllBoxesDiv = styled.div`
  display: flex;
  height: 300px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const BlankDiv = styled.div`
  height: 50px;
  width: 52px;
`
const NoteTitle = styled.span`
  text-align: left;
  font-size: 13.65px;
  margin: none;
  display: inline-block;
  opacity: 75%;
`

const ChordTitle = styled.span`
  text-align: left;
  font-size: 22px;
  opacity: 75%;
  padding: 2px;
  margin: none;
`

const HookTheoryChordsDiv = styled.div`
  height: 100px;
  margin: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PointerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  align-items: center;
  height: 10px;
`

const BeatMarker = styled.div`
  border-left: 1px solid rgba(211, 211, 211, 0.25);
  width: 53px;
  height: 20px;
  opacity: 100%;
`
const BeatSpan = styled.span`
  padding-left: 9px;
  color: white;
  opacity: 50%;
`
const TitleAndBoxesDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const TitleSpanDiv = styled.div`
  width: 50px;
  text-align: right;
`
