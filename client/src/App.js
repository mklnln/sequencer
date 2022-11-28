import { useEffect, useState, useRef, createContext } from "react";
import Checkbox from "./Checkbox";
import PlayBeatChord from "./PlayBeatChord";
import Sequencer from "./Sequencer";
import styled from "styled-components";

import { GlobalStyleComponent } from "styled-components";

// export const MusicParametersContext = createContext();
// ? do i even need context?

const App = () => {
  return (
    // <MusicParametersContext.Provider
    //   value={{
    //     amtOfNotes,
    //     setAmtOfNotes,
    //     resolution,
    //     setResolution,
    //   }}
    // >
    <Sequencer />
    // </MusicParametersContext.Provider>
  );
};

export default App;
