import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from './App'
import { loadSample } from './AudioEngine'
import { audioTime } from './AudioEngine'
import Slider from './Components/Slider'
import { playSample, getFile, setupSample, playSynth } from './AudioEngine'
import { rootNoteOptions, stepCountOptions } from './BigObjectsAndArrays'
import CustomDropdown from './Components/CustomDropdown'
import PlayButton from './assets/SVGs/PlayButton'
import StopButton from './assets/SVGs/StopButton'
const Parameters = ({
    currentBeat,
    currentBeatRef,
    areMelodyBeatsChecked,
    areChordBeatsChecked,
    makeMelodyNotesState,
    makeChordNotesState,
    notesToPlay,
}) => {
    //   const [tempo, setTempo] = useState(150)
    // const audioCtx = new AudioContext() // restarts upon every re-render due to playing changing state
    const [dragging, setDragging] = useState(false)
    const [playing, setPlaying] = useState(false)
    const intervalRunningRef = useRef(false)
    const intervalIDRef = useRef('')
    // const currentBeatRef = useRef(currentBeat)
    // ! can some of these parameters be regular const so that i dont lag with the drag??
    // ! can some of these parameters be regular const so that i dont lag with the drag??
    // ! can some of these parameters be regular const so that i dont lag with the drag??
    // ! can some of these parameters be regular const so that i dont lag with the drag??
    let root = 1
    const [tempo, setTempo] = useState(120)
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
    const { stepCount, setStepCount } = useContext(MusicParametersContext)

    // * Chris Wilson:::
    // if playing
    // first note should be sent to audioEngine ASAP if its on beat 1
    // calculate second note time, store in nextNoteTime
    // ask while loop, is this time less than currentTime + lookahead
    // schedule note if so
    // move to next note
    // repeat process

    // todo interval may be calculated based off of tempo
    // ? how to get milliseconds out of bpm?
    // 60bpm -> 120 8th notes per minute
    // 120 notes / 60 seconds = 2 notes a second
    // a note every 500 ms
    // i skipped a step. how 2 notes a second into 500ms?
    // 1 second / 2

    const tempoToSeconds = (tempo) => {
        // calculate: how many seconds does a beat take?
        return 60 / (tempo * 2)
    }

    // ! this is technically an 8th note's duration in ms, not lookahead
    // ? lookahead = beatDuration / 2.5?
    let beatDuration = tempoToSeconds(tempo) // time of one eighth note in seconds
    const scheduleAheadTime = beatDuration / 3
    let nextNoteTime = 0

    const playEngine = (nextNoteTime, scaleIndex, type) => {
        playSynth(
            // audioCtx,
            scaleIndex,
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
            type,
            nextNoteTime
        )
    }

    // ! DRY: playSynth and playSample could be joined
    const sendToPlayFxns = (nextNoteTime) => {
        makeMelodyNotesState.forEach((noteRow, index) => {
            console.log('send to play fxns')
            if (
                areMelodyBeatsChecked[`note-${noteRow}`][
                    currentBeatRef.current - 1
                ] === 1 &&
                playing
            ) {
                if (!sound.includes('sample')) {
                    playSynth(
                        // audioCtx,
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
                        'melody',
                        nextNoteTime
                    )
                } else {
                    playSample(
                        // audioCtx,
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
                areChordBeatsChecked[`note-${noteRow}`][
                    currentBeatRef.current - 1
                ] === 1 &&
                playing
            ) {
                if (!sound.includes('sample')) {
                    console.log('play chords!!!!!!!!!!!!')
                    playSynth(
                        // audioCtx,
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
                        // audioCtx,
                        makeChordNotesState.length - index,
                        playing,
                        root,
                        wonk,
                        'chords'
                    )
                }
            }
        })
    }
    const stopIntervalAndFalsifyRef = () => {
        clearInterval(intervalIDRef.current)
        intervalRunningRef.current = false
        console.log('CLEAR INTERVAL cuz no longer playing')
    }

    // todo ugly AF, refactor

    // playing?
    // yes, setInterval
    let id
    let timeFromStart = 0
    let eighthNoteTicks = 0
    let intervalTicks = 0
    let sentToPlayEngine = false // prevents sending >1 playEngine calls while on the same eighth note but different intervals
    if (playing) {
        timeFromStart = audioTime()
        nextNoteTime = null
        // intervalRunningRef tracks interval ID and resets it upon render to keep up to date synth params
        if (!intervalRunningRef.current) intervalRunningRef.current = true
        else clearInterval(intervalIDRef.current)
        id = setInterval(() => {
            const futureBeatTarget =
                notesToPlay[`beat-${(currentBeatRef.current % stepCount) + 1}`]

            const futureBeatNotesArray = Object.keys(futureBeatTarget)
            const elapsedPlayTime = eighthNoteTicks * beatDuration
            // ! should i just use areXChecked instead??
            // ! should i just use areXChecked instead??
            // ! should i just use areXChecked instead??
            if (
                futureBeatNotesArray.length !== 0 // notes exist, play them
            ) {
                nextNoteTime = timeFromStart + elapsedPlayTime + beatDuration
            }
            if (
                !sentToPlayEngine
                // &&                nextNoteTime < audioTime() + scheduleAheadTime
            ) {
                futureBeatNotesArray.forEach((note) => {
                    console.log(futureBeatTarget, note)
                    const scaleIndex = note.substring(5)
                    Object.keys(futureBeatTarget[note]).forEach((type) => {
                        console.log(type, 'WE SENDINNNNNNNNNNN')
                        playEngine(nextNoteTime, parseInt(scaleIndex), type)
                    })
                })
                sentToPlayEngine = true
            }

            intervalTicks++
            if (intervalTicks % 3 === 0) {
                eighthNoteTicks++
                advanceCurrentBeat()
                sentToPlayEngine = false
                console.log('every 3rd tick')
            }
        }, scheduleAheadTime * 1000) // maybe 250? so 1000 divided by 4, so there are 4 calls in the window for insurance

        intervalIDRef.current = id
    } else if (!playing && intervalRunningRef.current) {
        stopIntervalAndFalsifyRef()
    }
    // playing? true -> setInterval which advancesCurrentBeat and sendsToPlayFxns
    //

    const advanceCurrentBeat = () => {
        if (
            currentBeatRef.current <= 0 ||
            currentBeatRef.current >= stepCount
        ) {
            currentBeatRef.current = 1
        } else {
            currentBeatRef.current = currentBeatRef.current + 1
        }
    }

    // const scheduleBeat = (startTime) => {
    //     advanceCurrentBeat() // ~

    //     // todo need to calculate note times based off of ctx.time. thus i need to track which notes play when.
    // }

    // * this useEffect is necessary to make sure theres only ever one event listener
    useEffect(() => {
        const detectKeyDown = (e) => {
            if (e.key === 's' && e.target.type !== 'text') {
                togglePlayback()
                document.removeEventListener('keydown', detectKeyDown, true)
            }
        }
        document.addEventListener('keydown', detectKeyDown, true)
        return () => {
            document.removeEventListener('keydown', detectKeyDown, true)
        }
    })

    // ? mb a vestige of an older build. needs to wait until samples are re-integrated
    const parseSound = (e) => {
        // console.log(audioTime(), 'audiotime')
        setSound(e.target.value)
        if (
            e.target.value === 'samplePianoC2' ||
            e.target.value === 'sampleOohC2' ||
            e.target.value === 'sampleRonyA2' ||
            e.target.value === 'sampleFeltPianoC3'
        ) {
            loadSample(e.target.value)
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

    const togglePlayback = () => {
        if (!playing) {
            currentBeat = 1
            currentBeatRef.current = 1
        }
        setPlaying(!playing)
    }
    return (
        <>
            <MainDiv>
                <StartButtonDiv>
                    <StartStopTextDiv>
                        <span>Start/Stop</span> <span>Press S</span>
                    </StartStopTextDiv>
                    <StartStopButton
                        onClick={
                            togglePlayback
                            // () => {
                            //     if (!playing) {
                            //         setPlaying(true)
                            //         intervalRunningRef.current =
                            //             !intervalRunningRef.current
                            //         // playing = true
                            //     } else {
                            //         setPlaying(false)
                            //         intervalRunningRef.current =
                            //             !intervalRunningRef.current
                            //         // playing = false
                            //     }
                            //     console.log(playing, 'playing')
                            // }
                        }
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
    max-width: 900px;
`

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
