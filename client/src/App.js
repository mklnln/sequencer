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
  const [wonkFactor, setWonkFactor] = useState(120)
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
