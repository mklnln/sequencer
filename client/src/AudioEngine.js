import {useContext} from "react"
import {MusicParametersContext} from "./App.js"

const samplePianoC2 = require("./assets/samples/c2.mp3")
const sampleOohC2 = require("./assets/samples/oohc2.mp3")
const sampleFeltPianoC3 = require("./assets/samples/feltPianoC3.mp3")
const sampleRonyA2 = require("./assets/samples/RonyA2.mp3")

let audio
export const loadSample = (sample, audioContext) => {
  // left in for demo purposes
  console.log("loading", sample)
  // sample will be a string with the same name as above consts representing mp3 samples
  let fetchSrc = sample
  // left in for demo purposes
  console.log(typeof fetchSrc) // a string
  if (sample === "samplePianoC2") {
    fetchSrc = samplePianoC2
  } else if (sample === "sampleRonyA2") {
    fetchSrc = sampleRonyA2
  } else if (sample === "sampleOohC2") {
    fetchSrc = sampleOohC2
  } else if (sample === "sampleFeltPianoC3") {
    fetchSrc = sampleFeltPianoC3
  }
  // the if statements seem to be necessary. the fetch is picky and won't take a string. see the returns of the above console logs being radically different.
  console.log(fetchSrc) // /static/media/c2.63b091ce37bd1f7fdcfb.mp3
  fetch(fetchSrc)
    .then((data) => {
      console.log(data)
      return data.arrayBuffer()
    })
    .then((arrayBuffer) => {
      console.log(arrayBuffer)

      return audioContext.decodeAudioData(arrayBuffer)
    })
    .then((decodedAudio) => {
      console.log(decodedAudio, "SAMPLELOADEDEDEdede!!!")
      audio = decodedAudio
    })
}

export const playSample = (
  index,
  playing,
  wonkFactor,
  voiceQty,
  audioContext
) => {
  // see notes in playSynth regarding frequencies, scales, etc etc
  const rootFrequency = 0.75
  const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]
  const voicing = [scale[index - 1]]
  if (voiceQty === "chords") {
    voicing.push(scale[index + 1])
    voicing.push(scale[index + 3])
  }
  voicing.forEach((monophone) => {
    const playSound = audioContext.createBufferSource()
    playSound.buffer = audio
    const now = audioContext.currentTime
    const note = rootFrequency * 2 ** ((monophone - 1) / 12)
    // changing playbackRate changes pitch, allowing the use of one sample as an instrument
    playSound.playbackRate.value = note

    playSound.connect(audioContext.destination)
    if (playing) {
      setTimeout(() => {
        playSound.start(now)
        // wonkFactor delays the start of the oscillator by a random amount
      }, Math.random() * wonkFactor)
      setTimeout(() => {
        // stopping the tone is necessary to keep the audioengine running else it eventually runs out of free oscillators
        playSound.stop()
      }, 4000)
    }
  })
}

export const playSynth = (
  index,
  playing,
  rootNote,
  wonkFactor,
  melodyVolume,
  chordsVolume,
  sound,
  filterCutoff,
  attack,
  decay,
  sustain,
  release,
  polyphony,
  audioContext
) => {
  let rootFrequency = 220 * 2 ** (rootNote / 12) // instead of accessing a big object with note frequency values, we can just calculate them based off of A3 = 220Hz

  const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24] // two octaves of the major scale, counted by # semitones away from the tonic
  // take index, voice chord based off the starting note of the scale
  // given that the value of index is a proper scale degree (1,2,3 etc), we need to minus one

  // if melody, play monophonic. if chords, do polyphony
  const voicing = []
  let volume
  if (polyphony === "melody") {
    voicing.push(scale[index - 1])
    volume = melodyVolume
    rootFrequency = rootFrequency * 2
  } else {
    volume = chordsVolume
    voicing.push(scale[index - 1])
    voicing.push(scale[index + 1])
    voicing.push(scale[index + 3])
  }

  voicing.forEach((monophone) => {
    const note = rootFrequency * 2 ** (monophone / 12)
    // note on tuning: given equal temperament (our modern tuning system), note frequencies can be found easily with math
    // 2^(12/12) = 2
    // 2^(1/12) =  1.0075

    const osc = audioContext.createOscillator()
    osc.frequency.value = note
    osc.type = sound
    const lowPassFilter = audioContext.createBiquadFilter()
    lowPassFilter.frequency.value = filterCutoff
    lowPassFilter.type = "lowpass"
    const now = audioContext.currentTime
    osc.connect(lowPassFilter)
    const synthGain = audioContext.createGain()
    // shape the ADSR (attack, decay, sustain, release) envelope of the sound
    const attackTime = (attack / 100) * 2
    const decayTime = decay / 100
    // the 1/3 value is meant to reduce volume to avoid clipping, same with releaseTime
    let sustainLevel = (sustain / 100) * (1 / 4)
    // subtracting sustain to a value below or near zero may flip it back over to 0.9999, distorting the audio. set to 0 to avoid this.
    if (sustain === 1) sustainLevel = 0
    const releaseTime = (release / 10) * (1 / 3)
    // duration refers to how long the note is held. hardcoded in order to avoid clipping
    const duration = 0.5
    synthGain.gain.setValueAtTime(0, 0)
    // attack
    synthGain.gain.linearRampToValueAtTime(
      (volume / 100) * (1 / 3),
      now + attackTime
    )
    // decay down from attack peak to sustain level
    const volumeModifier = (volume * sustainLevel) / 100
    synthGain.gain.linearRampToValueAtTime(
      volumeModifier,
      now + attackTime + decayTime
    )
    // release down to zero after note duration
    synthGain.gain.linearRampToValueAtTime(
      0,
      now + duration + attackTime + decayTime + releaseTime
    )
    lowPassFilter.connect(synthGain)
    synthGain.connect(audioContext.destination)

    if (playing) {
      // osc.start()
      setTimeout(() => {
        osc.start()
        // wonkFactor delays the start of the oscillator by a random amount
      }, Math.random() * wonkFactor)
      setTimeout(() => {
        // stopping the osc is necessary to keep the audioengine running else it eventually runs out of free oscillators
        osc.stop()
        // remember that setTimeout works in ms, synth in s
      }, (wonkFactor + duration + attackTime + decayTime + releaseTime) * 1000)
    }
  })
}
