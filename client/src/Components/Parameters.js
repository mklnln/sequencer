import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import { loadSample } from '../AudioEngine'
import { audioTime } from '../AudioEngine'
import Slider from './Slider'
import { playSample, getFile, setupSample, playSynth } from '../AudioEngine'
const Parameters = ({
    currentBeat,
    areMelodyBeatsChecked,
    areChordBeatsChecked,
    makeMelodyNotesState,
    makeChordNotesState,
}) => {
    //   const [tempo, setTempo] = useState(150)
    const [dragging, setDragging] = useState(false)
    const [playing, setPlaying] = useState(false)
    const playingRef = useRef(playing)
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
    const {
        audioContext,
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

    const scheduleAheadTime = 100 // ms? idk
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
            console.log('a key was pressed!!')
            if (e.key === 's' && e.target.type !== 'text') {
                console.log(
                    'if keydown condition MET, should now toggle playing'
                )

                console.log(playingRef.current, 'BEFORE toggle')
                playingRef.current = !playingRef.current
                console.log(
                    playingRef.current,
                    'now set to in eventListener AFTER toggle'
                )
                setPlaying(playingRef.current)
                document.removeEventListener('keydown', detectKeyDown, true)
            }
        }
        document.addEventListener('keydown', detectKeyDown, true)
        console.log('key listener ADDED')
        return () => {
            document.removeEventListener('keydown', detectKeyDown, true)
            console.log('key listener REMOVED')
        }
    })

    // todo trying to minimize useEffect use, see here tryna get rid of eventListener guy
    // * had trouble with the eventlisteners and re-renders adding a million extra ones.
    // ? how to keep just one eventlistener over react re-renders??
    // const detectKeyDown = (e) => {
    //     if (e.key === 's' && e.target.type !== 'text') {
    //         console.log(playingRef.current, 'BEFORE toggle')
    //         playingRef.current = !playingRef.current
    //         console.log(
    //             playingRef.current,
    //             'now set to in eventListener AFTER toggle'
    //         )
    //         setPlaying(playingRef.current)
    //         document.removeEventListener('keydown', detectKeyDown, true)
    //         console.log('key listener REMOVED')
    //     }
    // }
    // useEffect(() => {
    //     document.addEventListener('keydown', detectKeyDown, true)
    //     console.log('key listener ADDED')
    //     return () => {
    //         console.log('key listener REMOVED')
    //         document.removeEventListener('keydown', detectKeyDown, true)
    //     }
    // }, [])

    // console.log('key listener removed')
    // console.log('key listener added')

    // setState on parameters was finnicky at times, making separate functions helped.
    // TO-DO: cut down on this bloat and keep setState calls as anonymous callbacks within the below returns.
    const parseTempo = (e) => {
        setTempo(e)
    }

    const parseSteps = (e) => {
        setStepCount(parseInt(e.target.value))
    }

    const parseRoot = (e) => {
        setRootNote(parseInt(e.target.value))
    }
    const parseWonk = (e) => {
        setWonk(parseInt(e.target.value))
    }
    const parseMelodyVolume = (e) => {
        setMelodyVolume(parseInt(e.target.value))
    }
    const parseChordsVolume = (e) => {
        setChordsVolume(parseInt(e.target.value))
    }
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
    const parseFilterCutoff = (e) => {
        setFilterCutoff(parseInt(e.target.value))
    }
    const parseAttack = (e) => {
        setAttack(parseInt(e.target.value))
    }

    const parseDecay = (e) => {
        setDecay(parseInt(e.target.value))
    }
    const parseSustain = (e) => {
        setSustain(parseInt(e.target.value))
    }
    const parseRelease = (e) => {
        setRelease(parseInt(e.target.value))
    }

    // const handleMouseUp = () => {
    //     setDragging(false)
    //     console.log('dragging false')
    // }
    // const handleMouseDown = (e) => {
    //     setDragging(true)
    //     console.log('dragging true')
    //     setDragStartY(e.clientY)
    // }

    // const handleMouseLeave = () => {
    //     setDragging(false)
    // }

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
    // want to show a list of the note names C D E F# etc, but want the state to be a number.
    const options = [
        'A',
        'A#',
        'B',
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
    ]
    const handleOptionClick = (option, index) => {
        setRootNote(option)
        setIsDropdownOpen(false)
        console.log(options.indexOf(option), 'bybybyb')
        root = options.indexOf(option) + 1
    }
    console.log(tempo, wonk)

    const countReRenders = useRef(1)

    useEffect(() => {
        countReRenders.current = countReRenders.current + 1
    })
    // TO-DO: make a parameter component in order to avoid repetition
    return (
        <>
            <MainDiv>
                <StartButtonDiv>
                    <button
                        onClick={() => {
                            if (!playing) {
                                setPlaying(true)
                                playingRef.current = !playingRef.current
                                // playing = true
                            } else {
                                setPlaying(false)
                                playingRef.current = !playingRef.current
                                // playing = false
                            }
                            console.log(playing, 'playing')
                        }}
                    >
                        <span> {playing ? 'stop' : 'start'}</span>
                    </button>
                    <span>press s</span> <span>start/stop</span>
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

                {/* these dont work */}
                <SoundFilterDiv>
                    <DropdownContainer>
                        <ParameterLabel>Steps</ParameterLabel>
                        <StyledSelect value={stepCount} onChange={parseSteps}>
                            <StyledOption value="8">8</StyledOption>
                            <StyledOption value="16">16</StyledOption>
                            <StyledOption value="24">24</StyledOption>
                            <StyledOption value="32">32</StyledOption>
                            <StyledOption value="64">64</StyledOption>
                        </StyledSelect>
                    </DropdownContainer>
                    <SoundFilterDiv>
                        <DropdownContainer>
                            <ParameterLabel>Root</ParameterLabel>
                            <ULDropdown
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                            >
                                {isDropdownOpen ? (
                                    options.map((option, index) => (
                                        <Option
                                            key={option}
                                            onClick={() =>
                                                handleOptionClick(option, index)
                                            }
                                        >
                                            {option}
                                        </Option>
                                    ))
                                ) : (
                                    <ChosenOption>{rootNote}</ChosenOption>
                                )}

                                {/* {isDropdownOpen &&
                                    options.map((option) => (
                                        <Option
                                            key={option}
                                            onClick={() =>
                                                handleOptionClick(option)
                                            }
                                        >
                                            {option}
                                        </Option>
                                    ))} */}
                            </ULDropdown>
                            {/* <ULDropdown value={rootNote} onChange={parseRoot}> */}
                            {/* <Option value="0">A</Option>
                        <Option value="1">A#</Option>
                        <Option value="2">B</Option>
                        <Option value="3">C</Option>
                        <Option value="4">C#</Option>
                        <Option value="5">D</Option>
                        <Option value="6">D#</Option>
                        <Option value="7">E</Option>
                        <Option value="8">F</Option>
                        <Option value="9">F#</Option>
                        <Option value="10">G</Option>
                        <Option value="11">G#</Option> */}
                            {/* </ULDropdown> */}
                        </DropdownContainer>
                    </SoundFilterDiv>
                </SoundFilterDiv>
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
const Ref = styled.div`
    margin-top: -30px;
    margin-bottom: 15px;
`
const MainDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 40px;
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
