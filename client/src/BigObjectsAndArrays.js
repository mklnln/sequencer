export const rootNoteOptions = [
    'A',
    'A#',
    'B',
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
]

export const stepCountOptions = ['8', '16', '24', '32', '64']

export const slidersToShowObj = {
    tempo: {
        id: 0,
        minValue: 30,
        maxValue: 240,
        title: 'Tempo',
    },
    wonk: {
        id: 1,
        minValue: 0,
        maxValue: 100,
        title: 'Wonk',
    },
    melodyVolume: {
        id: 2,
        minValue: 0,
        maxValue: 100,
        title: 'Melody',
    },
    chordsVolume: {
        id: 3,
        minValue: 0,
        maxValue: 100,
        title: 'Chords',
    },
    attack: {
        id: 4,
        minValue: 0,
        maxValue: 100,
        title: 'Attack',
    },
    sustain: {
        id: 5,
        minValue: 0,
        maxValue: 100,
        title: 'Sustain',
    },
    decay: {
        id: 6,
        minValue: 0,
        maxValue: 100,
        title: 'Decay',
    },
    release: {
        id: 7,
        minValue: 0,
        maxValue: 100,
        title: 'Release',
    },
    filter: {
        id: 8,
        minValue: 100,
        maxValue: 10000,
        title: 'Filter',
    },
}
