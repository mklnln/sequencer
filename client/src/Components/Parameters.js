import React, {useContext, useEffect, useState} from "react"
import styled from "styled-components"
import {Donut} from "react-dial-knob"
import {MusicParametersContext} from "../App"

const Parameters = ({
  playing,
  setPlaying,
  //   setAreBeatsChecked,
  //   generateAreBeatsCheckedInitialState,
  //   makeNotesState,
  //   blankStepCountArray,
}) => {
  //   const [tempo, setTempo] = useState(150)
  const {
    tempo,
    setTempo,
    stepCount,
    setStepCount,
    rootNote,
    setRootNote,
    wonkFactor,
    setWonkFactor,
  } = useContext(MusicParametersContext)
  const parseTempo = (e) => {
    setTempo(parseInt(e.target.value, 10))
  }

  const parseSteps = (e) => {
    console.log("steps")
    setStepCount(parseInt(e.target.value))
    console.log(stepCount)
  }

  const parseRoot = (e) => {
    setRootNote(parseInt(e.target.value))
    console.log(rootNote)
  }
  const parseWonk = (e) => {
    setWonkFactor(parseInt(e.target.value))
    console.log(wonkFactor)
  }

  //   useEffect(() => {
  //     setAreBeatsChecked(
  //       generateAreBeatsCheckedInitialState(makeNotesState, blankStepCountArray)
  //     )
  //   }, [stepCount])

  return (
    <MainDiv>
      <button
        onClick={() => {
          if (!playing) {
            setPlaying(true)
          } else {
            setPlaying(false)
          }
        }}
      >
        start/stop
      </button>
      {/* <button onClick={() => synth.stop()}>stop synth</button> */}
      <ParameterDiv>
        <span>Tempo</span>
        <Parameter
          type="range"
          min="60.0"
          max="240.0"
          step="1"
          value={tempo}
          onInput={(e) => parseTempo(e)}
        />
        <span>{tempo}</span>
      </ParameterDiv>
      <ParameterDiv>
        <span>Wonk</span>
        <Parameter
          type="range"
          min="60.0"
          max="600.0"
          step="1"
          value={wonkFactor}
          onInput={(e) => parseWonk(e)}
        />
        <span>{wonkFactor}</span>
      </ParameterDiv>
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
      <ParameterDiv>
        <label>Root Note</label>
        <select value={rootNote} onChange={parseRoot}>
          {/* <option value="A">A</option>
          <option value="A#">A#</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="C#">C#</option>
          <option value="D">D</option>
          <option value="D#">D#</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="F#">F#</option>
          <option value="G">G</option>
          <option value="G#">G#</option> */}
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
    </MainDiv>
  )
}

export default Parameters
const MainDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid fuchsia;
`

const Parameter = styled.input`
  border: 1px solid fuchsia;
  -webkit-appearance: slider-vertical;
  margin: 8px;
  height: 75px;
`
const ParameterDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const RadioDiv = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`
