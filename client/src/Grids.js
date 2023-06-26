import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { MusicParametersContext } from './App.js'
import {
    makeNotesToPlayMaster,
    handleNoteClick,
    makeDeepCopy,
    makeBlankStepCountArray,
    updateNotesToPlayMaster,
    updateBlankStepCountArray,
} from './utilities/FrontEndHelpers.js'
import {
    chordNotesArr,
    melodyNotesObj,
    romanNumeralReference,
} from './utilities/BigObjectsAndArrays.js'
import styled from 'styled-components'
import HookTheoryChordButton from './Components/HookTheoryChordButton.js'
import BeatMarkers from './Components/BeatMarkers.js'
import CheckboxRow from './Components/CheckboxRow.js'
import LoadSaveTestButtons from './Components/LoadSaveTestButtons.js'
import Sequencer from './Sequencer.js'
const Grids = () => {
    const {
        chordInputStep,
        setChordInputStep,
        chosenAPIChords,
        setChosenAPIChords,
        hookTheoryChords,
        setHookTheoryChords,
    } = useContext(MusicParametersContext)
    const [tempo, setTempo] = useState(120)

    const [sendChordPattern, setSendChordPattern] = useState(undefined)
    const [beatForAnimation, setBeatForAnimation] = useState(1)

    const [clickedNote, setClickedNote] = useState({
        beatNum: null,
        scaleIndex: null,
        whichGrid: null,
    })
    const [stepCount, setStepCount] = useState(16) // amt of steps, i.e. how many COLUMNS are there

    const [notesToPlay, setNotesToPlay] = useState(makeNotesToPlayMaster)
    const [currentBeat, setCurrentBeat] = useState(0)

    const [resetMelody, setResetMelody] = useState(false)
    const [resetChords, setResetChords] = useState(false)

    // ! "When something can be calculated from the existing props or state, don’t put it in state.
    // ! .. Instead, calculate it during rendering."
    const [blankStepCountArray, setBlankStepCountArray] = useState(
        makeBlankStepCountArray
    )

    // ! idk if i want this array as state or not. need to test more but tbh it doesnt seem to be that much better as state
    // const blankStepCountArray = makeBlankStepCountArray(stepCount)

    // ? keep as state? getting less renders in CheckboxRow thanks to state, but could use memo for a normal const instead
    // ! experiments needed: test state vs memo'd const vs non-memo const. may be inconsequential
    const melodyNotes = melodyNotesObj
    const [chordNotes] = useState(chordNotesArr)

    const currentBeatRef = useRef(0)
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
        setChosenAPIChords(newChosenAPIChords)
        let pattern = [1, 1, 1, 1] // play all notes

        let notesCopy = makeDeepCopy(notesToPlay)

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
        }
        let chordInputStepCopy = chordInputStep
        setNotesToPlay(notesCopy)
        setSendChordPattern({
            pattern: pattern,
            note: [chordID],
            chordInputStepCopy: chordInputStepCopy,
            grid: 'chords',
        })
        setChordInputStep((chordInputStep) => chordInputStep + 4)
    }
    // ? do i want hookTheoryChords in state? triggers a rerender when it changes. mb id prefer a useRef so it doesnt trigger a rerender. we need it to persist in the event of rendering due to something else
    useEffect(() => {
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

    // when the user selects a different amount of steps, change notesToPlay to accomodate that
    if (stepCount !== Object.keys(notesToPlay).length) {
        console.log(
            'we know we changed stepCount',
            stepCount,
            Object.keys(notesToPlay).length
        )
        setNotesToPlay((prev) => updateNotesToPlayMaster(stepCount, prev))
        setBlankStepCountArray(updateBlankStepCountArray(stepCount))
    }
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
        },
        []
    )
    // ? without both if conditions, problems. only 1st, we add note-null to beat-1. only 2nd, 'cannot read properties of null'
    if (clickedNote && clickedNote?.scaleIndex !== null) {
        handleNoteClick(
            notesToPlay,
            setNotesToPlay,
            clickedNote,
            setClickedNote
        )
    }

    const handleResetGrid = (e) => {
        let gridToDelete = e.target.id
        let notesCopy = { ...notesToPlay }
        let noteRowsArray = []
        for (let i = 1; i <= Object.keys(notesToPlay).length; i++) {
            let objKeys = Object.keys(notesCopy[`beat-${i}`])
            if (objKeys.length > 0) {
                for (let j = 0; j < objKeys.length; j++) {
                    if (notesCopy[`beat-${i}`][objKeys[j]]?.[gridToDelete]) {
                        delete notesCopy[`beat-${i}`][objKeys[j]]?.[
                            gridToDelete
                        ]
                        if (!noteRowsArray.includes(objKeys[j])) {
                            noteRowsArray.push(objKeys[j].substring(5))
                        }
                    }

                    if (
                        Object.keys(notesCopy[`beat-${i}`][objKeys[j]]).length <
                        1
                    ) {
                        delete notesCopy[`beat-${i}`][objKeys[j]]
                    }
                }
            }
        }
        setNotesToPlay(notesCopy)
        console.log(noteRowsArray, 'rows arr')
        // create pattern to send, array of length === stepCount with 0,0,0...

        // create array under notes that has the note-x value for each checkbox row that has notesToPlay values we need to turn off
        setSendChordPattern({
            pattern: blankStepCountArray,
            note: noteRowsArray,
            chordInputStepCopy: 1,
            grid: gridToDelete,
        })
    }
    return (
        <>
            <GridsContainer>
                <span>
                    Grids.js has rendered {countReRenders.current} times.
                </span>

                <Sequencer
                    currentBeatRef={currentBeatRef}
                    notesToPlay={notesToPlay}
                    tempo={tempo}
                    setTempo={setTempo}
                    beatForAnimation={beatForAnimation}
                    setBeatForAnimation={setBeatForAnimation}
                    stepCount={stepCount}
                    setStepCount={setStepCount}
                    currentBeat={currentBeat}
                    setCurrentBeat={setCurrentBeat}
                />
                <LoadSaveTestButtons notesToPlay={notesToPlay} />
                <MelodySequencerGrid>
                    {/* {countCheckboxRenders.current} */}
                    <AllBoxesDiv>
                        <GridTitleAndResetDiv>
                            <GridTitle>MELODY</GridTitle>
                            <ResetButton onClick={handleResetGrid}>
                                <ResetSpan id="melody">RESET</ResetSpan>
                            </ResetButton>
                        </GridTitleAndResetDiv>
                        {Object.keys(melodyNotes).map((note, index) => {
                            const scaleIndex = note.substring(5)
                            const commonProps = {
                                key: `${note}`,
                                blankStepCountArray,
                                scaleIndex,
                                beatNum: index + 1,
                                whichGrid: 'melody',
                                noteTitle: melodyNotes[note],
                                bubbleUpCheckboxInfo,
                                notesToPlay,
                                setNotesToPlay,
                            }
                            return (
                                <CheckboxRow
                                    {...commonProps}
                                    {...(sendChordPattern?.note.includes(
                                        scaleIndex
                                    ) &&
                                        sendChordPattern?.grid !== 'chords' && {
                                            sendChordPattern,
                                            setSendChordPattern,
                                        })}
                                />
                            )
                        })}
                        {/* make component, pass it blankstepcountarray, bob uncle */}
                        <BeatMarkers
                            blankStepCountArray={blankStepCountArray}
                            currentBeat={currentBeat}
                            whichGrid="melody"
                        />
                    </AllBoxesDiv>
                </MelodySequencerGrid>
                <ChordSequencerGrid>
                    <AllBoxesDiv>
                        <GridTitleAndResetDiv>
                            <GridTitle>CHORDS</GridTitle>
                            <ResetButton onClick={handleResetGrid}>
                                <ResetSpan id="chords">RESET</ResetSpan>
                            </ResetButton>
                        </GridTitleAndResetDiv>
                        {chordNotes.map((note, index) => {
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
                                notesToPlay,
                                setNotesToPlay,
                            }
                            return (
                                // send normal props, but also give sendChordPattern if that particular row needs it, according to scaleIndex
                                <CheckboxRow
                                    {...commonProps}
                                    {...(sendChordPattern?.note.includes(
                                        scaleIndex
                                    ) && {
                                        sendChordPattern,
                                        setSendChordPattern,
                                    })}
                                />
                            )
                        })}

                        <BeatMarkers
                            blankStepCountArray={blankStepCountArray}
                            currentBeat={currentBeat}
                            whichGrid="chords"
                        />
                    </AllBoxesDiv>
                </ChordSequencerGrid>
                <HookTheoryChordsDiv>
                    {hookTheoryChords.length !== 0 &&
                    hookTheoryChords !== '' ? (
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
            </GridsContainer>
        </>
    )
}

export default Grids

const GridsContainer = styled.div`
    margin: 15px;
`

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
    width: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const GridTitleAndResetDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin: 7px;
    align-items: center;
    padding-bottom: 2px;
`
const GridTitle = styled.span`
    letter-spacing: 0.15em;
    margin: auto;
`

const ResetButton = styled.div`
    border: 1px solid var(--lightest-color);

    position: absolute;
    display: flex;
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        color: black;
    }
`

const ResetSpan = styled.span`
    padding: 4px 6px;
    :hover {
        color: black;
    }
`

const HookTheoryChordsDiv = styled.div`
    height: 60px;
    margin: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
`
