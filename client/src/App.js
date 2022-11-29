import { useEffect, useState, useRef, createContext, Fragment } from "react";
import Checkbox from "./Components.js/Checkbox";
import PlayBeatChord from "./PlayBeatChord";
import Sequencer from "./Sequencer";
import styled from "styled-components";

import { GlobalStyleComponent } from "styled-components";
import GlobalStyle from "./globalStyles";
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
    <Fragment>
      <GlobalStyle />
      <Sequencer />
    </Fragment>
    // </MusicParametersContext.Provider>
  );
};

export default App;
