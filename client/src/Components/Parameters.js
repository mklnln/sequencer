import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import { loadSample } from '../AudioEngine'
import { audioTime } from '../AudioEngine'
import Slider from './Slider'
const Parameters = ({ playing, setPlaying }) => {
    //   const [tempo, setTempo] = useState(150)
    const [dragging, setDragging] = useState(false)

    const [tempo, setTempo] = useState(60)
    const [wonk, setWonk] = useState(0)
    const [melodyVolume, setMelodyVolume] = useState(100)
    const [chordsVolume, setChordsVolume] = useState(100)
    const [attack, setAttack] = useState(1)
    const [decay, setDecay] = useState(15)
    const [sustain, setSustain] = useState(60)
    const [release, setRelease] = useState(5)
    const {
        audioContext,
        // tempo,
        // setTempo,
        stepCount,
        setStepCount,
        rootNote,
        setRootNote,
        wonkFactor,
        setWonkFactor,
        // melodyVolume,
        // setMelodyVolume,
        // chordsVolume,
        // setChordsVolume,
        sound,
        setSound,
        filterCutoff,
        setFilterCutoff,
        // attack,
        // setAttack,
        // decay,
        // setDecay,
        // sustain,
        // setSustain,
        // release,
        // setRelease,
    } = useContext(MusicParametersContext)

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
        setWonkFactor(parseInt(e.target.value))
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

    // todo make big param obj

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
    }
    // TO-DO: make a parameter component in order to avoid repetition
    return (
        <MainDiv>
            <StartButtonDiv>
                <button
                    onClick={() => {
                        if (!playing) {
                            setPlaying(true)
                            // playing = true
                        } else {
                            setPlaying(false)
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

            <SoundFilterDiv>
                <ParameterDiv>
                    <label>Steps</label>
                    <select value={stepCount} onChange={parseSteps}>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="24">24</option>
                        <option value="32">32</option>
                        <option value="64">64</option>
                    </select>
                </ParameterDiv>
                <SoundFilterDiv>
                    <ParameterDiv>
                        <label>Root</label>
                        <select value={rootNote} onChange={parseRoot}>
                            <option value="0">A</option>
                            <option value="1">A#</option>
                            <option value="2">B</option>
                            <option value="3">C</option>
                            <option value="4">C#</option>
                            <option value="5">D</option>
                            <option value="6">D#</option>
                            <option value="7">E</option>
                            <option value="8">F</option>
                            <option value="9">F#</option>
                            <option value="10">G</option>
                            <option value="11">G#</option>
                        </select>
                    </ParameterDiv>
                </SoundFilterDiv>
            </SoundFilterDiv>
        </MainDiv>
    )
}

export default Parameters
const MainDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 40px;
`

const Parameter = styled.input`
    -webkit-appearance: slider-vertical;

    margin: 8px;
    height: 75px;
`
const ParameterDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20px;
`

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
