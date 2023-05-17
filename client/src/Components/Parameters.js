import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import { loadSample } from '../AudioEngine'
import { audioTime } from '../AudioEngine'
import Slider from './Slider'
import { playSample, getFile, setupSample, playSynth } from '../AudioEngine'
import {
    slidersToShowObj,
    rootNoteOptions,
    stepCountOptions,
} from '../BigObjectsAndArrays'
import CustomDropdown from './CustomDropdown'
import { AbortedDeferredError } from 'react-router-dom'
import PlayButton from '../assets/SVGs/PlayButton'
import StopButton from '../assets/SVGs/StopButton'
const Parameters = ({
    currentBeat,
    areMelodyBeatsChecked,
    areChordBeatsChecked,
    makeMelodyNotesState,
    makeChordNotesState,
}) => {
    //   const [tempo, setTempo] = useState(150)
    const audioContext = new AudioContext() // restarts upon every re-render due to playing changing state
    const [dragging, setDragging] = useState(false)
    const [playing, setPlaying] = useState(false)
    const intervalRunningRef = useRef(false)
    const intervalIDRef = useRef('')
    // ! can some of these parameters be regular const so that i dont lag with the drag??
    // ! can some of these parameters be regular const so that i dont lag with the drag??
    // ! can some of these parameters be regular const so that i dont lag with the drag??
    // ! can some of these parameters be regular const so that i dont lag with the drag??

    let root = 1
    const [tempo, setTempo] = useState(60)
    const [wonk, setWonk] = useState(0)
    const [melodyVolume, setMelodyVolume] = useState(100)
    const [chordsVolume, setChordsVolume] = useState(100)
    const [attack, setAttack] = useState(1)
    const [decay, setDecay] = useState(15)
    const [sustain, setSustain] = useState(60)
    const [release, setRelease] = useState(5)
    const [rootNote, setRootNote] = useState('A')
    const [filterCutoff, setFilterCutoff] = useState(7500)
    const [sound, setSound] = useState('sine')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    // const [intervalID, setIntervalID] = useState(null)
    const {
        // audioContext,
        // tempo,
        // setTempo,
        stepCount,
        setStepCount,
        // rootNote,
        // setRootNote,
        // wonk,
        // setwonk,
        // melodyVolume,
        // setMelodyVolume,
        // chordsVolume,
        // setChordsVolume,
        // sound,
        // setSound,
        // filterCutoff,
        // setFilterCutoff,
        // attack,
        // setAttack,
        // decay,
        // setDecay,
        // sustain,
        // setSustain,
        // release,
        // setRelease,
    } = useContext(MusicParametersContext)

    // ! want to avoid setTimeout or setInterval calls, they only send state at their instantiation, no update

    // if playing
    // first note should be sent to audioEngine ASAP if its on beat 1
    // calculate second note time, store in nextNoteTime
    // ask while loop, is this time less than currentTime + lookahead
    // schedule note if so
    // move to next note
    // repeat process

    // * setInterval I've made allows me to send note scheduling with react
    // ? idk if it would send up to date state, i;d guess not.
    // ? wtf am i doing with intervalRunningRef?
    // ! it may need to be a useEffect after all

    // ! for each re-render, previous setInterval calls continue
    // can i change it so that i have a whole cascade of logic as long as playing remains true, but doesnt repeat with endless renders?
    // todo ugly AF, refactor
    useEffect(() => {
        let id
        if (playing && !intervalRunningRef.current) {
            console.log('WE CREATE A SETINTERVAL NOW')
            intervalRunningRef.current = true
            id = setInterval(() => {
                console.log('inteeeeeeeeeeeeeeeeeeeeeeeeeeeeeerval')
                console.log(audioContext.currentTime, 'time')
                console.log(decay, 'decay')
            }, 500)

            intervalIDRef.current = id
        } else if (playing && intervalRunningRef.current) {
            console.log('playing true and intervalRunningRef true')
            clearInterval(intervalIDRef.current)
            id = setInterval(() => {
                console.log('inteeeeeeeeeeeeeeeeeeeeeeeeeeeeeerval')
                console.log(audioContext.currentTime, 'time')
                console.log(decay, 'decay')
            }, 500)

            intervalIDRef.current = id
        } else if (!playing && intervalRunningRef.current) {
            console.log('made intervalRunningRef false')
            clearInterval(intervalIDRef.current)
            intervalRunningRef.current = false
            console.log('CLEAR INTERVAL cuz no longer playing')
        } else if (!playing && !intervalRunningRef.current) {
            clearInterval(intervalIDRef.current)
            intervalRunningRef.current = false
            console.log('not sure i need this, but both are false')
        }
    })
    // ? where do setTimeout calls come in? is there a way to make them update quickly?

    // todo calculate nextNoteTime
    // while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    //     scheduleNote(current16thNote, nextNoteTime)
    //     nextNote()
    // }

    // setInterval(() => {
    //     console.log('timeout 100ms')
    // }, 500)

    const scheduleAheadTime = 100 // i think it's seconds
    useEffect(() => {
        console.log(playing, 'playing changed in playSynth useFX')
        // setInterval continues even after react refreshes. we need it to restart after a refresh
        // .. but still respect audioContext time
        const interval = setInterval(() => {
            if (playing) {
                currentBeat <= 0 || currentBeat >= stepCount
                    ? (currentBeat = 1)
                    : (currentBeat = currentBeat + 1)
                // scheduleBeat(currentBeat, nextBeatTime) // todo needed for visual
            } else {
                currentBeat = 1 // this resets the playback to the beginning. remove to just make it a pause button.
            }
            // currentBeatRef.current = currentBeat
            // setNextBeatTime(nextBeatTime + secondsPerBeat) // todo need for visual
            makeMelodyNotesState.forEach((noteRow, index) => {
                if (
                    areMelodyBeatsChecked[`note-${noteRow}`][
                        currentBeat - 1
                    ] === 1 &&
                    playing
                ) {
                    if (!sound.includes('sample')) {
                        console.log('play melody!!!!!!!!')
                        playSynth(
                            makeMelodyNotesState.length - index,
                            playing,
                            root,
                            wonk,
                            melodyVolume,
                            chordsVolume,
                            sound,
                            filterCutoff,
                            attack,
                            decay,
                            sustain,
                            release,
                            'melody'
                        )
                    } else {
                        playSample(
                            makeMelodyNotesState.length - index,
                            playing,
                            root,
                            wonk,
                            'melody'
                        )
                    }
                }
            })

            makeChordNotesState.forEach((noteRow, index) => {
                if (
                    areChordBeatsChecked[`note-${noteRow}`][currentBeat - 1] ===
                        1 &&
                    playing
                ) {
                    if (!sound.includes('sample')) {
                        console.log('play chords!!!!!!!!!!!!')
                        playSynth(
                            makeChordNotesState.length - index,
                            playing,
                            root,
                            wonk,
                            melodyVolume,
                            chordsVolume,
                            sound,
                            filterCutoff,
                            attack,
                            decay,
                            sustain,
                            release,
                            'chords'
                        )
                    } else {
                        playSample(
                            makeChordNotesState.length - index,
                            playing,
                            root,
                            wonk,
                            'chords'
                        )
                    }
                }
            })
        }, scheduleAheadTime)
        return () => clearInterval(interval)
    }, [playing])

    // ! if i render the page based on playing, then i don't need a useEffect??
    useEffect(() => {
        const detectKeyDown = (e) => {
            if (e.key === 's' && e.target.type !== 'text') {
                // intervalRunningRef.current = !intervalRunningRef.current
                // setPlaying(intervalRunningRef.current)
                setPlaying(!playing)
                document.removeEventListener('keydown', detectKeyDown, true)
            }
        }
        document.addEventListener('keydown', detectKeyDown, true)
        return () => {
            document.removeEventListener('keydown', detectKeyDown, true)
        }
    })

    // ? mb a vestige of an older build. needs to wait until sounds are re-integrated
    const parseSound = (e) => {
        console.log(audioTime(), 'audiotime')
        setSound(e.target.value)
        if (
            e.target.value === 'samplePianoC2' ||
            e.target.value === 'sampleOohC2' ||
            e.target.value === 'sampleRonyA2' ||
            e.target.value === 'sampleFeltPianoC3'
        ) {
            loadSample(e.target.value, audioContext)
        }
    }

    // ! will there be problems with an object pointing to state? when will the object update??
    const slidersToShowObj = {
        tempo: {
            id: 0,
            minValue: 30,
            maxValue: 240,
            title: 'Tempo',
            stateValue: tempo,
            setParameterState: setTempo,
        },
        wonk: {
            id: 1,
            minValue: 0,
            maxValue: 100,
            title: 'Wonk',
            stateValue: wonk,
            setParameterState: setWonk,
        },
        melodyVolume: {
            id: 2,
            minValue: 0,
            maxValue: 100,
            title: 'Melody',
            stateValue: melodyVolume,
            setParameterState: setMelodyVolume,
        },
        chordsVolume: {
            id: 3,
            minValue: 0,
            maxValue: 100,
            title: 'Chords',
            stateValue: chordsVolume,
            setParameterState: setChordsVolume,
        },
        attack: {
            id: 4,
            minValue: 0,
            maxValue: 100,
            title: 'Attack',
            stateValue: attack,
            setParameterState: setAttack,
        },
        sustain: {
            id: 5,
            minValue: 0,
            maxValue: 100,
            title: 'Sustain',
            stateValue: sustain,
            setParameterState: setSustain,
        },
        decay: {
            id: 6,
            minValue: 0,
            maxValue: 100,
            title: 'Decay',
            stateValue: decay,
            setParameterState: setDecay,
        },
        release: {
            id: 7,
            minValue: 0,
            maxValue: 100,
            title: 'Release',
            stateValue: release,
            setParameterState: setRelease,
        },
        filter: {
            id: 7,
            minValue: 100,
            maxValue: 10000,
            title: 'Filter',
            stateValue: filterCutoff,
            setParameterState: setFilterCutoff,
        },
    }

    const countReRenders = useRef(1)
    useEffect(() => {
        countReRenders.current = countReRenders.current + 1
    })

    return (
        <>
            <MainDiv>
                <StartButtonDiv>
                    <StartStopTextDiv>
                        <span>Start/Stop</span> <span>Press S</span>
                    </StartStopTextDiv>
                    <StartStopButton
                        onClick={() => {
                            if (!playing) {
                                setPlaying(true)
                                intervalRunningRef.current =
                                    !intervalRunningRef.current
                                // playing = true
                            } else {
                                setPlaying(false)
                                intervalRunningRef.current =
                                    !intervalRunningRef.current
                                // playing = false
                            }
                            console.log(playing, 'playing')
                        }}
                    >
                        {playing ? <StopButton /> : <PlayButton />}
                        {/* <PlayingSpan> {playing ? 'stop' : 'start'}</PlayingSpan> */}
                    </StartStopButton>
                </StartButtonDiv>

                {Object.keys(slidersToShowObj).map((slider, index) => {
                    return (
                        <Slider
                            key={`${index}`}
                            slider={slidersToShowObj[slider]}
                            dragging={dragging}
                            setDragging={setDragging}
                        />
                    )
                })}

                <DropdownsDiv>
                    <SoundFilterDiv
                    // onMouseLeave={mouseLeave}
                    >
                        <CustomDropdown
                            title="Steps"
                            stateValue={stepCount}
                            stateValueOptions={stepCountOptions}
                            setState={setStepCount}
                            // handleOptionClick={handleOptionClick}
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                            // onMouseLeave={mouseLeave()}
                        />
                    </SoundFilterDiv>
                    <SoundFilterDiv
                    // onMouseLeave={mouseLeave}
                    >
                        <CustomDropdown
                            title="Root"
                            stateValue={rootNote}
                            stateValueOptions={rootNoteOptions}
                            setState={setRootNote}
                            // // handleOptionClick={handleOptionClick}
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                            // onMouseLeave={mouseLeave()}
                        />
                    </SoundFilterDiv>
                </DropdownsDiv>
            </MainDiv>
            <Ref>
                <span>
                    Parameters.js has rendered {countReRenders.current} times.
                </span>
            </Ref>
        </>
    )
}

export default Parameters
const StartStopTextDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    margin-bottom: 1px;
`
const StartStopButton = styled.button`
    background-color: black;
    color: var(--primary-color);
    width: 80px;
    height: 90px;
    border: 3px double var(--lightest-color);
    padding-top: 8px;
    margin-top: 4px;

    :hover {
        opacity: 75%;
    }
    :active {
        border: 6px double var(--lightest-color);
        opacity: 50%;
    }
`
const PlayingSpan = styled.span`
    position: absolute;
    top: 55%;
    left: 35%;
`
const Ref = styled.div`
    margin-top: -30px;
    margin-bottom: 15px;
`
const MainDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 40px;
    height: 128px;
    position: relative;
`

const Parameter = styled.input`
    -webkit-appearance: slider-vertical;

    margin: 8px;
    height: 75px;
`

const DropdownContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20px;
`

const ParameterLabel = styled.span``
const StartButtonDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
`

const DropdownsDiv = styled.div`
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: flex-start;
    // border: 1px solid fuchsia;
    // height: 100%;
`
const SoundFilterDiv = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const Filter = styled.input`
    height: 20px;
`

const StyledSelect = styled.select`
    outline: none;
    background-color: black;
    color: var(--primary-color);
    border: 1px solid var(--lightest-color);
    width: 55px;
    :focus {
        border: 1px solid var(--lighter-color);
    }
`

const ULDropdown = styled.ul`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 100%;
    display: inline-block;
    padding: 0;
    margin: 0;
    list-style: none;
    cursor: pointer;
    width: 55px;
    border: 1px solid var(--lightest-color);
    background-color: #000000;
`

const Option = styled.span`
    z-index: 1;
    padding: 0 10px;
    cursor: pointer;
    display: block;
    :hover {
        background-color: var(--primary-color);
        color: black;
    }
`

const ChosenOption = styled.span`
    z-index: 1;
    padding: 0 10px;
    cursor: pointer;
    display: block;
`
// user select doesn't work, likely due to select dropdown finnickiness
const StyledOption = styled.option`
    user-select: none;
    border: 1px solid fuchsia;
`
