export default class SoundEngine {
  constructor() {
    // this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.audioContext = new AudioContext();
  }

  playBeat(nextNotes = [], state = {}) {
    console.log(nextNotes);
    nextNotes.forEach((note) => {
      const tone = this.audioContext.createOscillator();
      const now = this.audioContext.currentTime;
      const randomFreq = Math.random() * 3000 + 60;
      console.log(randomFreq);
      tone.frequency.value = randomFreq; // (1.1/12) 1.075*
      tone.type = state.type;
      const synthGain = this.audioContext.createGain();
      // shape the ADSR (attack, decay, sustain, release) envelope of the sound
      const attackTime = 0.005;
      const decayTime = 0.3;
      const sustainLevel = 0.0;
      const releaseTime = 0.0;
      const duration = 1;
      synthGain.gain.setValueAtTime(0, 0);
      // increase or decrease gain based on the above ADSR values
      synthGain.gain.linearRampToValueAtTime(1, now + attackTime);
      synthGain.gain.linearRampToValueAtTime(
        sustainLevel,
        now + attackTime + decayTime
      );
      synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
      synthGain.gain.linearRampToValueAtTime(0, now + duration);
      tone.connect(synthGain);
      synthGain.connect(this.audioContext.destination);
      tone.start();
    });
    // const stopBeat = () => {};
    // setTimeout(() => {
    //   tone.stop();
    // }, 100);
    // tone.stop(time + 100); // 100 milliseconds?
  }
}
