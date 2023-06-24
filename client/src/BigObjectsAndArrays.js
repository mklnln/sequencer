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
export const soundOptions = [
    'Sine',
    'Triangle',
    'Sawtooth',
    'Square',
    'Aah',
    'Ooh',
    'Piano',
]

export const romanNumeralReference = {
    major: {
        1: 'I',
        2: 'ii',
        3: 'iii',
        4: 'IV',
        5: 'V',
        6: 'vi',
        7: 'vii',
        8: 'I',
    },
}

export const melodyNotesArr = [
    'note-15',
    'note-14',
    'note-13',
    'note-12',
    'note-11',
    'note-10',
    'note-9',
    'note-8',
    'note-7',
    'note-6',
    'note-5',
    'note-4',
    'note-3',
    'note-2',
    'note-1',
]

export const chordNotesArr = [
    'note-8',
    'note-7',
    'note-6',
    'note-5',
    'note-4',
    'note-3',
    'note-2',
    'note-1',
]

export const slidersToShowObj = {
    tempo: {
        id: 0,
        minValue: 30,
        maxValue: 240,
        title: 'Tempo',
        defaultValue: 120,
    },
    wonk: {
        id: 1,
        minValue: 0,
        maxValue: 100,
        title: 'Wonk',
        defaultValue: 0,
    },
    melodyVolume: {
        id: 2,
        minValue: 0,
        maxValue: 100,
        title: 'Melody',
        defaultValue: 100,
    },
    chordsVolume: {
        id: 3,
        minValue: 0,
        maxValue: 100,
        title: 'Chords',
        defaultValue: 100,
    },
    attack: {
        id: 4,
        minValue: 0,
        maxValue: 100,
        title: 'Attack',
        defaultValue: 1,
    },
    decay: {
        id: 5,
        minValue: 0,
        maxValue: 100,
        title: 'Decay',
        defaultValue: 15,
    },
    sustain: {
        id: 6,
        minValue: 0,
        maxValue: 100,
        title: 'Sustain',
        defaultValue: 60,
    },

    release: {
        id: 7,
        minValue: 0,
        maxValue: 100,
        title: 'Release',
        defaultValue: 5,
    },
    filter: {
        id: 8,
        minValue: 100,
        maxValue: 10000,
        title: 'Filter',
        defaultValue: 7500,
    },
}
