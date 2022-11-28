import { useState } from "react";
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

  return (
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
  );
};

export default Checkbox;

const CheckboxButton = styled.input`
  border: 1px solid fuchsia;
`;
