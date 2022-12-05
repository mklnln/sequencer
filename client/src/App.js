import {useState, createContext} from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Header from "./Components/Header"
import Sequencer from "./Sequencer"
import GlobalStyle from "./globalStyles"
import {generateAreBeatsCheckedInitialState} from "./Helpers"
export const MusicParametersContext = createContext()
const App = () => {
  const audioContext = new AudioContext()
  const [amtOfNotes, setAmtOfNotes] = useState(8) // amt of chords, i.e. how many ROWS are there
  const [stepCount, setStepCount] = useState(16) // amt of steps, i.e. how many COLUMNS are there
  const makeMelodyNotesState = []
  // [8,7,6,5,4,3,2,1] where amtofnotes = 8
  for (let i = amtOfNotes * 2 - 1; i > 0; i--) {
    makeMelodyNotesState.push(i)
  }

  const makeChordNotesState = []
  // [8,7,6,5,4,3,2,1] where amtofnotes = 8
  for (let i = amtOfNotes; i > 0; i--) {
    makeChordNotesState.push(i)
  }
  const blankStepCountArray = []
  // [0,0,0,0,0,0,0,0] where stepCount = 8
  for (let i = stepCount; i > 0; i--) {
    blankStepCountArray.push(0)
  }
  const [areBeatsChecked, setAreBeatsChecked] = useState(
    generateAreBeatsCheckedInitialState(
      makeChordNotesState,
      makeMelodyNotesState,
      blankStepCountArray,
      "chords"
    )
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
  const [areMelodyBeatsChecked, setAreMelodyBeatsChecked] = useState(
    generateAreBeatsCheckedInitialState(
      makeChordNotesState,
      makeMelodyNotesState,
      blankStepCountArray,
      "melody"
    )
  )
  const [tempo, setTempo] = useState(60)
  const [rootNote, setRootNote] = useState(0)
  const [wonkFactor, setWonkFactor] = useState(1)
  const [attack, setAttack] = useState(2)
  const [melodyVolume, setMelodyVolume] = useState(75)
  const [chordsVolume, setChordsVolume] = useState(50)
  const [sound, setSound] = useState("sine")
  const [filterCutoff, setFilterCutoff] = useState(7500)
  const [decay, setDecay] = useState(20)
  const [sustain, setSustain] = useState(20)
  const [release, setRelease] = useState(20)
  const [chordInputStep, setChordInputStep] = useState(1)
  const [chosenAPIChords, setChosenAPIChords] = useState([])
  const [hookTheoryChords, setHookTheoryChords] = useState([])
  const [loadUserSongs, setLoadUserSongs] = useState(null)
  const [loadSong, setLoadSong] = useState(
    "75442486-0878-440c-9db1-a7006c25a39f"
  )
  const [songName, setSongName] = useState("")
  const [songSaved, setSongSaved] = useState(false)
  const [songDeleted, setSongDeleted] = useState(false)

  // remove non-song data from the BE document
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

  return (
    <BrowserRouter>
      <MusicParametersContext.Provider
        value={{
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
          loadSong,
          setLoadSong,
          songName,
          setSongName,
          melodyVolume,
          setMelodyVolume,
          chordsVolume,
          setChordsVolume,
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
          songDeleted,
          setSongDeleted,
          handleLoadSongsFetch,
          areBeatsChecked,
          setAreBeatsChecked,
          areMelodyBeatsChecked,
          amtOfNotes,
          setAmtOfNotes,
          setAreMelodyBeatsChecked,
          makeChordNotesState,
          makeMelodyNotesState,
          blankStepCountArray,
          chosenAPIChords,
          hookTheoryChords,
          setHookTheoryChords,
          setChosenAPIChords,
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
