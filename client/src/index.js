import React, { createContext, StrictMode, useState } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

export const AudioEngineContext = createContext();
const root = ReactDOM.createRoot(document.getElementById("root"));

// const [playing, setPlaying] = useState(false);
root.render(
  //   <AudioEngineContext.Provider value={(playing, setPlaying)}>
  <App />
  //   </AudioEngineContext.Provider>
);
