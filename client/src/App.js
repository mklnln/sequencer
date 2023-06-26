import { useState, createContext, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Components/Header'
import Grids from './Grids'
import GlobalStyle from './utilities/globalStyles'
import SorryMobile from './Components/SorryMobile'
import SorryNarrowWindow from './Components/SorryNarrowWindow'
export const MusicParametersContext = createContext()
const App = () => {
    // useEffect(() => {
    //     console.log(process.env.REACT_APP_HOOK_THEORY_USER)
    //     if (hookTheoryChords.length === 0) {
    //         fetch('https://api.hooktheory.com/v1/users/auth', {
    //             method: 'POST',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //                 // Authorization: `Bearer ${process.env.REACT_APP_HOOK_THEORY_BEARER}`,
    //             },
    //             body: JSON.stringify({
    //                 username: `${process.env.REACT_APP_HOOK_THEORY_USER}`,
    //                 password: `${process.env.REACT_APP_HOOK_THEORY_PASS}`,
    //             }),
    //         })
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 console.log(data, 'app')
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //             })
    //     }
    // }, [])

    const [chordInputStep, setChordInputStep] = useState(1)
    const [chosenAPIChords, setChosenAPIChords] = useState([])
    const [hookTheoryChords, setHookTheoryChords] = useState([])
    const [loadUserSongs, setLoadUserSongs] = useState(null)
    const [loadSong, setLoadSong] = useState(
        '75442486-0878-440c-9db1-a7006c25a39f'
    )
    const [songName, setSongName] = useState('')
    const [songSavedOrDeleted, setSongSavedOrDeleted] = useState(false)
    const [songDeleted, setSongDeleted] = useState(false)

    // remove non-song data from the BE document
    const handleLoadSongsFetch = (songsAndIDs) => {
        const keysToUse = Object.keys(songsAndIDs).filter((key) => {
            return key !== 'userID' && key !== '_id'
        })
        const newState = {}
        keysToUse.forEach((key) => {
            newState[key] = songsAndIDs[key]
        })
        console.log(
            'handle load songs fetch has run. are we calling it unnecessarily?'
        )
        return newState
    }
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
                    loadSong,
                    setLoadSong,
                    songName,
                    setSongName,
                    songSavedOrDeleted,
                    setSongSavedOrDeleted,
                    songDeleted,
                    setSongDeleted,
                    handleLoadSongsFetch,
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
