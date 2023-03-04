import React, {useContext, useEffect, useState} from "react"
import styled from "styled-components"
import {Donut} from "react-dial-knob"
import {MusicParametersContext} from "../App"
import {loadSample} from "../AudioEngine"
import InputKnob from "./InputKnob"

const Parameters = ({playing, setPlaying}) => {
  //   const [tempo, setTempo] = useState(150)
  const {
    audioContext,
    tempo,
    setTempo,
    stepCount,
    setStepCount,
    rootNote,
    setRootNote,
    wonkFactor,
    setWonkFactor,
    melodyVolume,
    setMelodyVolume,
    chordsVolume,
    setChordsVolume,
    sound,
    setSound,
    filterCutoff,
    setFilterCutoff,
    attack,
    setAttack,
    decay,
    setDecay,
    sustain,
    setSustain,
    release,
    setRelease,
  } = useContext(MusicParametersContext)

  // setState on parameters was finnicky at times, making separate functions helped.
  // TO-DO: cut down on this bloat and keep setState calls as anonymous callbacks within the below returns.
  const parseTempo = (e) => {
    setTempo(parseInt(e.target.value, 10))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }

  const parseSteps = (e) => {
    setStepCount(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }

  const parseRoot = (e) => {
    setRootNote(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }
  const parseWonk = (e) => {
    setWonkFactor(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }
  const parseMelodyVolume = (e) => {
    setMelodyVolume(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }
  const parseChordsVolume = (e) => {
    setChordsVolume(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }
  const parseSound = (e) => {
    setSound(e.target.value)
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
    if (
      e.target.value === "samplePianoC2" ||
      e.target.value === "sampleOohC2" ||
      e.target.value === "sampleRonyA2" ||
      e.target.value === "sampleFeltPianoC3"
    ) {
      loadSample(e.target.value, audioContext)
    }
  }
  const parseFilterCutoff = (e) => {
    setFilterCutoff(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }
  const parseAttack = (e) => {
    setAttack(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }

  const parseDecay = (e) => {
    setDecay(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }
  const parseSustain = (e) => {
    setSustain(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }
  const parseRelease = (e) => {
    setRelease(parseInt(e.target.value))
    setTimeout(() => {
      audioContext.close()
      console.log("wait 1000ms")
    }, 5000)
  }

  // useEffect(() => {
  //   // used for input-knobs.js
  //   const script = document.createElement("script")
  //   script.innerHTML = knobListener
  //   script.async = true
  //   console.log("input knobs loaded")
  //   document.body.appendChild(script)

  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])

  // TO-DO: make a parameter component in order to avoid repetition
  return (
    <MainDiv>
      <StartButtonDiv>
        <button
          onClick={() => {
            if (!playing) {
              setPlaying(true)
            } else {
              setPlaying(false)
            }
          }}
        >
          {playing ? "stop" : "start"}
        </button>
        <span>press s</span> <span>start/stop</span>
      </StartButtonDiv>
      {/* <button onClick={() => synth.stop()}>stop synth</button> */}
      <ParameterDiv>
        <span>Tempo</span>
        {/* <Parameter */}
        <InputKnob parseTempo={parseTempo} />
        <span>{tempo}</span>
      </ParameterDiv>
      <ParameterDiv>
        <span>Wonk</span>
        <Parameter
          type="range"
          class="input-knob"
          min="1.0"
          max="400.0"
          step="1"
          value={wonkFactor}
          onInput={(e) => parseWonk(e)}
        />
        <span>{wonkFactor}</span>
      </ParameterDiv>
      <ParameterDiv>
        <span>Melody</span>
        <input
          type="range"
          class="input-knob"
          min="0"
          max="100"
          step="1"
          value={melodyVolume}
          onInput={(e) => parseMelodyVolume(e)}
        />
        <span>{melodyVolume}</span>
      </ParameterDiv>
      <ParameterDiv>
        <span>Chords</span>
        <input
          type="range"
          class="input-knob"
          min="0"
          max="100"
          step="1"
          value={chordsVolume}
          onInput={(e) => parseChordsVolume(e)}
        />
        <span>{chordsVolume}</span>
      </ParameterDiv>
      <SoundFilterDiv>
        <ParameterDiv>
          <label>Sound</label>
          <select value={sound} onChange={parseSound}>
            <option value="sine">Sine Wave</option>
            <option value="square">Square Wave</option>
            <option value="sawtooth">Sawtooth Wave</option>
            <option value="triangle">Triangle Wave</option>
            <option value="sampleOohC2">Sample -- Ooh</option>
            <option value="samplePianoC2">Sample -- Piano</option>
            <option value="sampleFeltPianoC3">Sample -- Felt Piano</option>
            <option value="sampleRonyA2">Sample -- Rony Uhh</option>
          </select>
        </ParameterDiv>
        <SoundFilterDiv>
          <ParameterDiv>
            <span>Filter</span>
            <input
              type="range"
              class="input-knob"
              min="0"
              max="11000"
              step="10"
              value={filterCutoff}
              onInput={(e) => parseFilterCutoff(e)}
            />
            <span>{filterCutoff}</span>
          </ParameterDiv>
        </SoundFilterDiv>
      </SoundFilterDiv>
      <ParameterDiv>
        <span>Attack</span>
        <input
          type="range"
          class="input-knob"
          min="1.0"
          max="100.0"
          step="1"
          value={attack}
          onInput={(e) => parseAttack(e)}
        />
        <span>{attack}</span>
      </ParameterDiv>
      <ParameterDiv>
        <span>Decay</span>
        <input
          type="range"
          class="input-knob"
          min="1.0"
          max="100.0"
          step="1"
          value={decay}
          onInput={(e) => parseDecay(e)}
        />
        <span>{decay}</span>
      </ParameterDiv>
      <ParameterDiv>
        <span>Sustain</span>
        <input
          type="range"
          class="input-knob"
          min="1.0"
          max="100.0"
          step="1"
          value={sustain}
          onInput={(e) => parseSustain(e)}
        />
        <span>{sustain}</span>
      </ParameterDiv>
      <ParameterDiv>
        <span>Release</span>
        <input
          type="range"
          class="input-knob"
          min="1.0"
          max="100.0"
          step="1"
          value={release}
          onInput={(e) => parseRelease(e)}
        />
        <span>{release}</span>
      </ParameterDiv>
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
