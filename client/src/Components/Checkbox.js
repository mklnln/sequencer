import {useContext, useEffect, useState} from "react"
import styled from "styled-components"
import {MusicParametersContext} from "../App"
const Checkbox = ({
  handleBeatCheckbox,
  beatIndex,
  areBeatsChecked,
  chordIndex,
}) => {
  const [checked, setChecked] = useState(
    areBeatsChecked[`chord-${chordIndex}`][beatIndex] ? "checked" : ""
  )
  // const [hoveredButton, setHoveredButton] = useState(false)
  // const {chordToHover, setChordToHover} = useContext(MusicParametersContext)
  // const hoverIndex = []

  // if (chordToHover.chordID === chordIndex) {
  //   if (
  //     chordToHover.chordInputStep === beatIndex ||
  //     chordToHover.chordInputStep === beatIndex + 1 ||
  //     chordToHover.chordInputStep === beatIndex + 2 ||
  //     chordToHover.chordInputStep === beatIndex + 3
  //   ) {
  //     setHoveredButton(true)
  //   } else if (chordToHover.chordInputStep === beatIndex) {
  //     setHoveredButton(false)
  //   }
  // }

  useEffect(() => {
    setChecked(
      areBeatsChecked[`chord-${chordIndex}`][beatIndex] ? "checked" : ""
    )
  }, [areBeatsChecked])

  return (
    <>
      <CheckboxButton
        type="checkbox"
        checked={checked ? "checked" : ""}
        onChange={() => {
          handleBeatCheckbox(chordIndex, beatIndex, checked)
          setChecked(!checked)
        }}
      />
      {/* {chordIndex === 1 && <BeatMarker></BeatMarker>} */}
    </>
  )
}

export default Checkbox

const CheckboxButton = styled.input`
  border: none;
  background-color: gray;
  width: 4px;
  opacity: 25%;
  height: 4px;
  padding: 10px;
  appearance: none;
  .hoverAppearance {
    cursor: pointer;
    background-color: #eaeae1;
    border: 5px solid #eaeae1;
    opacity: 25%;
    padding: 5px;
    border-radius: 5px;
  }

  :hover {
    cursor: pointer;
    background-color: #eaeae1;
    border: 5px solid #eaeae1;
    opacity: 25%;
    padding: 5px;
    border-radius: 5px;
  }
  :checked {
    background-color: #eaeae1;
    border-radius: 10px;
    border: 5px solid #eaeae1;
    opacity: 80%;
    padding: 5px;
  }
  :checked && :hover {
    background-color: white;
  }
`
const BeatMarker = styled.div`
  display: inline;
  position: relative;
  top: 50%;
  border: 1px solid fuchsia;
`
