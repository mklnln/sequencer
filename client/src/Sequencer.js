import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { MusicParametersContext } from './App.js'
import {
    generateAreChordBeatsCheckedInitialState,
    makeNewChordMaster,
    makeNewMelodyMaster,
    loadChangedSongList,
    giveOctaveNumber,
    makeNotesToPlayMaster,
    handleNoteClick,
} from './Helpers'
import { playSample, getFile, setupSample, playSynth } from './AudioEngine.js'
import styled from 'styled-components'
import HookTheoryChordButton from './Components/HookTheoryChordButton'
import Parameters from './Parameters'
import { useAuth0 } from '@auth0/auth0-react'
import RowOfNotes from './Components/RowOfNotes'
import BeatMarkers from './Components/BeatMarkers'
import { MemoCheckboxRow } from './Components/CheckboxRow'
const Sequencer = () => {
    // const [tempo, setTempo] = useState(150)
    // todo make this context one object?
    // todo what gets used here in sequencer as opposed to elsewhere? mb i can skip bringing them into here
    const {
        // tempo,
        // setTempo,
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
        songSavedOrDeleted,
        setSongSavedOrDeleted,
        setSongDeleted,
        handleLoadSongsFetch,
        loadSong,
        setLoadSong,
        setSongName,
        songName,
        areChordBeatsChecked,
        setAreChordBeatsChecked,
        areMelodyBeatsChecked,
        // setAreMelodyBeatsChecked,
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
    const { isAuthenticated, user } = useAuth0()

    const [tempo, setTempo] = useState(60)
    console.log(stepCount, 'sequencer reander')
    // const [notesToPlay, setNotesToPlay] = useState({ melody: {}, chords: {} })

    const [notesToPlay, setNotesToPlay] = useState(
        makeNotesToPlayMaster(stepCount)
    )
    // let playing = false

    // ! can likely be replaced with good ol' Ref.
    let currentBeat = 1

    // todo find out what these are used for
    // const playingRef = useRef(playing)
    const currentBeatRef = useRef(1)
    const romanNumeralReference = {
        major: {
            1: 'I',
            2: 'ii',
            3: 'iii',
            4: 'IV',
            5: 'V',
            6: 'vi',
            7: 'vii',
            8: 'I',
        },
    }

    // * this array is for visual purposes. try state though?
    const notesInQueue = []
    const scheduleBeat = (beatNumber, time) => {
        notesInQueue.push({ note: beatNumber, time })
    }
    const secondsPerBeat = tempo / 60

    // todo make helper
    const handleChordClick = (chordID, index) => {
        setHookTheoryChords([])
        console.log(hookTheoryChords)
        let newChosenAPIChords = []
        console.log(chosenAPIChords)
        console.log(chordID)
        if (chosenAPIChords === '') {
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
                arrayReplacement.push(
                    areChordBeatsChecked[`chord-${chordID}`][index]
                )
            }
        })
        console.log(arrayReplacement.length, stepCount)
        if (arrayReplacement.length === stepCount) {
            setAreChordBeatsChecked({
                ...areChordBeatsChecked,
                [chordShortcut]: [...arrayReplacement],
            })

            setChordInputStep((chordInputStep) => chordInputStep + 4)
        }
    }

    // todo make helper
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
                    areChordBeatsChecked[`chord-${chosenAPIChords[chordID]}`][
                        index
                    ]
                )
            }
            console.log(chordID)
            console.log(arrayReplacement)
        })
        if (arrayReplacement.length === stepCount) {
            // todo update chosenapichords state
            const replaceAPIChords = []
            setAreChordBeatsChecked({
                ...areChordBeatsChecked,
                [chordShortcut]: [...arrayReplacement],
            })
        }
    }

    useEffect(() => {
        fetch('https://api.hooktheory.com/v1/trends/nodes', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: process.env.REACT_APP_HOOK_THEORY_BEARER,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setHookTheoryChords(data.slice(0, 4)) // slice takes only the first 4 array items
            })
            .catch((error) => {
                console.log(error)
            })
    }, [chosenAPIChords])

    // todo ? show songs with the given chord progression
    useEffect(() => {
        // todo fit chosen chords in format 1,4 in ${}
        if (chosenAPIChords.length > 0) {
            fetch(
                `https://api.hooktheory.com/v1/trends/nodes?cp=${chosenAPIChords.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: process.env.REACT_APP_HOOK_THEORY_BEARER,
                    },
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    // i only take chords from the api that match those i've put in the sequencer
                    const removeUnsupportedChords = data.filter((chord) => {
                        return chord['chord_ID'].length <= 1
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
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: process.env.REACT_APP_HOOK_THEORY_BEARER,
                    },
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    console.log(data, 'hook API givin songs w chords')
                    data.forEach((song) => {
                        APISongs.push(song)
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [chosenAPIChords])

    // when inputting a chord via the API buttons, chordInputStep will increment. if it becomes greater than the stepCount, it will reset.
    useEffect(() => {
        if (chordInputStep > stepCount) setChordInputStep(1)
    }, [chordInputStep])

    // when the user selects a different amount of steps, change the notes arrays to accomodate that.
    useEffect(() => {
        const newMaster = makeNewChordMaster(
            makeChordNotesState,
            areChordBeatsChecked,
            blankStepCountArray
        )
        setAreChordBeatsChecked(newMaster)
        const newMelodyMaster = makeNewMelodyMaster(
            makeMelodyNotesState,
            areMelodyBeatsChecked,
            blankStepCountArray
        )
        // setAreMelodyBeatsChecked(newMelodyMaster)
        setNotesToPlay(makeNotesToPlayMaster(stepCount))
    }, [stepCount])
    console.log(notesToPlay)
    // upon clicking a different song to load, the loadSong state changes. this updates all the parameters on screen to match those saved in the DB
    useEffect(() => {
        if (loadSong !== '75442486-0878-440c-9db1-a7006c25a39f') {
            // when the user clicks on a button after loading a song, i want to consider that loadSong is no longer the song on the screen, so we can't delete it. we can only delete it if no changes are made. in order to determine what is the new, unsaved song, we give it this long, complicated name so that a user is exceedingly unlikely to accidentally delete one of their own songs by mistake
            const song = loadUserSongs[loadSong]
            setRootNote(song['rootNote'])
            setStepCount(song['stepCount'])
            setTempo(song['tempo'])
            setWonkFactor(song['wonkFactor'])
            setMelodyVolume(song['melodyVolume'])
            setChordsVolume(song['chordsVolume'])
            setSound(song['sound'])
            setFilterCutoff(song['filterCutoff'])
            setAttack(song['attack'])
            setDecay(song['decay'])
            setSustain(song['sustain'])
            setRelease(song['release'])
            setAreChordBeatsChecked(song['areChordBeatsChecked'])
            // setAreMelodyBeatsChecked(song['areMelodyBeatsChecked'])
            console.log('load song?!?!?!?')
        }
    }, [loadSong])

    // upon saving or deleting a song, update the song list.
    useEffect(() => {
        loadChangedSongList(
            songSavedOrDeleted,
            user,
            setLoadUserSongs,
            setSongSavedOrDeleted,
            handleLoadSongsFetch
        )
    }, [songSavedOrDeleted])

    const countReRenders = useRef(1)

    useEffect(() => {
        countReRenders.current = countReRenders.current + 1
    })

    const countCheckboxRenders = useRef(1)
    const bubbleUpCheckboxInfo = useCallback(
        (beatNum, scaleIndex, whichGrid) => {
            handleBubble(beatNum, scaleIndex, whichGrid)
            // handleNoteClick(
            //     beatNum,
            //     scaleIndex,
            //     whichGrid,
            //     // ! gotta adapt away from areXChecked stuff
            //     notesToPlay,
            //     setNotesToPlay
            // )
        },
        []
    )

    const handleBubble = useCallback(
        (...args) => {
            handleNoteClick(notesToPlay, setNotesToPlay, ...args)
        },
        [notesToPlay]
    )

    // todo take bubble up info, send it to handleNoteClick
    // ? do i have to

    return (
        <>
            <span>
                Sequencer.js has rendered {countReRenders.current} times.
            </span>
            <Parameters
                currentBeat={currentBeat}
                currentBeatRef={currentBeatRef}
                makeChordNotesState={makeChordNotesState}
                makeMelodyNotesState={makeMelodyNotesState}
                areMelodyBeatsChecked={areMelodyBeatsChecked}
                areChordBeatsChecked={areChordBeatsChecked}
                notesToPlay={notesToPlay}
            />
            <MelodySequencerGrid>
                {countCheckboxRenders.current}
                <AllBoxesDiv>
                    {makeMelodyNotesState.map((note, index) => {
                        const scaleIndex = index + 1
                        return (
                            <MemoCheckboxRow
                                key={`${note}`}
                                countCheckboxRenders={countCheckboxRenders}
                                areXBeatsChecked={areMelodyBeatsChecked}
                                blankStepCountArray={blankStepCountArray}
                                makeMelodyNotesState={makeMelodyNotesState}
                                // setAreXBeatsChecked={setAreMelodyBeatsChecked}
                                scaleIndex={
                                    Object.keys(areMelodyBeatsChecked).length +
                                    1 -
                                    scaleIndex
                                }
                                whichGrid="melody"
                                noteTitle={giveOctaveNumber(note.substring(5))} // convert "note-5" to just "5"
                                // notesToPlay={notesToPlay}
                                // setNotesToPlay={setNotesToPlay}
                                bubbleUpCheckboxInfo={bubbleUpCheckboxInfo}
                            />
                        )
                    })}

                    <PointerContainer>
                        {/* make component, pass it blankstepcountarray, bob uncle */}
                        <BeatMarkers
                            blankStepCountArray={blankStepCountArray}
                            currentBeat={currentBeat}
                            currentBeatRef={currentBeatRef}
                        />
                        {/* //! dont delete this until we sure that we can highlight the beats without it */}
                        {/* {blankStepCountArray.map((step, index) => {
                            const num = index + 1
                            // every 2 beats make a div
                            if ((index + 1) % 2 === 0) {
                                return (
                                    <>
                                        <BeatMarker
                                            key={num}
                                            className={
                                                currentBeat === num ||
                                                currentBeat === num + 1 ||
                                                num === currentBeatRef.current
                                                    ? 'current'
                                                    : ''
                                            }
                                        >
                                            <BeatSpan
                                                key={num}
                                                className={
                                                    currentBeat === num ||
                                                    currentBeat === num + 1 ||
                                                    num ===
                                                        currentBeatRef.current
                                                        ? 'current'
                                                        : ''
                                                }
                                            >
                                                {num / 2}
                                            </BeatSpan>
                                        </BeatMarker>
                                    </>
                                )
                            }
                        })} */}
                        {/* //! dont delete this until we sure that we can highlight the beats without it */}
                    </PointerContainer>
                </AllBoxesDiv>
            </MelodySequencerGrid>
            <ChordSequencerGrid>
                <AllBoxesDiv>
                    {Object.keys(areChordBeatsChecked).map((note, index) => {
                        const scaleIndex = note.substring(5)
                        return (
                            <MemoCheckboxRow
                                key={`${note}`}
                                // areXBeatsChecked={areChordBeatsChecked}
                                // setAreXBeatsChecked={setAreChordBeatsChecked}
                                blankStepCountArray={blankStepCountArray}
                                scaleIndex={scaleIndex}
                                beatNum={index + 1}
                                whichGrid="chords"
                                noteTitle={
                                    romanNumeralReference['major'][scaleIndex]
                                }
                                // notesToPlay={notesToPlay}
                                // setNotesToPlay={setNotesToPlay}
                            />
                        )
                    })}

                    <PointerContainer>
                        <BeatMarkers
                            blankStepCountArray={blankStepCountArray}
                            currentBeat={currentBeat}
                            currentBeatRef={currentBeatRef}
                        />
                    </PointerContainer>
                </AllBoxesDiv>
            </ChordSequencerGrid>
            <HookTheoryChordsDiv>
                {hookTheoryChords.length !== 0 && hookTheoryChords !== '' ? (
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
                        {hookTheoryChords === '' ? (
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
    height: 300px;
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

const AllBoxesDiv = styled.div`
    display: flex;
    height: 300px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    padding-left: 20px;
`
