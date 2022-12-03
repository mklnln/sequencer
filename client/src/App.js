import {useEffect, useState, useRef, createContext, Fragment} from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Header from "./Components/Header"
import Checkbox from "./Components/Checkbox"
import PlayBeatChord from "./PlayBeatChord"
import Sequencer from "./Sequencer"
import styled from "styled-components"
import LoginButton from "./Components/LoginButton"
import LogoutButton from "./Components/LogoutButton"
import {GlobalStyleComponent} from "styled-components"
import GlobalStyle from "./globalStyles"
export const MusicParametersContext = createContext()
// ? do i even need context?

const App = () => {
  const [tempo, setTempo] = useState(150)
  const [stepCount, setStepCount] = useState(16) // amt of steps, i.e. how many COLUMNS are there
  const [rootNote, setRootNote] = useState(0)
  const [wonkFactor, setWonkFactor] = useState(1)
  const [attack, setAttack] = useState(2)
  const [volume, setVolume] = useState(50)
  const [sound, setSound] = useState("sine")
  const [filterCutoff, setFilterCutoff] = useState(7500)
  const [decay, setDecay] = useState(20)
  const [sustain, setSustain] = useState(20)
  const [release, setRelease] = useState(20)
  const [chordToHover, setChordToHover] = useState({})
  const [chordInputStep, setChordInputStep] = useState(1)
  const [loadUserSongs, setLoadUserSongs] = useState(null)
  const [songSaved, setSongSaved] = useState(false)
  const handleLoadSongsFetch = (songsAndIDs) => {
    console.log(songsAndIDs, "oyoyoyoyo")
    const keysToUse = Object.keys(songsAndIDs).filter((key) => {
      return key !== "userID" && key !== "_id"
    })
    const newState = {}
    keysToUse.forEach((key) => {
      newState[key] = songsAndIDs[key]
      // return {[key]: songsAndIDs[key]}
    })
    console.log(newState)
    return newState
  }
  // * we couldn't make chordhover work mb because setstate in checkbox re-rendered all checkboxes and caused too many re-renders? idk. stretch goal.
  // const handleChordHover = (chordHovered) => {
  //   console.log(chordInputStep)
  //   let time = 0
  //   if (time < 1) {
  //     time++
  //     setTempo("hi")
  //   }
  // }
  return (
    <BrowserRouter>
      <MusicParametersContext.Provider
        value={{
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
          handleLoadSongsFetch,
          volume,
          setVolume,
          sound,
          setSound,
          filterCutoff,
          setFilterCutoff,
          attack,
          setAttack,
          decay,
          setDecay,
          sustain,
          setSustain,
          release,
          setRelease,
          songSaved,
          setSongSaved,
        }}
      >
        <GlobalStyle />
        <Header />
        <Routes>
          <Route>
            <Route path="/" element={<Sequencer />} />
          </Route>
        </Routes>
      </MusicParametersContext.Provider>
    </BrowserRouter>
  )
}

export default App
