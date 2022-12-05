import {useAuth0} from "@auth0/auth0-react"
import React, {useContext, useEffect} from "react"
import styled from "styled-components"
import {MusicParametersContext} from "../App"
import {clearAreBeatsChecked, clearAreMelodyBeatsChecked} from "../Helpers"

const LoadSaveTestButtons = () => {
  const {
    playing,
    areMelodyBeatsChecked,
    makeChordNotesState,
    setAreBeatsChecked,
    setChosenAPIChords,
    setChordInputStep,
    setHookTheoryChords,
    makeMelodyNotesState,
    blankStepCountArray,
    setAreMelodyBeatsChecked,
    songName,
    songSaved,
    loadSong,
    loadUserSongs,
    songDeleted,
    areBeatsChecked,
    stepCount,
    rootNote,
    tempo,
    wonkFactor,
    melodyVolume,
    chordsVolume,
    sound,
    filterCutoff,
    attack,
    decay,
    sustain,
    release,
    setSongSaved,
    setSongDeleted,
    setLoadUserSongs,
    setSongName,
    setLoadSong,
  } = useContext(MusicParametersContext)

  console.log(loadUserSongs)
  const {user, isAuthenticated, isLoading, error} = useAuth0()
  useEffect(() => {}, [loadUserSongs])

  const handleLoadSongsFetch = (songsAndIDs) => {
    const keysToUse = Object.keys(songsAndIDs).filter((key) => {
      return key !== "userID" && key !== "_id"
    })
    const newState = {}
    keysToUse.forEach((key) => {
      newState[key] = songsAndIDs[key]
    })
    return newState
  }

  const handleSave = () => {
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
      console.log(areBeatsChecked, areMelodyBeatsChecked)
      saveObj[songName] = {}
      saveObj[songName].areBeatsChecked = areBeatsChecked
      saveObj[songName].areMelodyBeatsChecked = areMelodyBeatsChecked
      console.log(saveObj[songName].areMelodyBeatsChecked)
      console.log(saveObj[songName].areBeatsChecked)
      saveObj.userID = user.sub
      saveObj[songName].stepCount = stepCount
      saveObj[songName].rootNote = rootNote
      saveObj[songName].tempo = tempo
      saveObj[songName].wonkFactor = wonkFactor
      saveObj[songName].melodyVolume = melodyVolume
      saveObj[songName].chordsVolume = chordsVolume
      saveObj[songName].sound = sound
      saveObj[songName].filterCutoff = filterCutoff
      saveObj[songName].attack = attack
      saveObj[songName].decay = decay
      saveObj[songName].sustain = sustain
      saveObj[songName].release = release

      console.log(saveObj)
      setSongSaved("saving to database...")
      fetch(`/api/save-song`, {
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
            setSongSaved("Song saved!")
            console.log(data, "song POST")
            setLoadUserSongs(handleLoadSongsFetch(data.data))

            setTimeout(() => {
              setSongSaved(false)
            }, 5000)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  const handleDelete = () => {
    // make endpoint, BE logic

    if (loadSong === "75442486-0878-440c-9db1-a7006c25a39f" && user.sub) {
      window.alert(
        "Invalid selection. In order to delete, you must be logged-in and load the song from the dropdown list and then click delete. Making changes after loading will prevent deletion."
      )
    } else {
      console.log(typeof user)
      const bodyObj = {}
      bodyObj.songName = loadSong
      bodyObj.userID = user.sub
      fetch(`/api/delete-song/`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...bodyObj}),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            console.log(data)
            setSongDeleted("Song deleted!")
            setLoadUserSongs(handleLoadSongsFetch(data.data))

            setTimeout(() => {
              setSongSaved(false)
            }, 5000)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const handleSongName = (e) => {
    setSongName(e.target.value)
  }

  const handleLoadSong = (e) => {
    console.log(e.target.value)
    setLoadSong(e.target.value)
  }

  return (
    <MainDiv>
      <ColumnDiv>
        <StyledButton
          onClick={() => {
            console.log(sound)
          }}
        >
          test
        </StyledButton>
        <StyledButton
          onClick={() => {
            console.log(makeChordNotesState)
            clearAreBeatsChecked(
              makeChordNotesState,
              blankStepCountArray,
              setAreBeatsChecked,
              setChosenAPIChords,
              setChordInputStep,
              setHookTheoryChords
            )
          }}
        >
          reset chords
        </StyledButton>
        <StyledButton
          onClick={() => {
            clearAreMelodyBeatsChecked(
              makeMelodyNotesState,
              blankStepCountArray,
              setAreMelodyBeatsChecked
            )
          }}
        >
          reset melodies
        </StyledButton>
      </ColumnDiv>
      {/* 
      could cond'ly render showing faded StyledButton if unauthenticated
      */}
      <br />
      {loadUserSongs ? (
        <>
          {isAuthenticated && (
            <>
              <ColumnDiv>
                <span>Song Name:</span>
                <input
                  type="text"
                  onChange={handleSongName}
                  value={songName}
                  // onFocus={handleInputFocus}
                  // onBlur={handleInputBlur}
                />

                <StyledButton onClick={() => handleSave()}>
                  save song
                </StyledButton>
              </ColumnDiv>

              <span>{songSaved ? songSaved : ""}</span>
              {loadUserSongs ? (
                <LoadingSongsDiv>
                  <ColumnDiv>
                    <label>Load Song:</label>
                    {/* <select value={loadSong} onChange={handleLoadSong}> */}
                    <select
                      value={loadSong}
                      onChange={(e) => {
                        console.log(setLoadSong)
                        setLoadSong(e.target.value)
                      }}
                    >
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
                  </ColumnDiv>
                </LoadingSongsDiv>
              ) : (
                <span>loading songs...</span>
              )}
              <ColumnDiv>
                {loadSong !== "75442486-0878-440c-9db1-a7006c25a39f" && (
                  <DeleteButton onClick={() => handleDelete()}>
                    delete currently loaded song
                  </DeleteButton>
                )}
                <span>{songDeleted ? songDeleted : ""}</span>
              </ColumnDiv>
            </>
          )}
        </>
      ) : (
        <span>log in to see your saved songs</span>
      )}
    </MainDiv>
  )
}

export default LoadSaveTestButtons
const LoadingSongsDiv = styled.div``
const DeleteButton = styled.button`
  margin: 20px;
`
const MainDiv = styled.div`
  width: 1900px;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: row;
`
const LoadedUserDiv = styled.div``

const ColumnDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0px 20px;
`

const StyledButton = styled.button`
  background-color: white;
  border: 5px solid #b6cfcf;
  border-radius: 10px;
  margin: 0px;
  color: #3d5c5c;
  font-size: 16px;

  font-family: Arial, Helvetica, sans-serif;
  :hover {
    cursor: pointer;
    border: 5px solid #88b1b1;
  }
`
