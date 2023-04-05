import {useContext, useEffect, useState} from "react"
import {MusicParametersContext} from "../App"
import Knob from "react-simple-knob"

const InputKnob = ({parseTempo, setParameterState, parameterState, str}) => {
  const {tempo, setTempo, setWonkFactor, wonkFactor, setMelodyVolume} =
    useContext(MusicParametersContext)

  const style = {
    // margin: "20%",
    height: "80px",
    fontFamily: "Arial",
    fontSize: "0px",
    color: "white", // Sets font color of value and knob name,
  }

  return (
    <>
      <Knob
        name="Volume"
        unit="dB"
        defaultPercentage={0.1}
        onChange={(e) => setTempo(e)}
        bg="grey"
        fg="pink"
        value={tempo}
        mouseSpeed={5}
        transform={(p) => parseInt(p * 50, 10) - 50} // -50 meaning when input = 0, default is -50dB
        style={style}
      />
    </>
  )
}
export default InputKnob
