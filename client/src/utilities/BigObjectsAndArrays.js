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

export const melodyNotesObj = {
    'note-15': '1',
    'note-14': '7',
    'note-13': '6',
    'note-12': '5',
    'note-11': '4',
    'note-10': '3',
    'note-9': '2',
    'note-8': '1',
    'note-7': '7',
    'note-6': '6',
    'note-5': '5',
    'note-4': '4',
    'note-3': '3',
    'note-2': '2',
    'note-1': '1',
}

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
        minValue: 30,
        maxValue: 240,
        title: 'Tempo',
        defaultValue: 120,
    },
    wonk: {
        minValue: 0,
        maxValue: 100,
        title: 'Wonk',
        defaultValue: 0,
    },
    melody: {
        minValue: 0,
        maxValue: 100,
        title: 'Melody',
        defaultValue: 100,
    },
    chords: {
        minValue: 0,
        maxValue: 100,
        title: 'Chords',
        defaultValue: 100,
    },
    attack: {
        minValue: 0,
        maxValue: 100,
        title: 'Attack',
        defaultValue: 1,
    },
    decay: {
        minValue: 0,
        maxValue: 100,
        title: 'Decay',
        defaultValue: 15,
    },
    sustain: {
        minValue: 0,
        maxValue: 100,
        title: 'Sustain',
        defaultValue: 60,
    },

    release: {
        minValue: 0,
        maxValue: 100,
        title: 'Release',
        defaultValue: 5,
    },
    filter: {
        minValue: 100,
        maxValue: 10000,
        title: 'Filter',
        defaultValue: 7500,
    },
}

export const dropdownsObj = {
    sound: {
        title: 'Sound',
        defaultValue: 'Sine',
        options: [
            'Sine',
            'Triangle',
            'Sawtooth',
            'Square',
            'Aah',
            'Ooh',
            'Piano',
        ],
    },
    steps: {
        title: 'Steps',
        defaultValue: 16,
        options: [8, 16, 24, 32, 64],
    },
    root: {
        title: 'Root',
        defaultValue: 'A',
        options: [
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
        ],
    },
}

export const fakeSong = {
    songs: {
        123: {
            'beat-1': {
                'note-1': {
                    chords: 1,
                    melody: 1,
                },
            },
            'beat-2': {},
            'beat-3': {
                'note-8': {
                    melody: 1,
                },
            },
            'beat-4': {},
            'beat-5': {
                'note-5': {
                    melody: 1,
                },
            },
            'beat-6': {
                'note-4': {
                    chords: 1,
                },
            },
            'beat-7': {
                'note-3': {
                    melody: 1,
                },
            },
            'beat-8': {},
            'beat-9': {
                'note-5': {
                    melody: 1,
                },
            },
            'beat-10': {},
            'beat-11': {},
            'beat-12': {
                'note-3': {
                    chords: 1,
                },
            },
            'beat-13': {
                'note-10': {
                    melody: 1,
                },
            },
            'beat-14': {},
            'beat-15': {},
            'beat-16': {},
        },
    },
}
