const Sequencer = () => {
  return (
    <div>
      jello werld
      <button
        onClick={() => {
          console.log("click");
          if (!playing) {
            console.log("play");
            setPlaying(true);
          } else {
            setPlaying(false);
          }
        }}
      >
        start/stop
      </button>
      {/* <button onClick={() => synth.stop()}>stop synth</button> */}
      <span>Tempo</span>
      <input
        type="range"
        min="30.0"
        max="160.0"
        step="1"
        value={tempo}
        onInput={(e) => parseTempo(e)}
      />{" "}
      <span>{tempo}</span>
      <section>
        {
          // can't map an object
          areBeatsCheckedArray.map((chord) => {
            // this first map with a div controls the note over time, i.e. the row
            const chordIndex = chord;
            return (
              <div key={`row-${chordIndex}`}>
                {areBeatsChecked[`chord-${chordIndex}`].map((check, index) => {
                  return (
                    <Checkbox
                      key={`row-${chordIndex}-beat-${index}`}
                      chord={chord}
                      areBeatsChecked={areBeatsChecked}
                      beatIndex={index}
                      chordIndex={chordIndex}
                      handleBeatCheckbox={handleBeatCheckbox}
                    />
                  );
                })}
              </div>
            );
          })
        }
      </section>
      <button
        onClick={() => {
          console.log(playing);
          console.log(areBeatsChecked);
        }}
      >
        checked state
      </button>
    </div>
  );
};

export default Sequencer;
