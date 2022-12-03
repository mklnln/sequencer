import {useContext} from "react"
import styled from "styled-components"
import {MusicParametersContext} from "../App"
import RemoveChordButton from "../RemoveChordButton"

const HookTheoryChordButton = ({
  chord,
  handleChordClick,
  index,
  handleChordRemove,
  blankStepCountArray,
  hookTheoryChords,
}) => {
  // const {handleChordHover} = useContext(MusicParametersContext)

  return (
    <VerticalAlignDiv>
      <ChordButton
        onClick={() => handleChordClick(chord.chord_ID, index)}
        // onMouseEnter={() => handleChordHover(chord.chord_ID)}
      >
        {chord["chord_HTML"]}
      </ChordButton>

      <ProbabilityText>{(chord.probability * 100).toFixed(1)}%</ProbabilityText>
    </VerticalAlignDiv>
  )
}

export default HookTheoryChordButton

const RemoveButtonsDiv = styled.div`
  display: flex;
  padding: 10px 0 0 0;
  justify-content: center;
  align-items: center;
`

const ChordButton = styled.button`
  width: 80px;
  height: 50px;
  background-color: white;
  border: 5px solid #b6cfcf;
  border-radius: 10px;
  margin: 0px;
  color: #3d5c5c;
  font-size: 24px;

  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700px;
  :hover {
    cursor: pointer;
  }
`

const ProbabilityText = styled.span`
  padding: 10px;
  font-size: 16px;
  color: white;
`

const VerticalAlignDiv = styled.div`
  display: flex;
  width: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
