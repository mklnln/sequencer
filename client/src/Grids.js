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
    fakeSong,
    melodyNotesObj,
    romanNumeralReference,
} from './utilities/BigObjectsAndArrays.js'
import styled from 'styled-components'
import HookTheoryChordButton from './Components/HookTheoryChordButton.js'
import BeatMarkers from './Components/BeatMarkers.js'
import CheckboxRow from './Components/CheckboxRow.js'
import LoadSaveTestButtons from './Components/LoadSaveTestButtons.js'
import Sequencer from './Sequencer.js'
import { getAPIChordsFetch } from './utilities/APIfetches.js'
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

    const [clickedNote, setClickedNote] = useState({
        beatNum: null,
        scaleIndex: null,
        whichGrid: null,
    })

    const [notesToPlay, setNotesToPlay] = useState(makeNotesToPlayMaster)
    const [currentBeat, setCurrentBeat] = useState(0)

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
    const [parameterValuesObj, setParameterValuesObj] = useState({
        tempo: 120,
        wonk: 0,
        melody: 100,
        chords: 100,
        attack: 1,
        decay: 15,
        sustain: 60,
        release: 5,
        filter: 7500,
        sound: 'Sine',
        steps: 16,
        root: 1,
    })

    const [changedParameter, setChangedParameter] = useState({
        title: '',
        value: null,
    })

    const bubbleUpParameterInfo = useCallback((value, title) => {
        setChangedParameter({
            title: title.toLowerCase(),
            value: value,
        })
    }, [])

    if (changedParameter?.value) {
        let obj = { ...parameterValuesObj }
        obj[changedParameter.title] = changedParameter.value
        setParameterValuesObj(obj)
        setChangedParameter(null)
    }

    const bubbleUpCurrentSongChange = useCallback((notesToPlay, parameters) => {
        setNotesToPlay(notesToPlay)
        setParameterValuesObj(parameters)
        setBlankStepCountArray(
            updateBlankStepCountArray(Object.keys(notesToPlay).length)
        )
    }, [])

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
        getAPIChordsFetch(setHookTheoryChords, chosenAPIChords)

        // * the below is for getting songs with the specific chord progression.
        // todo give back 3 random songs, provide link to hooktheory site?
        // if (chosenAPIChords.length >= 4) {
        //     // this works but only gives 20 results. i dont want to just exclusively give back artists with A in their name, lol.
        //     const APISongs = []
        //     let page = 1
        //     fetch(
        //         `https://api.hooktheory.com/v1/trends/songs?cp=${chosenAPIChords.toString()}`,
        //         {
        //             method: 'GET',
        //             headers: {
        //                 Accept: 'application/json',
        //                 'Content-Type': 'application/json',
        //                 Authorization: process.env.REACT_APP_HOOK_THEORY_BEARER,
        //             },
        //         }
        //     )
        //         .then((res) => res.json())
        //         .then((data) => {
        //             console.log(data, 'hook API givin songs w chords')
        //             data.forEach((song) => {
        //                 APISongs.push(song)
        //             })
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //         })
        // }
    }, [chosenAPIChords])

    // when the user selects a different amount of steps, change notesToPlay to accomodate that
    if (parameterValuesObj.steps !== Object.keys(notesToPlay).length) {
        console.log('YA LETS RERENDER')
        setNotesToPlay((prev) =>
            updateNotesToPlayMaster(parameterValuesObj.steps, prev)
        )
        setBlankStepCountArray(
            updateBlankStepCountArray(parameterValuesObj.steps)
        )
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
                <span onClick={() => setNotesToPlay(fakeSong.songs[123])}>
                    load fake notesToPlay
                </span>

                <Sequencer
                    currentBeatRef={currentBeatRef}
                    notesToPlay={notesToPlay}
                    currentBeat={currentBeat}
                    setCurrentBeat={setCurrentBeat}
                    parameterValuesObj={parameterValuesObj}
                    bubbleUpParameterInfo={bubbleUpParameterInfo}
                />
                <LoadSaveTestButtons
                    notesToPlay={notesToPlay}
                    setNotesToPlay={setNotesToPlay}
                    parameterValuesObj={parameterValuesObj}
                    setParameterValuesObj={setParameterValuesObj}
                    bubbleUpCurrentSongChange={bubbleUpCurrentSongChange}
                />
                {/* <BothSequencersDiv> */}
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
                {/* </BothSequencersDiv> */}
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
    margin: 20px;
    height: 198px;
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
// todo bring next to each other
// const BothSequencersDiv = styled.div`
//     display: flex;
//     flex-direction: row;
//     justify-content: center;
//     align-items: flex-start;
// `

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
    height: 100px;
    margin: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
`
