import styled from "styled-components";

const StartingChordButton = ({ chord, handleChordClick, index }) => {
  return (
    <VerticalAlignDiv>
      <ChordButton onClick={() => handleChordClick(chord.chord_ID, index)}>
        {chord["chord_HTML"]}
      </ChordButton>
      <ProbabilityText>{(chord.probability * 100).toFixed(2)}%</ProbabilityText>
    </VerticalAlignDiv>
  );
};

export default StartingChordButton;

const ChordButton = styled.button`
  width: 80px;
  height: 50px;
  background-color: white;
  border: 5px solid #b6cfcf;
  border-radius: 10px;
  margin: 0px 10px;
  color: #3d5c5c;
  font-size: 24px;

  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700px;
  :hover {
    cursor: pointer;
  }
`;

const ProbabilityText = styled.span`
  padding: 10px;
  font-size: 24px;
  color: white;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  width: 200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
