import { dropdownsObj, rootNoteOptions } from './BigObjectsAndArrays'

const samplePianoC2 = require('../assets/samples/c2.mp3')
const sampleOohC2 = require('../assets/samples/oohc2.mp3')
const sampleFeltPianoC3 = require('../assets/samples/feltPianoC3.mp3')
const sampleRonyA2 = require('../assets/samples/RonyA2.mp3')

// http://localhost:3000/assets/samples/c2.mp3
let audioCtx = new AudioContext()
// todo change this dumb name below
let audio // !! needed for sample
export const audioTime = () => {
    return audioCtx.currentTime // convert to ms
}

// code creative
export const loadSample = (sample) => {
    console.log('loading', sample)
    let fetchSrc = sample
    console.log(typeof fetchSrc) // a string
    if (sample === 'samplePianoC2') {
        fetchSrc = samplePianoC2
    } else if (sample === 'sampleRonyA2') {
        fetchSrc = sampleRonyA2
    } else if (sample === 'sampleOohC2') {
        fetchSrc = sampleOohC2
    } else if (sample === 'sampleFeltPianoC3') {
        fetchSrc = sampleFeltPianoC3
    }
    // ! the if statements seem to be necessary. the fetch is picky and won't take a string. see the returns of the console logs being radically different.
    console.log(fetchSrc) // /static/media/c2.63b091ce37bd1f7fdcfb.mp3
    fetch(fetchSrc)
        .then((data) => {
            console.log(data)
            return data.arrayBuffer()
        })
        .then((arrayBuffer) => {
            console.log(arrayBuffer)

            return audioCtx.decodeAudioData(arrayBuffer)
        })
        .then((decodedAudio) => {
            console.log(decodedAudio, 'SAMPLELOADEDEDEdede!!!')
            audio = decodedAudio
        })
}

export const playSample = (
    // audioCtx,
    index,
    playing,
    root,
    wonkFactor,
    voiceQty
) => {
    // C3 sounds best
    const rootFrequency = 1
    const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]
    const voicing = [scale[index - 1]]
    if (voiceQty === 'chords') {
        voicing.push(scale[index + 1])
        voicing.push(scale[index + 3])
    }
    voicing.forEach((monophone) => {
        // https://zpl.fi/pitch-shifting-in-web-audio-api/
        const playSound = audioCtx.createBufferSource()
        playSound.buffer = audio
        // our root is A. our sample is C
        // so A is
        const now = audioCtx.currentTime
        // source.playbackRate.value = 2 ** ((noteToPlay - sampleNote) / 12);
        const note = rootFrequency * 2 ** ((monophone - 1) / 12)
        playSound.playbackRate.value = note // (1.1/12) 1.075*
        // tone.type = "sine"
        // const synthGain = audioCtx.createGain()
        // // shape the ADSR (attack, decay, sustain, release) envelope of the sound
        // // todo could easily set ADSR in FE as state variables
        // // todo filter, wave, etc
        // const attackTime = 0.037
        // const decayTime = 0.2
        // const sustainLevel = 0.0
        // const releaseTime = 0.0
        // const duration = 1
        // synthGain.gain.setValueAtTime(0, 0)
        // // increase or decrease gain based on the above ADSR values
        // synthGain.gain.linearRampToValueAtTime(0.3, now + attackTime)
        // synthGain.gain.linearRampToValueAtTime(
        //   sustainLevel,
        //   now + attackTime + decayTime
        // )
        // synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime)
        // synthGain.gain.linearRampToValueAtTime(0, now + duration)
        // tone.connect(synthGain)
        // synthGain.connect(audioCtx.destination)

        playSound.connect(audioCtx.destination)
        if (playing) {
            setTimeout(() => {
                playSound.start(now)
            }, Math.random() * wonkFactor)
            setTimeout(() => {
                // ! stopping the tone is necessary to keep the audioengine running else it eventually runs out of free oscillators
                playSound.stop()
            }, 4000)
        }
    })
}

const compressorOptions = {
    threshold: -10, // in decibels
    ratio: 20,
    knee: 1,
    attack: 0.01, // in seconds
    release: 0.05, // in seconds
}

export const playSynth = (
    index,
    playing,
    parameterValuesObj,
    polyphony,
    nextNoteTime,
    duration
) => {
    const {
        wonkFactor,
        melody,
        chords,
        sound,
        filter,
        attack,
        decay,
        sustain,
        release,
        root,
    } = parameterValuesObj
    let rootFrequency =
        220 * 2 ** (dropdownsObj.root.options.indexOf(root) / 12) // instead of accessing a big object with note frequency values, we can just calculate them based off of A3 = 220Hz
    const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24] // two octaves of the major scale, counted by # semitones away from the tonic
    // take index, voice chord based off the starting note of the scale
    // based off of index being a proper scale degree (1,2,3 etc), we need to minus one to
    // ! if melody, do monophony. if chords, do polyphony
    // const voicing = [scale[index - 1], , scale[index + 1], scale[index + 3]]
    const voicing = []
    let volume
    if (polyphony === 'melody') {
        voicing.push(scale[index - 1])
        volume = melody
        rootFrequency = rootFrequency * 2
    } else {
        volume = chords / 3
        voicing.push(scale[index - 1])
        voicing.push(scale[index + 1])
        voicing.push(scale[index + 3])
    }
    volume = ((volume / 100) * 1) / 5
    // we want index, index+2, index+4 notes played.
    // ? this could be a state KEY as in major, minor, harmonic minor
    const lowPassFilter = audioCtx.createBiquadFilter()
    lowPassFilter.frequency.value = filter
    lowPassFilter.type = 'lowpass'
    const attackTime = attack / 10 // give 4s
    // const attackTime = attack / 100

    let sustainLevel = (sustain / 100) * volume
    const decayTime = decay / 100
    const releaseTime = (release / 10) * (1 / 3)
    const synthGain = audioCtx.createGain()

    const now = audioCtx.currentTime
    // shape the ADSR envelope of the sound
    const compressor = new DynamicsCompressorNode(audioCtx, compressorOptions)
    // const analyzer = audioCtx.createAnalyser()
    synthGain
        // .connect(analyzer)
        // .connect(compressor)
        .connect(lowPassFilter)

    // compressor.connect(synthGain)
    // synthGain.connect(compressor)
    // synthGain.connect(compressor)
    // compressor.connect(audioCtx.destination)

    // todo noteLength must be calculated by my linearRamp to whatever synth ADSR parameters
    voicing.forEach((monophone) => {
        const note = rootFrequency * 2 ** (monophone / 12)
        // 2^(12/12)
        // 0 = 1
        // 1/12, 1.0075
        const osc = audioCtx.createOscillator()
        osc.frequency.value = note // (1.1/12) 1.075*
        osc.type = sound.toLowerCase()

        osc.connect(synthGain)
        if (playing) {
            setTimeout(() => {
                osc.start(nextNoteTime)
                osc.connect(synthGain)
                lowPassFilter.connect(compressor).connect(audioCtx.destination)
                synthGain.gain.setValueAtTime(0, now)
                // attack
                synthGain.gain.linearRampToValueAtTime(volume, now + attackTime)
                // decay down from attack peak to sustain level

                // setTimeout(() => {
                //     console.log(
                //         now + duration + attackTime,
                //         'release ramp starts'
                //     )
                //     synthGain.gain.linearRampToValueAtTime(
                //         0,
                //         now + duration + attackTime + decayTime + releaseTime
                //     )
                // }, attackTime * 1000)

                synthGain.gain.linearRampToValueAtTime(
                    0,
                    now + duration + attackTime + decayTime + releaseTime
                )
            }, 1)
            setTimeout(() => {
                osc.stop()
                // osc.disconnect()
                // synthGain.disconnect()
            }, (duration + attackTime + decayTime + releaseTime) * 3000)
        }
    })
}
