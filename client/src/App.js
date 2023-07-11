import { useState, createContext, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Components/Header'
import Grids from './Grids'
import GlobalStyle from './utilities/globalStyles'
import SorryMobile from './Components/SorryMobile'
import SorryNarrowWindow from './Components/SorryNarrowWindow'
import { getHookTheoryBearerToken } from './utilities/APIfetches'
export const MusicParametersContext = createContext()
const App = () => {
    // useEffect(() => {
    //     getHookTheoryBearerToken(hookTheoryChords)
    // }, [])

    const [chordInputStep, setChordInputStep] = useState(1)
    const [chosenAPIChords, setChosenAPIChords] = useState([])
    const [hookTheoryChords, setHookTheoryChords] = useState([])
    const [loadUserSongs, setLoadUserSongs] = useState(null)
    const [currentSong, setCurrentSong] = useState(null)

    const [songSavedOrDeleted, setSongSavedOrDeleted] = useState(false)
    const [songDeleted, setSongDeleted] = useState(false)

    const appRendersRef = useRef(1)

    useEffect(() => {
        appRendersRef.current = appRendersRef.current + 1
        console.log(appRendersRef.current, 'App renders')
    })

    // see if the user's browser is on a mobile device
    const mobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )

    const narrowWindow = window.innerWidth < 900

    return (
        <BrowserRouter>
            <MusicParametersContext.Provider
                value={{
                    chordInputStep,
                    setChordInputStep,
                    loadUserSongs,
                    setLoadUserSongs,
                    currentSong,
                    setCurrentSong,
                    songSavedOrDeleted,
                    setSongSavedOrDeleted,
                    songDeleted,
                    setSongDeleted,
                    chosenAPIChords,
                    hookTheoryChords,
                    setHookTheoryChords,
                    setChosenAPIChords,
                }}
            >
                <GlobalStyle />
                {mobileDevice ? (
                    <SorryMobile />
                ) : narrowWindow ? (
                    <SorryNarrowWindow />
                ) : (
                    <>
                        <Header />
                        <Routes>
                            <Route>
                                <Route path="/*" element={<Grids />} />
                            </Route>
                        </Routes>
                    </>
                )}
            </MusicParametersContext.Provider>
        </BrowserRouter>
    )
}

export default App
