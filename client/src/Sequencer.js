import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from './App'
import { loadSample } from './utilities/AudioEngine'
import { audioTime } from './utilities/AudioEngine'
import Slider from './Components/Slider'
import {
    playSample,
    getFile,
    setupSample,
    playSynth,
} from './utilities/AudioEngine'
import {
    dropdownsObj,
    slidersToShowObj,
    soundOptions,
} from './utilities/BigObjectsAndArrays'
import {
    rootNoteOptions,
    stepCountOptions,
} from './utilities/BigObjectsAndArrays'
import CustomDropdown from './Components/CustomDropdown'
import PlayButton from './assets/SVGs/PlayButton'
import StopButton from './assets/SVGs/StopButton'
const Sequencer = ({
    currentBeatRef,
    notesToPlay,
    // tempo,
    // setTempo,
    // stepCount,
    // setStepCount,
    setCurrentBeat,
    parameterValuesObj,
    bubbleUpParameterInfo,
}) => {
    const { tempo, steps } = parameterValuesObj
    const [playing, setPlaying] = useState(false)
    const intervalRunningRef = useRef(false)
    const intervalIDRef = useRef('')
    const sentToPlayEngineRef = useRef(false) // prevents sending playEngine calls that have already been sent
    const [rootNote, setRootNote] = useState('A')
    const [sound, setSound] = useState('Sine')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // const { stepCount, setStepCount } = useContext(MusicParametersContext)
    const tempoToSeconds = (tempo) => {
        return 60 / (tempo * 2)
    }

    let beatDuration = tempoToSeconds(parameterValuesObj.tempo) // time of one eighth note in seconds
    const scheduleAheadTime = beatDuration / 3 // for setInterval, check ahead to see if a note is to be played
    let nextNoteTime = 0

    const playEngine = (nextNoteTime, scaleIndex, type) => {
        playSynth(
            scaleIndex,
            playing,
            parameterValuesObj,
            // rootNoteOptions.indexOf(rootNote) + 1,
            // // ! send just paramValObj and deconstruct on the other side
            // // ! send just paramValObj and deconstruct on the other side
            // wonk,
            // melodyVolume,
            // chordsVolume,
            // sound,
            // filterCutoff,
            // parameterValuesObj['attack'],
            // parameterValuesObj['decay'],
            // parameterValuesObj['sustain'],
            // parameterValuesObj['release'],
            type,
            nextNoteTime
        )
    }

    const stopIntervalAndFalsifyRef = () => {
        clearInterval(intervalIDRef.current)
        intervalRunningRef.current = false
    }

    let id
    let timeFromStart = 0
    let eighthNoteTicks = 0
    let intervalTicks = 0

    if (playing) {
        timeFromStart = audioTime()
        nextNoteTime = 0
        // intervalRunningRef tracks interval ID and resets it upon render to keep up to date synth params
        if (!intervalRunningRef.current) intervalRunningRef.current = true
        else clearInterval(intervalIDRef.current)
        id = setInterval(() => {
            // send that time to the synth engine
            if (!sentToPlayEngineRef.current) {
                // find potential notes to be played by checking notesToPlay
                const futureBeatTarget =
                    notesToPlay[`beat-${(currentBeatRef.current % steps) + 1}`]
                const futureBeatNotesArray = Object.keys(futureBeatTarget)
                // calculate current elapsed time
                const elapsedPlayTime = eighthNoteTicks * beatDuration
                // if a note is to be played, set its time to start playing
                if (futureBeatNotesArray.length !== 0) {
                    nextNoteTime =
                        timeFromStart + elapsedPlayTime + beatDuration
                }
                futureBeatNotesArray.forEach((note) => {
                    const scaleIndex = parseInt(note.substring(5))
                    Object.keys(futureBeatTarget[note]).forEach((type) => {
                        playEngine(nextNoteTime, scaleIndex, type)
                    })
                })
                sentToPlayEngineRef.current = true
            }

            intervalTicks++
            if (intervalTicks % 3 === 0) {
                eighthNoteTicks++
                advanceCurrentBeat()
                sentToPlayEngineRef.current = false // move on to a new beat, thus we have potential new notes to play
            }
        }, scheduleAheadTime * 1000) // maybe 250? so 1000 divided by 4, so there are 4 calls in the window for insurance

        intervalIDRef.current = id
    } else if (!playing && intervalRunningRef.current) {
        stopIntervalAndFalsifyRef()
    }

    const advanceCurrentBeat = () => {
        if (currentBeatRef.current >= parameterValuesObj.steps) {
            currentBeatRef.current = 1
            setCurrentBeat(1)
        } else {
            currentBeatRef.current = currentBeatRef.current + 1
            setCurrentBeat((prevState) => prevState + 1)
        }
    }

    // * this useEffect is necessary to make sure theres only ever one event listener
    useEffect(() => {
        const detectKeyDown = (e) => {
            if (e.key === 's' && e.target.type !== 'text') {
                togglePlayback()
            }
        }
        document.addEventListener('keydown', detectKeyDown, true)
        return () => {
            document.removeEventListener('keydown', detectKeyDown, true)
        }
    })

    // ? mb a vestige of an older build. needs to wait until samples are re-integrated
    const parseSound = (e) => {
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

    const countReRenders = useRef(1)
    useEffect(() => {
        countReRenders.current = countReRenders.current + 1
    })

    const togglePlayback = () => {
        if (!playing) {
            currentBeatRef.current = 0
            sentToPlayEngineRef.current = false
            setCurrentBeat(0)
        }
        setPlaying(!playing)
        setCurrentBeat(0)
    }

    return (
        <>
            <MainDiv>
                <StartButtonDiv>
                    <StartStopTextDiv>
                        <span>Start/Stop</span> <span>Press S</span>
                    </StartStopTextDiv>
                    <StartStopButton onClick={togglePlayback}>
                        {playing ? <StopButton /> : <PlayButton />}
                    </StartStopButton>
                </StartButtonDiv>

                {Object.keys(slidersToShowObj).map((slider, index) => {
                    const sliderStaticInfo = slidersToShowObj[slider]
                    return (
                        <Slider
                            key={`${index}`}
                            slider={slidersToShowObj[slider]}
                            sliderStaticInfo={sliderStaticInfo}
                            bubbleUpParameterInfo={bubbleUpParameterInfo}
                        />
                    )
                })}
                <DropdownsDiv>
                    {Object.keys(dropdownsObj).map((param) => {
                        return (
                            <SoundFilterDiv>
                                <CustomDropdown
                                    title={dropdownsObj[param].title}
                                    stateValueOptions={
                                        dropdownsObj[param].options
                                    }
                                    defaultValue={
                                        dropdownsObj[param].defaultValue
                                    }
                                    isDropdownOpen={isDropdownOpen}
                                    setIsDropdownOpen={setIsDropdownOpen}
                                    bubbleUpParameterInfo={
                                        bubbleUpParameterInfo
                                    }
                                />
                            </SoundFilterDiv>
                        )
                    })}
                </DropdownsDiv>
            </MainDiv>
            <Ref>
                <span>
                    Sequencer.js has rendered {countReRenders.current} times.
                </span>
            </Ref>
        </>
    )
}

export default Sequencer
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
        cursor: pointer;
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
    margin: auto;
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
    margin-top: -23px;
`
const SoundFilterDiv = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
