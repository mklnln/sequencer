import { useEffect, useState } from "react";
import styled from "styled-components";
const Checkbox = ({
  handleBeatCheckbox,
  beatIndex,
  areBeatsChecked,
  chordIndex,
}) => {
  const [checked, setChecked] = useState(
    areBeatsChecked[`chord-${chordIndex}`][beatIndex] ? "checked" : ""
  );

  useEffect(() => {
    setChecked(
      areBeatsChecked[`chord-${chordIndex}`][beatIndex] ? "checked" : ""
    );
  }, [areBeatsChecked]);

  return (
    <>
      <CheckboxButton
        type="checkbox"
        checked={checked ? "checked" : ""}
        // onClick={() => {
        //   console.log(areBeatsChecked);
        // }}
        onChange={() => {
          console.log("checkbox onchange");
          // clg here with handleBeatCheckbox disabled does not change the state. good.
          console.log(areBeatsChecked);
          handleBeatCheckbox(chordIndex, beatIndex, checked);
          setChecked(!checked);
        }}
      />
    </>
  );
};

export default Checkbox;

const CheckboxButton = styled.input`
  border: none;
  background-color: gray;
  width: 4px;
  opacity: 25%;
  height: 4px;
  padding: 10px;
  appearance: none;
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
`;
