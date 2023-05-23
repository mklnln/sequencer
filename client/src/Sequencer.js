import { useContext, useEffect, useRef, useState } from 'react'
import Checkbox from './Components/ChordCheckbox'
import { MusicParametersContext } from './App.js'
import {
    generateAreChordBeatsCheckedInitialState,
    makeNewChordMaster,
    makeNewMelodyMaster,
    loadChangedSongList,
    giveOctaveNumber,
} from './Helpers'
import { playSample, getFile, setupSample, playSynth } from './AudioEngine.js'
import styled from 'styled-components'
import HookTheoryChordButton from './Components/HookTheoryChordButton'
import Parameters from './Parameters'
import { useAuth0 } from '@auth0/auth0-react'
import RowOfNotes from './Components/RowOfNotes'
import BeatMarkers from './Components/BeatMarkers'
import CheckboxRow from './Components/CheckboxRow'
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
        setAreMelodyBeatsChecked,
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

    // * the following are clearly related to JUST the sequencer. good that they're here. no refactoring needed.
    const [tempo, setTempo] = useState(60)

    const notesToPlay = {}
    // let playing = false
    let currentBeat = 0
    let nextBeatTime = 0

    // todo find out what these are used for
    // const playingRef = useRef(playing)
    const currentBeatRef = useRef(currentBeat)

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
    // ?
    // how do we math into seconds per bpm? beats per minute. divided by 60, thats beats per second.
    // 120bpm / 60 = 2 beats per second.
    // want ms? need to divide further, so by 2000 in total
    // 120 / 60000 = 0.002 beats per ms
    // audioContext.currentTime gives seconds but to 16 decimals of precision i.e. 1.3893333333333333s
    // ? is beat a quarter note or eighth? cuz my resolution is 8th seemingly. mb just leave bpm quarter but behind the scenes i call it 8th

    // * a tale of two clocks
    // setTimeout looks ahead and finds if any notes are due to be played
    // ? math'ly, what does that look like?
    // ? startTime + secondsPerBeat.
    // okay if its delayed because it looks at an interval of time in the future
    // it schedules web audio events in the future
    // "The setTimeout timer basically just checks to see if any notes are going to need to be scheduled “soon” based on the current tempo, and then schedules them"
    // the setTimeout plays any notes that need to be played now as well as in its future interval
    // How much the lookahead overlaps with the next interval’s start time is determines how resilient your app will be across different machines, and as it becomes more complex (and layout and garbage collection may take longer).
    //  resilient to slower machines and operating systems, it’s best to have a large overall lookahead and a reasonably short interval
    //
    //
    // while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    //   scheduleNote( current16thNote, nextNoteTime );
    //   nextNote();
    // }
    // ? need fxn nextNote that will change the time value of nextNoteTime such that the while condition evaluates true if any notes are to be scheduled
    // ? scheduleNote sends the appropriate time to the AudioEngine. not sure what current16thNote is for

    // * lookahead is the amt of the future interval
    // * timeout interval is how often the setTimeout is called with its lookahead
    // * A good place to start is probably 100ms of “lookahead” time, with intervals set to 25ms.

    // how to refactor this so that i am not doing hook calls and minimizing the amount of components to render?

    // ! engine
    // const scheduleAheadTime = 100 // ms? idk
    // useEffect(() => {
    //     // ! mb prefer setTimeout? if the useEffect gets called every time, a new interval will be made and may consistently keep going, looping over and over on itself.
    //     const interval = setInterval(() => {
    //         // * a tale of two clocks
    //         // I’m not keeping track of “sequence time” - that is, time since the beginning of starting the metronome. All we have to do is remember when we played the last note, and figure out when the next note is scheduled to play.
    //         // e.g. fxn nextNote = const secondsPerBeat = 60/tempo, nextNoteTime += 0.25 *secondsPerBeat (1/4 note resolution)
    //         // if you calculate next beat time for each note, you don't have to worry about keeping track of global time, only need nextNoteTime

    //         if (playing) {
    //             currentBeat <= 0 || currentBeat >= stepCount
    //                 ? (currentBeat = 1)
    //                 : (currentBeat = currentBeat + 1)
    //             scheduleBeat(currentBeat, nextBeatTime) // todo needed for visual
    //         } else {
    //             currentBeat = 1 // this resets the playback to the beginning. remove to just make it a pause button.
    //         }
    //         currentBeatRef.current = currentBeat
    //         // setNextBeatTime(nextBeatTime + secondsPerBeat) // todo need for visual
    //         const currentNoteStartTime = nextBeatTime
    //         // console.log(makeMelodyNotesState)
    //         // console.log(makeChordNotesState)
    //         makeMelodyNotesState.forEach((noteRow, index) => {
    //             if (
    //                 areMelodyBeatsChecked[`note-${noteRow}`][
    //                     currentBeat - 1
    //                 ] === 1 &&
    //                 playing
    //             ) {
    //                 if (!sound.includes('sample')) {
    //                     console.log('play melody!!!!!!!!')
    //                     playSynth(
    //                         makeMelodyNotesState.length - index,
    //                         playing,
    //                         rootNote,
    //                         wonkFactor,
    //                         melodyVolume,
    //                         chordsVolume,
    //                         sound,
    //                         filterCutoff,
    //                         attack,
    //                         decay,
    //                         sustain,
    //                         release,
    //                         'melody'
    //                     )
    //                 } else {
    //                     playSample(
    //                         makeMelodyNotesState.length - index,
    //                         playing,
    //                         rootNote,
    //                         wonkFactor,
    //                         'melody'
    //                     )
    //                 }
    //             }
    //         })

    //         makeChordNotesState.forEach((noteRow, index) => {
    //             if (
    //                 areChordBeatsChecked[`note-${noteRow}`][currentBeat - 1] ===
    //                     1 &&
    //                 playing
    //             ) {
    //                 if (!sound.includes('sample')) {
    //                     console.log('play chords!!!!!!!!!!!!')
    //                     playSynth(
    //                         makeChordNotesState.length - index,
    //                         playing,
    //                         rootNote,
    //                         wonkFactor,
    //                         melodyVolume,
    //                         chordsVolume,
    //                         sound,
    //                         filterCutoff,
    //                         attack,
    //                         decay,
    //                         sustain,
    //                         release,
    //                         'chords'
    //                     )
    //                 } else {
    //                     playSample(
    //                         makeChordNotesState.length - index,
    //                         playing,
    //                         rootNote,
    //                         wonkFactor,
    //                         'chords'
    //                     )
    //                 }
    //             }
    //         })

    //         // ! the below line's interval timing was secondsPerBeat * 1000, but i noticed that the stated value of 150 was in truth more like 130. 150/130 is 1.15, thus i thought a 15% decrease in the interval would give me a more accurate time. this is true, but i'm not sure what's going on exactly. that's why 850 is used as its 15% less
    //         // old value
    //         // }, (secondsPerBeat * 850) / 2)
    //     }, scheduleAheadTime)
    //     // ! even set manually at 1000ms (i.e. one second), this will oscillate in and out of rhythm with a clock ticking each second. the 2 refers to how many subdivisions a quarter note gives. our stepCount is 8th notes.
    //     return () => clearInterval(interval)
    // }, [playing, currentBeat])

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
                Authorization: 'Bearer 6253102743c64eb2313c2c56d40bf6a6',
            },
            // body: JSON.stringify({ order: formData }),
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
                        Authorization:
                            'Bearer 6253102743c64eb2313c2c56d40bf6a6',
                    },
                    // body: JSON.stringify({ order: formData }),
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
                        Authorization:
                            'Bearer 6253102743c64eb2313c2c56d40bf6a6',
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
        setAreMelodyBeatsChecked(newMelodyMaster)
    }, [stepCount])

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
            setAreMelodyBeatsChecked(song['areMelodyBeatsChecked'])
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

    return (
        <>
            <span>
                Sequencer.js has rendered {countReRenders.current} times.
            </span>
            <Parameters
                currentBeat={currentBeat}
                // playing={playing}
                // setPlaying={setPlaying}
                makeChordNotesState={makeChordNotesState}
                makeMelodyNotesState={makeMelodyNotesState}
                areMelodyBeatsChecked={areMelodyBeatsChecked}
                areChordBeatsChecked={areChordBeatsChecked}
                // tempo={tempo}
                // setTempo={setTempo}
                // setAreChordBeatsChecked={setAreChordBeatsChecked}
                // generateAreChordBeatsCheckedInitialState={
                //     generateAreChordBeatsCheckedInitialState
                // }
                // makeChordNotesState={makeChordNotesState}
                // blankStepCountArray={blankStepCountArray}
            />
            <MelodySequencerGrid>
                <AllBoxesDiv>
                    {makeMelodyNotesState.map((note, index) => {
                        const scaleIndex = note

                        note = giveOctaveNumber(note)
                        return (
                            <CheckboxRow
                                // makeXNotesState={makeMelodyNotesState}
                                areXBeatsChecked={areMelodyBeatsChecked}
                                setAreXBeatsChecked={setAreMelodyBeatsChecked}
                                note={note}
                                index={index}
                                scaleIndex={scaleIndex}
                                beatIndex={index}
                                whichGrid="melody"
                                noteTitle={note}
                                // handleCheckbox={handleCheckbox}
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
                    {makeChordNotesState.map((note, index) => {
                        const scaleIndex = note
                        console.log(
                            scaleIndex,
                            'scaleindex sent from chord seq in seuqencer'
                        )
                        return (
                            <CheckboxRow
                                areXBeatsChecked={areChordBeatsChecked}
                                setAreXBeatsChecked={setAreChordBeatsChecked}
                                note={note}
                                index={index}
                                scaleIndex={scaleIndex}
                                beatIndex={index}
                                whichGrid="chords"
                                noteTitle={romanNumeralReference['major'][note]}
                                // handleCheckbox={handleCheckbox}
                            />
                        )
                    })}
                    {/* {makeChordNotesState.map((chord) => {
                        const chordIndex = chord

                        return (
                            <TitleAndBoxesDiv key={chord}>
                                <TitleSpanDiv>
                                    <ChordTitle>
                                        {romanNumeralReference['major'][chord]}
                                        <br />
                                    </ChordTitle>
                                </TitleSpanDiv>
                                <ChordDiv key={`row-${chordIndex}`}>
                                    {areChordBeatsChecked[
                                        `note-${chordIndex}`
                                    ].map((check, index) => {
                                        return (
                                            <Checkbox
                                                key={`row-${chordIndex}-beat-${index}`}
                                                chord={chord}
                                                areChordBeatsChecked={
                                                    areChordBeatsChecked
                                                }
                                                beatIndex={index}
                                                chordIndex={chordIndex}
                                                // // handleCheckbox={handleCheckbox}
                                            />
                                        )
                                        // }
                                    })}
                                </ChordDiv>
                            </TitleAndBoxesDiv>
                        )
                    })} */}
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

const ChordDiv = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
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

const TitleDiv = styled.div`
    height: 270px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
`

const NoteTitle = styled.span`
    text-align: left;
    font-size: 17.65px;
    margin: none;
    display: inline-block;
    opacity: 75%;
    padding-right: 8px;
`

const ChordTitle = styled.span`
    text-align: left;
    font-size: 22px;
    opacity: 75%;
    padding-right: 8px;
    margin: none;
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
`
const BeatSpan = styled.span`
    // padding-left: 9px;
    color: var(--lighter-color);
    opacity: 50%;
`
const TitleAndBoxesDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid fuchsia;
`
const TitleSpanDiv = styled.div`
    width: 20px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
`
