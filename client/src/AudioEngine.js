export const PlayBeatMelody = (index) => {
  const rootFrequency = 220;
  const note = rootFrequency * 2 ** (parseInt(monophone) / 12);
  // 440 is just a placehodlder thats going to C, D# or
  // octave / 12 = chromatic scale
  // major 1, 3, 5, 6, 8, 10, 11, 12
  // hard code skipping notes to create major scale
  // todo different note
  const tone = audioContext.createOscillator();
  const now = audioContext.currentTime;
  const randomFreq = Math.random() * 500 + 100;
  tone.frequency.value = note; // (1.1/12) 1.075*
  tone.type = "sine";
  const synthGain = audioContext.createGain();
  // shape the ADSR (attack, decay, sustain, release) envelope of the sound
  // todo could easily set ADSR in FE as state variables
  // todo filter, wave, etc
  const attackTime = 0.037;
  const decayTime = 0.2;
  const sustainLevel = 0.0;
  const releaseTime = 0.0;
  const duration = 1;
  synthGain.gain.setValueAtTime(0, 0);
  // increase or decrease gain based on the above ADSR values
  synthGain.gain.linearRampToValueAtTime(0.3, now + attackTime);
  synthGain.gain.linearRampToValueAtTime(
    sustainLevel,
    now + attackTime + decayTime
  );
  synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
  synthGain.gain.linearRampToValueAtTime(0, now + duration);
  tone.connect(synthGain);
  synthGain.connect(audioContext.destination);

  // const stopBeat = () => {};
  if (playing) {
    setTimeout(() => {
      tone.start();
    }, Math.random() * 300);
  }
  // tone.stop(time + 100); // 100 milliseconds?
};

export const PlayBeatChord = (index) => {
  // const { playing } = useContext(AudioEngineContext);
  const rootFrequency = 220;
  // ? i want to automate as much as possible the voicing and scale stuff. i may need to hard code scales, though. something that skips notes that aren't in key.
  const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]; // two octaves of the major scale, counted by # semitones away from the tonic
  // take index, voice chord based off the starting note of the scale
  const chordVoicing = [scale[index - 1], scale[index + 1], scale[index + 3]]; // based off of index being a proper scale degree (1,2,3 etc), we need to minus one to
  console.log(chordVoicing, "voices");
  // we want index, index+2, index+4 notes played.
  // ? this could be a state KEY as in major, minor, harmonic minor
  chordVoicing.forEach((monophone) => {
    const note = rootFrequency * 2 ** (parseInt(monophone) / 12);
    // 440 is just a placehodlder thats going to C, D# or
    // octave / 12 = chromatic scale
    // major 1, 3, 5, 6, 8, 10, 11, 12
    // hard code skipping notes to create major scale
    // todo different note
    const tone = audioContext.createOscillator();
    const now = audioContext.currentTime;
    const randomFreq = Math.random() * 500 + 100;
    tone.frequency.value = note; // (1.1/12) 1.075*
    tone.type = "sine";
    const synthGain = audioContext.createGain();
    // shape the ADSR (attack, decay, sustain, release) envelope of the sound
    // todo could easily set ADSR in FE as state variables
    // todo filter, wave, etc
    const attackTime = 0.037;
    const decayTime = 0.2;
    const sustainLevel = 0.0;
    const releaseTime = 0.0;
    const duration = 1;
    synthGain.gain.setValueAtTime(0, 0);
    // increase or decrease gain based on the above ADSR values
    synthGain.gain.linearRampToValueAtTime(0.3, now + attackTime);
    synthGain.gain.linearRampToValueAtTime(
      sustainLevel,
      now + attackTime + decayTime
    );
    synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
    synthGain.gain.linearRampToValueAtTime(0, now + duration);
    tone.connect(synthGain);
    synthGain.connect(audioContext.destination);

    // const stopBeat = () => {};
    if (playing) {
      setTimeout(() => {
        tone.start();
      }, Math.random() * 300);
    }
    // tone.stop(time + 100); // 100 milliseconds?
  });
};
