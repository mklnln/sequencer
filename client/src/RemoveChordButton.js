import styled from "styled-components";

const RemoveChordButton = ({ index, handleChordRemove }) => {
  return (
    <>
      <RemoveChord onClick={() => handleChordRemove(index + 1, index)}>
        Remove Chord #{index + 1}
      </RemoveChord>
    </>
  );
};

export default RemoveChordButton;

const RemoveChord = styled.button`
  font-size: 12px;
  width: 80px;
  height: 50px;
  margin: 0 20px;
  background-color: white;
  border: 5px solid #b6cfcf;
  border-radius: 10px;
  /* margin: 0px 10px; */
  color: #3d5c5c;

  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700px;
  :hover {
    cursor: pointer;
  }
`;
