import React, {useContext, useEffect, useRef, useState} from "react"
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
  const [playing, setPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
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

  useEffect(() => {
    // setInterval is called by milliSecondsPerBeat, so it gets called many times a second depending on the set tempo
    const interval = setInterval(() => {
      if (playing) {
        // advance the current beat
        currentBeat <= 0 || currentBeat >= stepCount
          ? setCurrentBeat(1)
          : setCurrentBeat(currentBeat + 1)
      } else {
        setCurrentBeat(1) // this resets the playback to the beginning. remove to just make it a pause button.
      }
      // used to track beat visually
      currentBeatRef.current = currentBeat
      makeMelodyNotesState.forEach((noteRow, index) => {
        // ask if a note is scheduled to play, represented by a 1 in the master reference of notes
        if (areMelodyBeatsChecked[noteRow][currentBeat - 1] === 1 && playing) {
          if (!sound.includes("sample")) {
            // send parameters to be used by the audio engine
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
              audioContext
            )
          } else {
            playSample(
              makeMelodyNotesState.length - index,
              playing,
              wonkFactor,
              "melody",
              audioContext
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
              audioContext
            )
          } else {
            playSample(
              makeChordNotesState.length - index,
              playing,
              wonkFactor,
              "chords",
              audioContext
            )
          }
        }
      })
    }, milliSecondsPerBeat)
    return () => clearInterval(interval)
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
          {makeMelodyNotesState.map((note, indexMelody) => {
            const scaleIndex = note
            if (note / 8 === 0 || (note > 7 && note <= 14)) {
              note = note - 7
            } else if (note > 14) {
              note = note - 14
            }
            return (
              <TitleAndBoxesDiv key={`note-${note}, at index ${indexMelody}`}>
                {/* unable to get rid of an 'each child in a list needs a key' error  */}
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
                  <React.Fragment key={`note-${step}, at index ${index}`}>
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
                  </React.Fragment>
                )
              }
            })}
          </PointerContainer>
        </AllBoxesDiv>
      </MelodySequencerGrid>
      <ChordSequencerGrid>
        <AllBoxesDiv>
          {makeChordNotesState.map((chord, index) => {
            const chordIndex = chord

            return (
              <TitleAndBoxesDiv key={`note-${chord}, at index ${index}`}>
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
                  <React.Fragment key={index}>
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
                  </React.Fragment>
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
