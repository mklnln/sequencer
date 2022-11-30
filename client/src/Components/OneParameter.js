import React from "react"
import styled from "styled-components"

const OneParameter = () => {
  return (
    <div>
      <span>Tempo</span>
      <Parameter
        type="range"
        min="60.0"
        max="240.0"
        step="1"
        value={tempo}
        onInput={(e) => parseTempo(e)}
      />{" "}
      <span>{tempo}</span>
    </div>
  )
}

export default OneParameter

const Parameter = styled.input`
  border: 1px solid fuchsia;
  -webkit-appearance: slider-vertical;
  height: 75px;
  background-color: black;
`
