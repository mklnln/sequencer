import {useContext, useEffect, useState} from "react"
import curlybrace from "./Components/curlybrace.svg"
import Checkbox from "./Components/Checkbox"
import {MusicParametersContext} from "./App.js"
import {
  clearAreBeatsChecked,
  generateAreBeatsCheckedInitialState,
} from "./Helpers"
import {PlayBeatChord} from "./AudioEngine.js"
import styled from "styled-components"
import StartingChordButton from "./Components/StartingChordButton"
import RemoveChordButton from "./RemoveChordButton"
import Parameters from "./Components/Parameters"
import {useAuth0} from "@auth0/auth0-react"
const Sequencer = () => {
  // const [tempo, setTempo] = useState(150)
  const {tempo, setTempo, stepCount, setStepCount, rootNote, wonkFactor} =
    useContext(MusicParametersContext)
  const {isAuthenticated, user} = useAuth0()
  const [playing, setPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [nextBeatTime, setNextBeatTime] = useState(0)
  const [amtOfNotes, setAmtOfNotes] = useState(8) // amt of chords, i.e. how many ROWS are there
  // const [stepCount, setStepCount] = useState(16) // amt of steps, i.e. how many COLUMNS are there
  // 1 pointer width covers 2 steps, or 1/4 of 8. set to 2 for 16, 3 for 32
  // ! don't forget to also set
  const [songName, setSongName] = useState("")
  const [pointerWidth, setPointerWidth] = useState(2)
  const [chordInputStep, setChordInputStep] = useState(1)
  const [buttonsPushed, setButtonsPushed] = useState(0)
  const [startingChords, setStartingChords] = useState(null)
  const [chosenAPIChords, setChosenAPIChords] = useState([])

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
  const makeNotesState = []
  // [8,7,6,5,4,3,2,1] where amtofnotes = 8
  for (let i = amtOfNotes; i > 0; i--) {
    makeNotesState.push(i)
  }
  const blankStepCountArray = []
  // [0,0,0,0,0,0,0,0] where stepCount = 8
  for (let i = stepCount; i > 0; i--) {
    blankStepCountArray.push(0)
  }
  const [areBeatsChecked, setAreBeatsChecked] = useState(
    generateAreBeatsCheckedInitialState(makeNotesState, blankStepCountArray)
  )
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
  const secondsPerBeat = 60.0 / tempo
  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        currentBeat <= 0 || currentBeat >= stepCount
          ? setCurrentBeat(1)
          : setCurrentBeat(currentBeat + 1)
        scheduleBeat(currentBeat, nextBeatTime) // todo needed for visual
      } else {
        setCurrentBeat(1) // ! this resets the playback to the beginning. remove to just make it a pause button.
      }
      setNextBeatTime(nextBeatTime + secondsPerBeat) // todo need for visual
      makeNotesState.forEach((noteRow, index) => {
        if (
          areBeatsChecked[`chord-${noteRow}`][currentBeat - 1] === 1 &&
          playing
        ) {
          PlayBeatChord(
            makeNotesState.length - index,
            playing,
            rootNote,
            wonkFactor
          )
        }
      })
    }, (secondsPerBeat * 1000) / 2)
    // ! even set manually at 1000ms (i.e. one second), this will oscillate in and out of rhythm with a clock ticking each second. the 2 refers to how many subdivisions a quarter note gives. our stepCount is 8th notes.
    return () => clearInterval(interval)
  }, [playing, currentBeat])

  const handleBeatCheckbox = (chordIndex, beatIndex, checked) => {
    const chordShortcut = `chord-${chordIndex}`
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

  const handleChordClick = (chordID, index) => {
    let newChosenAPIChords = [...chosenAPIChords]
    newChosenAPIChords.push(chordID)
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
      setAreBeatsChecked({
        ...areBeatsChecked,
        [chordShortcut]: [...arrayReplacement],
      })
    }
  }

  const handleSave = () => {
    const emptyBeatsChecked = generateAreBeatsCheckedInitialState(
      makeNotesState,
      blankStepCountArray
    )
    console.log(songName)
    console.log(areBeatsChecked, emptyBeatsChecked)

    const testForInput = []
    Object.keys(areBeatsChecked).forEach((chord) => {
      areBeatsChecked[chord].map((beat) => {
        if (beat === 1) {
          testForInput.push(beat)
        }
      })
    })
    if (songName === "") {
      alert(`You can't save without a song name.`)
    } else if (testForInput.length === 0) {
      alert(
        `You can't save without actually putting some notes in the sequencer.`
      )
    } else {
      const saveObj = {}
      saveObj.areBeatsChecked = areBeatsChecked
      saveObj.userID = user.sub
      saveObj.songName = songName
      console.log(saveObj)
      fetch("/api/save-song", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({songData: {...saveObj}}),
        body: {song: {...saveObj}},
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          window.alert(error)
        })
    }
  }

  const handleSongName = (e) => {
    setSongName(e.target.value)
    console.log(songName)
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
        setStartingChords(data.slice(0, 4)) // slice takes only the first 4 array items
      })
      .catch((error) => {
        window.alert(error)
      })
  }, [])

  // ! this renders a few times before fulfilling the intended functionality. trying it in other ways yields absurd amounts of re-renders. it seems wonky to re-render 3-4 times.. but it works? so...
  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true)
  }, [playing])

  useEffect(() => {
    if (chordInputStep > stepCount) setChordInputStep(1)
  }, [chordInputStep])

  const detectKeyDown = (e) => {
    if (e.key === "s") {
      setPlaying(!playing)
    }
  }

  useEffect(() => {
    setAreBeatsChecked(
      generateAreBeatsCheckedInitialState(makeNotesState, blankStepCountArray)
    )
  }, [stepCount])

  // useEffect(() => {}, [tempo, stepCount])
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
        makeNotesState={makeNotesState}
        blankStepCountArray={blankStepCountArray}
      />
      <SequencerGrid>
        {makeNotesState.map((chord, notesIndex) => {
          const chordIndex = chord
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
                )
                // }
              })}
            </ChordDiv>
          )
        })}
        <PointerContainer>
          <Pointer
            alt="pointer"
            src={curlybrace}
            style={{
              transform: `scale(${pointerWidth},1) rotate( -90deg)`,
              position: `relative`,
              left: `-22.5%`,
              top: `-10px`,
            }}
          />
        </PointerContainer>
        <RemoveButtonsDiv>
          {blankStepCountArray.slice(0, 4).map((step, index) => {
            return (
              <RemoveChordButton
                key={`removebutton${Math.random()}`}
                index={index}
                handleChordRemove={handleChordRemove}
              />
            )
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
            )
          })
        ) : (
          <>loading chords...</>
        )}
      </HookTheoryChords>
      <button
        onClick={() => {
          console.log(playing)
          console.log(areBeatsChecked)
        }}
      >
        see checked boxes
      </button>
      <button
        onClick={() => {
          console.log(makeNotesState)
          clearAreBeatsChecked(
            makeNotesState,
            blankStepCountArray,
            setAreBeatsChecked
          )
        }}
      >
        reset checked boxes
      </button>
      {/* 
      could cond'ly render showing faded button if unauthenticated
      */}
      {isAuthenticated && (
        <>
          <span>Song Name:</span>
          <input type="text" onChange={handleSongName} value={songName} />

          <button onClick={() => handleSave()}>save to mongo</button>
        </>
      )}
    </>
  )
}

export default Sequencer

const SequencerGrid = styled.section`
  padding: 20px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid fuchsia;
`

const ChordDiv = styled.div`
  position: relative;
  right: 17px;
`

const TitleDiv = styled.div`
  display: inline;
  width: 25px;
  display: inline-block;
  justify-content: center;
  padding-right: 8px;
`

const ChordTitle = styled.span`
  position: relative;
  top: -8px;
  vertical-align: middle;
  text-align: left;
`

const HookTheoryChords = styled.div`
  height: 50px;
  margin: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const RemoveButtonsDiv = styled.div`
  display: flex;
  padding: 10px 0 0 0;
  justify-content: center;
  align-items: center;
`

const PointerContainer = styled.div`
  width: calc(100% - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`

const Pointer = styled.img`
  /* position: relative; */
  pointer-events: none;
`
