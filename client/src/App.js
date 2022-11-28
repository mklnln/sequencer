import { useEffect, useState, useRef, createContext } from "react";
import Checkbox from "./Checkbox";
import PlayBeatChord from "./PlayBeatChord";
import Sequencer from "./Sequencer";

export const MusicParametersContext = createContext();
// ? do i even need context?

const App = () => {
  const [amtOfNotes, setAmtOfNotes] = useState(8);
  return (
    <MusicParametersContext.Provider value={(amtOfNotes, setAmtOfNotes)}>
      <Sequencer />;
    </MusicParametersContext.Provider>
  );
};

export default App;
