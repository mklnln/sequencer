import {useContext, useEffect, useRef, useState} from "react"
import curlybrace from "./Components/curlybrace.svg"
import Checkbox from "./Components/Checkbox"
import {MusicParametersContext} from "./App.js"
import {
  clearAreBeatsChecked,
  clearAreMelodyBeatsChecked,
  generateAreBeatsCheckedInitialState,
  handleLoadSongsFetch,
  handleSongName,
  handleSave,
  handleDelete,
} from "./Helpers"
import {playSample, getFile, setupSample, playSynth} from "./AudioEngine.js"
import styled from "styled-components"
import HookTheoryChordButton from "./Components/HookTheoryChordButton"
import RemoveChordButton from "./RemoveChordButton"
import Parameters from "./Components/Parameters"
import {useAuth0} from "@auth0/auth0-react"
import MelodyCheckbox from "./Components/MelodyCheckbox"
import LoadSaveTestButtons from "./Components/LoadSaveTestButtons"
const Sequencer = () => {
  // const [tempo, setTempo] = useState(150)
  const {
    audioContext,
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
    songName,
    areBeatsChecked,
    setAreBeatsChecked,
    areMelodyBeatsChecked,
    setAreMelodyBeatsChecked,
    makeChordNotesState,
    makeMelodyNotesState,
    blankStepCountArray,
    amtOfNotes,
    chosenAPIChords,
    setChosenAPIChords,
    setAmtOfNotes,
    hookTheoryChords,
    setHookTheoryChords,
  } = useContext(MusicParametersContext)
  const {isAuthenticated, user} = useAuth0()
  const [playing, setPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [nextBeatTime, setNextBeatTime] = useState(0)

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
  // const makeMelodyNotesState = []
  // // [8,7,6,5,4,3,2,1] where amtofnotes = 8
  // for (let i = amtOfNotes * 2 - 1; i > 0; i--) {
  //   makeMelodyNotesState.push(i)
  // }

  // const makeChordNotesState = []
  // // [8,7,6,5,4,3,2,1] where amtofnotes = 8
  // for (let i = amtOfNotes; i > 0; i--) {
  //   makeChordNotesState.push(i)
  // }
  // const blankStepCountArray = []
  // // [0,0,0,0,0,0,0,0] where stepCount = 8
  // for (let i = stepCount; i > 0; i--) {
  //   blankStepCountArray.push(0)
  // }

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
  const secondsPerBeat = 45.0 / tempo

  // * a tale of two clocks
  // setTimeout looks ahead and finds if any notes are due to be played
  // okay if its delayed because it looks at an interval of time in the future
  // it schedules web audio events in the future
  // "The setTimeout timer basically just checks to see if any notes are going to need to be scheduled “soon” based on the current tempo, and then schedules them"
  // the setTimeout plays any notes that need to be played now as well as in its future interval
  // How much the lookahead overlaps with the next interval’s start time is determines how resilient your app will be across different machines, and as it becomes more complex (and layout and garbage collection may take longer).
  //  resilient to slower machines and operating systems, it’s best to have a large overall lookahead and a reasonably short interval
  //

  // * lookahead is the amt of the future interval
  // * timeout interval is how often the setTimeout is called with its lookahead
  // * A good place to start is probably 100ms of “lookahead” time, with intervals set to 25ms.

  // while (nextnotetime < currenttime + lookahead) {
  // schedule the note (beatvalue, nextnotetime)
  // nextnote()

  // may need to bring audiocontext in here and pass it over to the synth engine

  const scheduleAheadTime = 100 // ms? idk
  useEffect(() => {
    const interval = setInterval(() => {
      const nextNote = () => {
        currentBeat <= 0 || currentBeat >= stepCount
          ? setCurrentBeat(1)
          : setCurrentBeat(currentBeat + 1)
      }
      // * i am not accounting for events scheduled in the future. all im doing is running through the array as it matches current beat and only then sending a sound if they match.
      // * i must consider tempo, currentTime, and use scheduleAheadTime with this while statement

      // nextBeatTime is what I need to figure it out and it has to be a fxn of tempo and my beat subdivision

      //
      if (playing) {
        while (nextBeatTime < audioContext.currentTime + scheduleAheadTime) {
          // scheduleNote(current16thNote, nextNoteTime)
          nextNote()
        }

        scheduleBeat(currentBeat, nextBeatTime) // todo needed for visual
      } else {
        setCurrentBeat(1) // ! this resets the playback to the beginning. remove to just make it a pause button.
      }
      currentBeatRef.current = currentBeat
      console.log(nextBeatTime, "adding ", secondsPerBeat)
      // setNextBeatTime(nextBeatTime + secondsPerBeat) // todo need for visual
      const currentNoteStartTime = nextBeatTime
      // console.log(makeMelodyNotesState)
      // console.log(makeChordNotesState)
      makeMelodyNotesState.forEach((noteRow, index) => {
        if (areMelodyBeatsChecked[noteRow][currentBeat - 1] === 1 && playing) {
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
              nextBeatTime
            )
          } else {
            playSample(
              makeChordNotesState.length - index,
              playing,
              rootNote,
              wonkFactor,
              "chords",
              audioContext,
              nextBeatTime
            )
          }
        }
      })

      // ! the below line's interval timing was secondsPerBeat * 1000, but i noticed that the stated value of 150 was in truth more like 130. 150/130 is 1.15, thus i thought a 15% decrease in the interval would give me a more accurate time. this is true, but i'm not sure what's going on exactly. that's why 850 is used as its 15% less
      // old value
      // }, (secondsPerBeat * 850) / 2)
    }, scheduleAheadTime)
    // ! even set manually at 1000ms (i.e. one second), this will oscillate in and out of rhythm with a clock ticking each second. the 2 refers to how many subdivisions a quarter note gives. our stepCount is 8th notes.
    return () => clearInterval(interval)
  }, [playing, currentBeat])

  const handleBeatCheckbox = (chordIndex, beatIndex, checked) => {
    const chordShortcut = `chord-${chordIndex}`
    // set loaded song to a value the user will never accidentally save to
    if (loadSong !== "75442486-0878-440c-9db1-a7006c25a39f")
      setLoadSong("75442486-0878-440c-9db1-a7006c25a39f")
    setHookTheoryChords("")
    const arrayReplacement = []
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
    const chordShortcut = scaleIndex
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
    // todo wanna fetch new chords based off of what we've already set, thus need state.. chosenAPI chords?
    setHookTheoryChords([])
    console.log(hookTheoryChords)
    let newChosenAPIChords = []
    console.log(chosenAPIChords)
    console.log(chordID)
    if (chosenAPIChords === "") {
      newChosenAPIChords.push(chordID)
    } else {
      newChosenAPIChords = [...chosenAPIChords]
      newChosenAPIChords.push(chordID)
    }
    setChosenAPIChords(newChosenAPIChords)
    const chordShortcut = `chord-${chordID}`
    const arrayReplacement = []
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
    console.log(arrayReplacement.length, stepCount)
    if (arrayReplacement.length === stepCount) {
      setAreBeatsChecked({
        ...areBeatsChecked,
        [chordShortcut]: [...arrayReplacement],
      })

      setChordInputStep((chordInputStep) => chordInputStep + 4)
    }
  }
  const handleChordRemove = (chordAtStep, chordID) => {
    const arrayReplacement = []
    const chordShortcut = `chord-${chosenAPIChords[chordID]}`
    const removeAtStep = (chordAtStep - 1) * 4 + 1
    blankStepCountArray.forEach((step, index) => {
      if (
        index + 1 === removeAtStep ||
        index + 1 === removeAtStep + 1 ||
        index + 1 === removeAtStep + 2 ||
        index + 1 === removeAtStep + 3
      ) {
        arrayReplacement.push(0)
      } else {
        arrayReplacement.push(
          areBeatsChecked[`chord-${chosenAPIChords[chordID]}`][index]
        )
      }
      console.log(chordID)
      console.log(arrayReplacement)
    })
    if (arrayReplacement.length === stepCount) {
      // todo update chosenapichords state
      const replaceAPIChords = []
      setAreBeatsChecked({
        ...areBeatsChecked,
        [chordShortcut]: [...arrayReplacement],
      })
    }
  }

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
        setHookTheoryChords(data.slice(0, 4)) // slice takes only the first 4 array items
      })
      .catch((error) => {
        console.log(error)
      })
  }, [chosenAPIChords])

  useEffect(() => {
    // todo fit chosen chords in format 1,4 in ${}
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
          // body: JSON.stringify({ order: formData }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          // i only take chords from the api that match those i've put in the sequencer
          const removeUnsupportedChords = data.filter((chord) => {
            return chord["chord_ID"].length <= 1
          })
          console.log(removeUnsupportedChords)
          setHookTheoryChords(removeUnsupportedChords.slice(0, 4)) // slice takes only the first 4 array items
        })
        .catch((error) => {
          console.log(error)
        })
    }

    // * the below is for getting songs with the specific chord progression.
    if (chosenAPIChords.length >= 4) {
      // this works but only gives 20 results. i dont want to just exclusively give back artists with A in their name, lol.
      const APISongs = []
      let page = 1
      fetch(
        `https://api.hooktheory.com/v1/trends/songs?cp=${chosenAPIChords.toString()}`,
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
          console.log(data, "hook API givin songs w chords")
          data.forEach((song) => {
            APISongs.push(song)
          })
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
      // ! for some reason, all the userIsTyping i get back (and i can get back up to 35 of them) return false, even though im typing

      // * bashu: check event target for type, which should give an input text field. check for this type and change state based on it not being an text input.
      // ? can't access current state with event listener
      if (e.key === "s" && e.target.type !== "text") {
        console.log("that key was s")
        playingRef.current = !playingRef.current
        // * call backs (e.g. detectKeyDown fxn) and event listeners don't have access to up to date state, so we needed useRef
        // -> reason why is the comment under first useFX line
        // for some goshderned reason this would, when setPlaying(!playing), it turns to be false all the time, despite being able to click a button and clg the value of playing and see true. bashu helped a lot with this
        setPlaying(playingRef.current)
        document.addEventListener("keydown", detectKeyDown, true)
        // ! bashu: unclear why it wasnt able to update and use the correct, up-to-date version of the variable given that a normal js function would be able to do so. especially since react is all about having up to date stuff, it should be able to do that! why didn't that work?
        // ! this is a peculiarity unique to hooks/functional components (what we use, i.e. not class). class react would indeed have access to up to date state variables. this is mainly an edge case given we're using an event listener. generally they're up to date, no issue.
      }
    }
    document.removeEventListener("keydown", detectKeyDown, true)

    document.addEventListener("keydown", detectKeyDown, true)
  }, [])

  useEffect(() => {
    if (chordInputStep > stepCount) setChordInputStep(1)
  }, [chordInputStep])

  useEffect(() => {
    console.log(playingRef, "usefx playingref changed???!!", playing)
  }, [playing])

  // necessary in order to update the page when stepCount changes
  useEffect(() => {
    // ! had an if looking for userLoadSongs then realized mb i need it to work without logging in. mb i needed it tho?

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
    // when the user clicks on a button after loading a song, i want to consider that loadSong is no longer the song on the screen, so we can't delete it. we can only delete it if no changes are made.
    if (loadSong !== "75442486-0878-440c-9db1-a7006c25a39f") {
      console.log(loadUserSongs)
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

  // removes 'Song saved!' notification after 5s
  useEffect(() => {
    // reset loadusersongs so we trigger a fetch in the ohter usefx?
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
                    // }
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
                      // }
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
                handleChordRemove={handleChordRemove}
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
  /* padding: 20px 20px 0px 20px; */
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const MelodySequencerGrid = styled.div`
  /* height: 400px; */ // used to be needed to not overlap parameters, but seems to be ok.
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

const TitleDiv = styled.div`
  height: 270px;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
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
  height: 150px;
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
