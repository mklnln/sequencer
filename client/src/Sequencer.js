import {useContext, useEffect, useState} from "react"
import curlybrace from "./Components/curlybrace.svg"
import Checkbox from "./Components/Checkbox"
import {MusicParametersContext} from "./App.js"
import {
  clearAreBeatsChecked,
  generateAreBeatsCheckedInitialState,
} from "./Helpers"
import {
  playSample,
  getFile,
  setupSample,
  PlayBeatChord,
  playback,
} from "./AudioEngine.js"
import styled from "styled-components"
import HookTheoryChordButton from "./Components/HookTheoryChordButton"
import RemoveChordButton from "./RemoveChordButton"
import Parameters from "./Components/Parameters"
import {useAuth0} from "@auth0/auth0-react"
const Sequencer = () => {
  // const [tempo, setTempo] = useState(150)
  const {
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
  } = useContext(MusicParametersContext)
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

  const [buttonsPushed, setButtonsPushed] = useState(0)
  const [hookTheoryChords, setHookTheoryChords] = useState(null)
  const [chosenAPIChords, setChosenAPIChords] = useState([])

  const [loadSong, setLoadSong] = useState()
  const [userIsTyping, setUserIsTyping] = useState(false)
  const [songSaved, setSongSaved] = useState(false)

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
          playback(makeNotesState.length - index, playing, rootNote, wonkFactor)
          // playSample()
          // PlayBeatChord(
          //   makeNotesState.length - index,
          //   playing,
          //   rootNote,
          //   wonkFactor
          // )
        }
      })
      // ! the below line's interval timing was secondsPerBeat * 1000, but i noticed that the stated value of 150 was in truth more like 130. 150/130 is 1.15, thus i thought a 15% decrease in the interval would give me a more accurate time. this is true, but i'm not sure what's going on exactly. that's why 850 is used as its 15% less
    }, (secondsPerBeat * 850) / 2)
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
    // todo wanna fetch new chords based off of what we've already set, thus need state.. chosenAPI chords?
    setHookTheoryChords(null)
    console.log(hookTheoryChords)
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
      // todo update chosenapichords state
      const replaceAPIChords = []
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
    } else if (loadUserSongs[songName]) {
      alert(`That song already exists in the database. Use another name.`)
    } else {
      const saveObj = {}
      saveObj[songName] = {areBeatsChecked}
      saveObj.userID = user.sub
      saveObj[songName].stepCount = stepCount
      saveObj[songName].rootNote = rootNote
      saveObj[songName].tempo = tempo
      saveObj[songName].wonkFactor = wonkFactor
      setSongSaved("saving to database...")
      fetch(`/api/save-song/${songName}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...saveObj}),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            console.log(songSaved, "saved in response")
            console.log("the song was saved")
            setSongSaved("Song saved!")
          }
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
        console.log(data, "hook API givin prllems")
        setHookTheoryChords(data.slice(0, 4)) // slice takes only the first 4 array items
      })
      .catch((error) => {
        window.alert(error)
      })
  }, [])

  useEffect(() => {
    // todo fit chosen chords in format 1,4 in ${}
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
        console.log(data, "hook API givin prllems,for subsequent chords")
        const removeUnsupportedChords = data.filter((chord) => {
          return chord["chord_ID"].length <= 1
        })
        console.log(removeUnsupportedChords)
        setHookTheoryChords(removeUnsupportedChords.slice(0, 4)) // slice takes only the first 4 array items
      })
      .catch((error) => {
        window.alert(error)
      })

    if (chosenAPIChords.length > 1) {
      // this works but only gives 20 results. i dont want to just exclusively give back artists with A in their name, lol.
      let fetches = 2
      let APISongs = []
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
          // body: JSON.stringify({ order: formData }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "hook API givin songs w chords")
          fetches--
          page++
          data.forEach((song) => {
            APISongs.push(song)
          })
        })
        .catch((error) => {
          window.alert(error)
        })
      if (fetches > 0) {
        setTimeout(() => {
          fetch(
            `https://api.hooktheory.com/v1/trends/songs?cp=${chosenAPIChords.toString()}&page=${page}`,
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
              console.log(
                data,
                `"hook API givin songs w chords, fetch #${fetches}"`
              )
              fetches--
              page++
              data.forEach((song) => {
                APISongs.push(song)
              })
            })
            .catch((error) => {
              window.alert(error)
            })
        }, 2000)
      }
    }
  }, [chosenAPIChords])

  useEffect(() => {
    document.removeEventListener("keydown", detectKeyDown, true)
  }, [userIsTyping])
  // ! having trouble with using s in a song name triggering start/stop
  useEffect(() => {
    // if (!userIsTyping) {
    console.log("usfx playing cuz usertypew")

    // }
    // ! must remove eventlistener or else we have an exponential amount listening to it which is what causes the slow down.
    // document.removeEventListener("keydown", detectKeyDown, true)
  }, [playing])
  // useEffect(() => {
  //   if (userIsTyping) setPlaying(false)
  //   // if (userIsTyping)
  //   //   document.removeEventListener("keydown", detectKeyDown, true)
  // }, [userIsTyping])

  useEffect(() => {
    if (chordInputStep > stepCount) setChordInputStep(1)
  }, [chordInputStep])

  const detectKeyDown = (e) => {
    // without this remove eventlistener, it will retrigger the useEffect dependent on playing many times, causing a slow down
    document.removeEventListener("keydown", detectKeyDown, true)
    // ! for some reason, all the userIsTyping i get back (and i can get back up to 35 of them) return false, even though im typing
    if (e.key === "s" && !userIsTyping) {
      setPlaying(!playing)
    }
  }

  if (userIsTyping) {
    document.removeEventListener("keydown", detectKeyDown, true)
  } else {
    document.addEventListener("keydown", detectKeyDown, true)
  }

  // ` took this away cuz header was doin the same thing and this came after and was v slow
  // useEffect(() => {
  //   console.log("useFX after isauth loads to get user songs")
  //   console.log(user)
  //   // if (user) {
  //   //   fetch(`/api/load-songs/${user.sub}`, {
  //   //     method: "GET",
  //   //     headers: {
  //   //       Accept: "application/json",
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //   })
  //   //     .then((res) => res.json())
  //   //     .then((data) => {
  //   //       console.log(data, "songs loaded")
  //   //       setLoadUserSongs(handleLoadSongsFetch(data.data))
  //   //     })
  //   //     .catch((error) => {
  //   //       window.alert(error)
  //   //     })
  //   // }
  // }, [isAuthenticated])

  const handleLoadSong = (e) => {
    setLoadSong(e.target.value)
  }

  const handleInputFocus = (e) => {
    document.removeEventListener("keydown", detectKeyDown, true)
    setUserIsTyping(true)
  }
  const handleInputBlur = (e) => {
    // document.removeEventListener("keydown", detectKeyDown, true)
    setUserIsTyping(false)
  }
  // let samples
  // const samplePaths = ["c2.mp3", "./assets/samples/c3.mp3"]
  useEffect(() => {
    // ! sometimes upon refresh i lose my inputted notes. i used this to test it, but couldnt always reproduce it. mb was realted to a proxy error on a fetch (???)
    // console.log("OUR USE EFFECT")
    // setupSample(samplePaths).then((response) => {
    //   samples = response
    //   console.log(response)
    //   console.log(samples, "ihihihi123")
    // })

    console.log(areBeatsChecked, "mg changed?? from useEffect")
  }, [areBeatsChecked])

  // necessary in order to update the page when stepCount changes
  useEffect(() => {
    if (loadUserSongs) {
      console.log(loadUserSongs[loadSong], "kekeke")
      const newMaster = {}
      makeNotesState.forEach((note) => {
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
      console.log(newMaster)
    }
  }, [stepCount])

  useEffect(() => {
    if (loadSong) {
      console.log(loadUserSongs)
      const song = loadUserSongs[loadSong]
      setRootNote(song["rootNote"])
      setStepCount(song["stepCount"])
      setTempo(song["tempo"])
      setWonkFactor(song["wonkFactor"])
      setAreBeatsChecked(song["areBeatsChecked"])
    }
  }, [loadSong])

  useEffect(() => {
    setTimeout(() => {
      setSongSaved(false)
      console.log("we no save song anymo")
    }, 5000)
  }, [songSaved])

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
        <TitleDiv>
          {makeNotesState.map((chord) => {
            return (
              <ChordTitle>
                {romanNumeralReference["major"][chord]}
                <br />
              </ChordTitle>
            )
          })}
          <BlankDiv />
        </TitleDiv>
        <AllBoxesDiv>
          {makeNotesState.map((chord, notesIndex) => {
            const chordIndex = chord
            return (
              <ChordDiv key={`row-${chordIndex}`}>
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
            {blankStepCountArray.map((step, index) => {
              const num = index + 1
              if ((index + 1) % 2 === 0) {
                return (
                  <>
                    <BeatMarker>
                      <BeatSpan>{num / 2}</BeatSpan>
                    </BeatMarker>
                  </>
                )
              }
            })}
          </PointerContainer>
        </AllBoxesDiv>
      </SequencerGrid>
      <HookTheoryChordsDiv>
        {hookTheoryChords ? (
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
          <>loading chords from the HookTheory API...</>
        )}
      </HookTheoryChordsDiv>
      <BottomDiv>
        <button
          onClick={() => {
            console.log(areBeatsChecked)
            console.log(loadUserSongs)
            console.log(isAuthenticated, "auth?")
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
        <br />
        {isAuthenticated && (
          <>
            <span>Song Name:</span>
            <input
              type="text"
              onChange={handleSongName}
              value={songName}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />

            <button onClick={() => handleSave()}>save to mongo</button>
            <span>{songSaved ? songSaved : ""}</span>
            {loadUserSongs ? (
              <LoadingSongsDiv>
                <label>Load Song:</label>
                <select value={loadSong} onChange={handleLoadSong}>
                  <option default hidden>
                    Choose a song...
                  </option>
                  {Object.keys(loadUserSongs).map((song, index) => {
                    return (
                      <>
                        <option key={song} value={song}>
                          {song}
                        </option>
                      </>
                    )
                  })}
                </select>
              </LoadingSongsDiv>
            ) : (
              <span>loading songs...</span>
            )}
          </>
        )}
      </BottomDiv>
    </>
  )
}

export default Sequencer

const SequencerGrid = styled.section`
  /* padding: 20px 20px 0px 20px; */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ChordDiv = styled.div`
  position: relative;
  /* right: 17px; */
`

const AllBoxesDiv = styled.div`
  display: flex;
  height: 270px;
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
`

const ChordTitle = styled.span`
  text-align: left;
  font-size: 22px;
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

const Pointer = styled.img`
  /* position: relative; */
  pointer-events: none;
`
const BottomDiv = styled.div`
  width: 100%;
  height: 100px;
  margin: 10px;
`
const LoadingSongsDiv = styled.div``

const BeatMarker = styled.div`
  border-left: 1px solid white;
  width: 53px;
  height: 20px;
  opacity: 50%;
`
const BeatSpan = styled.span`
  padding-left: 5px;
  color: white;
  opacity: 50%;
`
