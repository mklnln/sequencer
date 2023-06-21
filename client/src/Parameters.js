import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from './App'
import { loadSample } from './AudioEngine'
import { audioTime } from './AudioEngine'
import Slider from './Components/Slider'
import { playSample, getFile, setupSample, playSynth } from './AudioEngine'
import { slidersToShowObj } from './BigObjectsAndArrays'
import { rootNoteOptions, stepCountOptions } from './BigObjectsAndArrays'
import CustomDropdown from './Components/CustomDropdown'
import PlayButton from './assets/SVGs/PlayButton'
import StopButton from './assets/SVGs/StopButton'
const Parameters = ({
    currentBeatRef,
    notesToPlay,
    tempo,
    setTempo,
    beatForAnimation,
    setBeatForAnimation,
    stepCount,
    setStepCount,
}) => {
    const [playing, setPlaying] = useState(false)
    const intervalRunningRef = useRef(false)
    const intervalIDRef = useRef('')
    const sentToPlayEngineRef = useRef(false) // prevents sending playEngine calls that have already been sent
    const [wonk, setWonk] = useState(0)
    const [melodyVolume, setMelodyVolume] = useState(100)
    const [chordsVolume, setChordsVolume] = useState(100)
    const [rootNote, setRootNote] = useState('A')
    const [filterCutoff, setFilterCutoff] = useState(7500)
    const [sound, setSound] = useState('sine')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    // const { stepCount, setStepCount } = useContext(MusicParametersContext)
    console.log(notesToPlay)
    const tempoToSeconds = (tempo) => {
        return 60 / (tempo * 2)
    }

    let beatDuration = tempoToSeconds(tempo) // time of one eighth note in seconds
    const scheduleAheadTime = beatDuration / 3 // for setInterval, check ahead to see if a note is to be played
    let nextNoteTime = 0

    const playEngine = (nextNoteTime, scaleIndex, type) => {
        playSynth(
            scaleIndex,
            playing,
            rootNoteOptions.indexOf(rootNote) + 1,
            wonk,
            melodyVolume,
            chordsVolume,
            sound,
            filterCutoff,
            parameterValuesObj['attack'],
            parameterValuesObj['decay'],
            parameterValuesObj['sustain'],
            parameterValuesObj['release'],
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
                    notesToPlay[
                        `beat-${(currentBeatRef.current % stepCount) + 1}`
                    ]
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
        if (currentBeatRef.current >= stepCount) {
            currentBeatRef.current = 1
            // setBeatForAnimation(1)
        } else {
            currentBeatRef.current = currentBeatRef.current + 1
            // setBeatForAnimation((prevProp) => prevProp + 1)
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
        }
        setPlaying(!playing)
    }

    const [parameterValuesObj, setParameterValuesObj] = useState({
        wonk: 0,
        melodyVolume: 100,
        chordsVolume: 100,
        attack: 1,
        decay: 15,
        sustain: 60,
        release: 5,
        filter: 7500,
    })

    const [changedParameter, setChangedParameter] = useState({
        title: '',
        value: null,
    })

    const bubbleUpSliderInfo = useCallback((value, title) => {
        setChangedParameter({
            title: title.toLowerCase(),
            value: value,
        })
    }, [])

    if (changedParameter) {
        let obj = { ...parameterValuesObj }
        obj[changedParameter.title] = changedParameter.value
        setParameterValuesObj(obj)
        setChangedParameter(null)
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
                            bubbleUpSliderInfo={bubbleUpSliderInfo}
                            setTempo={setTempo}
                        />
                    )
                })}

                <DropdownsDiv>
                    <SoundFilterDiv>
                        <CustomDropdown
                            title="Steps"
                            stateValue={stepCount}
                            stateValueOptions={stepCountOptions}
                            setState={setStepCount}
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                        />
                    </SoundFilterDiv>
                    <SoundFilterDiv>
                        <CustomDropdown
                            title="Root"
                            stateValue={rootNote}
                            stateValueOptions={rootNoteOptions}
                            setState={setRootNote}
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
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
