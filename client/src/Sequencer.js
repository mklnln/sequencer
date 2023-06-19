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
    makeDeepCopy,
} from './FrontEndHelpers.js'
import { romanNumeralReference } from './BigObjectsAndArrays.js'
import { playSample, getFile, setupSample, playSynth } from './AudioEngine.js'
import styled from 'styled-components'
import HookTheoryChordButton from './Components/HookTheoryChordButton'
import Parameters from './Parameters'
import { useAuth0 } from '@auth0/auth0-react'
import RowOfNotes from './Components/RowOfNotes'
import BeatMarkers from './Components/BeatMarkers'
import CheckboxRow from './Components/CheckboxRow'
const Sequencer = () => {
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
    // const [notesToPlay, setNotesToPlay] = useState({ melody: {}, chords: {} })

    const [notesToPlay, setNotesToPlay] = useState(
        makeNotesToPlayMaster(stepCount)
    )
    const [sendChordPattern, setSendChordPattern] = useState(null)

    const [clickedNote, setClickedNote] = useState({
        beatNum: null,
        scaleIndex: null,
        whichGrid: null,
    })
    // let playing = false

    // ! can likely be replaced with good ol' Ref.
    let currentBeat = 1

    // todo find out what these are used for
    // const playingRef = useRef(playing)
    const currentBeatRef = useRef(1)

    // todo make helper
    const handleChordClick = (chordID, index) => {
        setHookTheoryChords([]) // may have previously used this to trigger useEffect
        let newChosenAPIChords = [] // new array to setState with
        if (chosenAPIChords === '') {
            //
            newChosenAPIChords.push(chordID)
        } else {
            newChosenAPIChords = [...chosenAPIChords]
            newChosenAPIChords.push(chordID)
        }
        // we want to track this so we can send the request to the API to get chords based on this
        setChosenAPIChords(newChosenAPIChords)
        // finished, logic for tracking chords

        // begin logic for updating noteState
        // todo adapt for notesToPlay
        // ! consider pattern
        let pattern = [1, 1, 1, 1] // play all notes

        // ? most efficient way to take the pattern and then put it into notesToPlay?
        // notesToPlay: {beat-1: {}, beat-2: {}, beat-3: {}, etc}
        // for loop and if pattern[i] === 1, add to notesToPlay?
        // how do i access the beat? its related to chordInputStep + i

        // todo TWO IDEAS:
        // * makeDeepCopy
        // ---- have
        // * spread operate
        // ---- blech gotta do many ones, and if i do the pattern it might not be easy to setState with that

        let notesCopy = makeDeepCopy(notesToPlay)

        // ? do i want to go in and delete what's already there?
        // if there's nothing there, then we wont be able to delete nothing, then we're adding a process every time to ask if it exists
        // mb not worth it
        // ! idk, just leave it for now, test it once its running
        // gpt4
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i]) {
                let inputBeat = chordInputStep + i
                let beat = `beat-${inputBeat}`
                let note = `note-${chordID}`

                // || means if it doesn't exist, create it
                notesCopy[beat] = notesCopy[beat] || {}
                notesCopy[beat][note] = notesCopy[beat][note] || {}
                notesCopy[beat][note]['chords'] = 1
            }

            // ! if we want to delete what's already there, do this. gpt3
            // for (let i = 0; i < pattern.length; i++) {
            //     const inputBeat = chordInputStep + i;
            //     const beatNotes = notesCopy[`beat-${inputBeat}`] || (notesCopy[`beat-${inputBeat}`] = {});
            //     const chordNotes = beatNotes[`note-${chordID}`] || (beatNotes[`note-${chordID}`] = {});

            //     if (pattern[i]) {
            //         chordNotes['chords'] = 1;
            //     } else {
            //         delete chordNotes['chords'];
            //     }
            // }
        }
        let chordInputStepCopy = chordInputStep
        console.log(chordInputStepCopy)
        setNotesToPlay(notesCopy)
        setSendChordPattern({
            pattern: pattern,
            note: chordID,
            chordInputStepCopy: chordInputStepCopy,
        })
        setChordInputStep((chordInputStep) => chordInputStep + 4)
        console.log(chordInputStepCopy, 'input step copy')
    }
    console.log(chordInputStep, 'input step')

    // ? do i want hookTheoryChords in state? triggers a rerender when it changes. mb id prefer a useRef so it doesnt trigger a rerender. we need it to persist in the event of rendering due to something else
    useEffect(() => {
        console.log(process.env.REACT_APP_HOOK_THEORY_BEARER, 'ENV VARIABLE!!')
        if (hookTheoryChords.length === 0) {
            fetch('https://api.hooktheory.com/v1/trends/nodes', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.REACT_APP_HOOK_THEORY_BEARER}`,
                },
            })
                .then((res) => res.json()) // D-04-33-02 9pm-6am, glen royal vic 1001 decarie 843-1568 grace
                .then((data) => {
                    setHookTheoryChords(data.slice(0, 4)) // slice takes only the first 4 array items
                })
                .catch((error) => {
                    console.log(error, 'NOOOOOOOOOO')
                })
        } else if (chosenAPIChords.length > 0) {
            fetch(
                `https://api.hooktheory.com/v1/trends/nodes?cp=${chosenAPIChords.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.REACT_APP_HOOK_THEORY_BEARER}`,
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
        // todo give back 3 random songs, provide link to hooktheory site?
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
    // useEffect(() => {
    //     if (chordInputStep > stepCount) setChordInputStep(1)
    // }, [chordInputStep])

    // when the user selects a different amount of steps, change the notes arrays to accomodate that.

    if (stepCount !== Object.keys(notesToPlay).length) {
        setNotesToPlay(makeNotesToPlayMaster(stepCount))
    }

    // todo either set all these things wherever you change loadSong, or ask if song !== current song, if so, change these states. remove useFX
    // upon clicking a different song to load, the loadSong state changes. this updates all the parameters on screen to match those saved in the DB
    // useEffect(() => {
    //     if (loadSong !== '75442486-0878-440c-9db1-a7006c25a39f') {
    //         // when the user clicks on a button after loading a song, i want to consider that loadSong is no longer the song on the screen, so we can't delete it. we can only delete it if no changes are made. in order to determine what is the new, unsaved song, we give it this long, complicated name so that a user is exceedingly unlikely to accidentally delete one of their own songs by mistake
    //         const song = loadUserSongs[loadSong]
    //         setRootNote(song['rootNote'])
    //         setStepCount(song['stepCount'])
    //         setTempo(song['tempo'])
    //         setWonkFactor(song['wonkFactor'])
    //         setMelodyVolume(song['melodyVolume'])
    //         setChordsVolume(song['chordsVolume'])
    //         setSound(song['sound'])
    //         setFilterCutoff(song['filterCutoff'])
    //         setAttack(song['attack'])
    //         setDecay(song['decay'])
    //         setSustain(song['sustain'])
    //         setRelease(song['release'])
    //         setAreChordBeatsChecked(song['areChordBeatsChecked'])
    //         // setAreMelodyBeatsChecked(song['areMelodyBeatsChecked'])
    //         console.log('load song?!?!?!?')
    //     }
    // }, [loadSong])

    // // upon saving or deleting a song, update the song list.
    // useEffect(() => {
    //     loadChangedSongList(
    //         songSavedOrDeleted,
    //         user,
    //         setLoadUserSongs,
    //         setSongSavedOrDeleted,
    //         handleLoadSongsFetch
    //     )
    // }, [songSavedOrDeleted])

    const countReRenders = useRef(1)

    useEffect(() => {
        countReRenders.current = countReRenders.current + 1
    })

    const countCheckboxRenders = useRef(1)

    // ! this function changes each render if we pass it notesToPlay, thus we prevent extra renders by removing it as a dependency
    // this requires the if (clickedNote) seen below to watch for changes. according to dev tools, 1/10th the render time without notesToPlay in useCallback!!
    const bubbleUpCheckboxInfo = useCallback(
        (beatNum, scaleIndex, whichGrid) => {
            setClickedNote({
                beatNum: beatNum,
                scaleIndex: scaleIndex,
                whichGrid: whichGrid,
            })
            console.log('useCallback only gets called ONCE')
        },
        []
    )
    // ? without both if conditions, problems. only 1st, we add note-null to beat-1. only 2nd, 'cannot read properties of null'
    if (clickedNote && clickedNote.scaleIndex !== null) {
        console.log('handleNoteClick gets called A BUNCH OF TIMES')
        handleNoteClick(
            notesToPlay,
            setNotesToPlay,
            clickedNote,
            setClickedNote
        )
    }

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
                            <CheckboxRow
                                key={`${note}`}
                                countCheckboxRenders={countCheckboxRenders}
                                areXBeatsChecked={areMelodyBeatsChecked}
                                blankStepCountArray={blankStepCountArray}
                                makeMelodyNotesState={makeMelodyNotesState}
                                scaleIndex={
                                    Object.keys(areMelodyBeatsChecked).length +
                                    1 -
                                    scaleIndex
                                }
                                whichGrid="melody"
                                noteTitle={giveOctaveNumber(note.substring(5))} // convert "note-5" to just "5"
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
                    {/* {makeChordNotesState.map((note, index) => {
                        const scaleIndex = note.substring(5)
                        const commonProps = {

                        }
                        if (sendChordPattern) {
                            return (
                                <CheckboxRow
                                    
                                    sendChordPattern={sendChordPattern}
                                    setSendChordPattern={setSendChordPattern}
                                />
                            )
                        } else {
                            return (
                                <CheckboxRow
                                    key={`${note}`}
                                    blankStepCountArray={blankStepCountArray}
                                    scaleIndex={scaleIndex}
                                    beatNum={index + 1}
                                    whichGrid="chords"
                                    noteTitle={
                                        romanNumeralReference['major'][
                                            scaleIndex
                                        ]
                                    }
                                    bubbleUpCheckboxInfo={bubbleUpCheckboxInfo}
                                />
                            )
                        }
                    })} */}

                    {makeChordNotesState.map((note, index) => {
                        const scaleIndex = note.substring(5)
                        const commonProps = {
                            key: `${note}`,
                            blankStepCountArray,
                            scaleIndex,
                            beatNum: index + 1,
                            whichGrid: 'chords',
                            noteTitle:
                                romanNumeralReference['major'][scaleIndex],
                            bubbleUpCheckboxInfo,
                        }
                        return (
                            // send normal props, but also give sendChordPattern if that particular row needs it, according to scaleIndex
                            <CheckboxRow
                                {...commonProps}
                                {...(sendChordPattern?.note === scaleIndex && {
                                    sendChordPattern,
                                    setSendChordPattern,
                                    chordInputStep,
                                })}
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
