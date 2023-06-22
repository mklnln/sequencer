import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { MusicParametersContext } from './App.js'
import {
    giveOctaveNumber,
    makeNotesToPlayMaster,
    handleNoteClick,
    makeDeepCopy,
    makeBlankStepCountArray,
} from './FrontEndHelpers.js'
import {
    chordNotesArr,
    melodyNotesArr,
    romanNumeralReference,
} from './BigObjectsAndArrays.js'
import styled from 'styled-components'
import HookTheoryChordButton from './Components/HookTheoryChordButton'
import Parameters from './Parameters'
import BeatMarkers from './Components/BeatMarkers'
import CheckboxRow from './Components/CheckboxRow'
const Sequencer = () => {
    const {
        chordInputStep,
        setChordInputStep,
        chosenAPIChords,
        setChosenAPIChords,
        hookTheoryChords,
        setHookTheoryChords,
    } = useContext(MusicParametersContext)
    const [tempo, setTempo] = useState(120)

    const [sendChordPattern, setSendChordPattern] = useState(null)
    const [beatForAnimation, setBeatForAnimation] = useState(1)

    const [clickedNote, setClickedNote] = useState({
        beatNum: null,
        scaleIndex: null,
        whichGrid: null,
    })
    const [stepCount, setStepCount] = useState(16) // amt of steps, i.e. how many COLUMNS are there

    const [notesToPlay, setNotesToPlay] = useState(
        makeNotesToPlayMaster(stepCount)
    )

    // ! "When something can be calculated from the existing props or state, don’t put it in state.
    // ! .. Instead, calculate it during rendering."
    // const [blankStepCountArray, setBlankStepCountArray] = useState(
    //     makeBlankStepCountArray(stepCount)
    // )

    const blankStepCountArray = makeBlankStepCountArray(stepCount)

    // ? keep as state? getting less renders in CheckboxRow thanks to state, but could use memo for a normal const instead
    // ! experiments needed: test state vs memo'd const vs non-memo const. may be inconsequential
    const [melodyNotes] = useState(melodyNotesArr)
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
            note: chordID,
            chordInputStepCopy: chordInputStepCopy,
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
        setNotesToPlay(makeNotesToPlayMaster(stepCount))
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
        let deleteGrid = e.target.id
        let notesCopy = { ...notesToPlay }
        for (let i = 1; i <= Object.keys(notesToPlay).length; i++) {
            let objKeys = Object.keys(notesCopy[`beat-${i}`])
            if (objKeys.length > 0) {
                for (let j = 0; j < objKeys.length; j++) {
                    if (notesCopy[`beat-${i}`][objKeys[j]]?.[deleteGrid]) {
                        delete notesCopy[`beat-${i}`][objKeys[j]]?.[deleteGrid]
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
    }

    return (
        <>
            <SequencerContainer>
                <span>
                    Sequencer.js has rendered {countReRenders.current} times.
                </span>
                <Parameters
                    currentBeatRef={currentBeatRef}
                    notesToPlay={notesToPlay}
                    tempo={tempo}
                    setTempo={setTempo}
                    beatForAnimation={beatForAnimation}
                    setBeatForAnimation={setBeatForAnimation}
                    stepCount={stepCount}
                    setStepCount={setStepCount}
                />
                <MelodySequencerGrid>
                    {countCheckboxRenders.current}
                    <AllBoxesDiv>
                        <GridTitleAndResetDiv>
                            <GridTitle>MELODY</GridTitle>
                            <ResetButton onClick={handleResetGrid}>
                                <ResetSpan id="melody">RESET</ResetSpan>
                            </ResetButton>
                        </GridTitleAndResetDiv>
                        {melodyNotes.map((note, index) => {
                            const scaleIndex = index + 1
                            return (
                                <CheckboxRow
                                    key={`${note}`}
                                    countCheckboxRenders={countCheckboxRenders}
                                    blankStepCountArray={blankStepCountArray}
                                    scaleIndex={
                                        Object.keys(melodyNotes).length +
                                        1 -
                                        scaleIndex
                                    }
                                    whichGrid="melody"
                                    noteTitle={giveOctaveNumber(
                                        note.substring(5)
                                    )} // convert "note-5" to just "5"
                                    bubbleUpCheckboxInfo={bubbleUpCheckboxInfo}
                                />
                            )
                        })}
                        <PointerContainer>
                            {/* make component, pass it blankstepcountarray, bob uncle */}
                            <BeatMarkers
                                blankStepCountArray={blankStepCountArray}
                                currentBeatRef={currentBeatRef}
                                beatForAnimation={beatForAnimation}
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
                                                beatForAnimation === num ||
                                                beatForAnimation === num + 1
                                                    ? 'current'
                                                    : ''
                                            }
                                        >
                                            <BeatSpan
                                                key={num}
                                                className={
                                                    beatForAnimation === num ||
                                                    beatForAnimation === num + 1
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
                            }
                            return (
                                // send normal props, but also give sendChordPattern if that particular row needs it, according to scaleIndex
                                <CheckboxRow
                                    {...commonProps}
                                    {...(sendChordPattern?.note ===
                                        scaleIndex && {
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
                                currentBeatRef={currentBeatRef}
                                beatForAnimation={beatForAnimation}
                            />
                        </PointerContainer>
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
            </SequencerContainer>
        </>
    )
}

export default Sequencer

const SequencerContainer = styled.div`
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
    height: 300px;
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
`
const GridTitle = styled.span`
    letter-spacing: 0.1em;
    margin: auto;
`

const ResetButton = styled.div`
    border: 1px solid var(--lightest-color);

    margin: 4px;
    letter-spacing: 0.1em;
    position: absolute;
    display: flex;
    align-items: center;
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        color: black;
    }
    .span {
        font-size: 4em;
        background-color: fuchsia;
    }
`

const ResetSpan = styled.span`
    width: 100%;
    height: 100%;
    padding: 4px 6px;
    :hover {
        color: black;
    }
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
const BeatMarker = styled.div`
    border-left: 1px solid var(--lightest-color);
    width: 26.5px;
    height: 20px;
    opacity: 100%;
    padding-right: 26.5px;
    display: flex;
    justify-content: center;
    &.current {
        border: 1px solid fuchsia;
    }
`
const BeatSpan = styled.span`
    // padding-left: 9px;
    color: var(--lighter-color);
    opacity: 50%;
`
