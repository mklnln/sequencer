const handleLoadSongsFetch = (songsAndIDs) => {
    console.log(
        songsAndIDs,
        `songsandIDs sent to handleLoadSongsFetch from the loadUserSongs fetch in Header.js`
    )
    const keysToUse = Object.keys(songsAndIDs).filter((key) => {
        return key !== 'userID' && key !== '_id'
    })
    const newState = {}
    keysToUse.forEach((key) => {
        newState[key] = songsAndIDs[key]
    })
    console.log(
        'handle load songs fetch has run. are we calling it unnecessarily?'
    )
    return newState
}

export const getHookTheoryBearerToken = async (hookTheoryChords) => {
    if (hookTheoryChords.length === 0) {
        fetch('https://api.hooktheory.com/v1/users/auth', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${process.env.REACT_APP_HOOK_THEORY_BEARER}`,
            },
            body: JSON.stringify({
                username: `${process.env.REACT_APP_HOOK_THEORY_USER}`,
                password: `${process.env.REACT_APP_HOOK_THEORY_PASS}`,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, 'app')
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

export const loadUserSongsFetch = async (sub, setLoadUserSongs) => {
    return await fetch(`/api/load-songs/${sub}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setLoadUserSongs(handleLoadSongsFetch(data.data))
        })
        .catch((err) => console.log(err))
}

export const saveSongFetch = async (
    setLoadUserSongs,
    setSongSavedOrDeleted,
    saveObj
) => {
    // fetch(`${process.env.REACT_APP_API_URL}/api/save-song`, {
    fetch(`/api/save-song`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...saveObj }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200) {
                setSongSavedOrDeleted('Song saved!')
                console.log(data, 'song POST')
                setLoadUserSongs(handleLoadSongsFetch(data.data))

                setTimeout(() => {
                    setSongSavedOrDeleted(false)
                }, 5000)
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

export const deleteSongFetch = async (
    setSongSavedOrDeleted,
    setLoadUserSongs,
    bodyObj
) => {
    // fetch(`${process.env.REACT_APP_API_URL}/api/delete-song/`, {
    fetch(`/api/delete-song/`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bodyObj }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200) {
                console.log(data)
                setSongSavedOrDeleted('Song deleted!')
                setLoadUserSongs(handleLoadSongsFetch(data.data))

                setTimeout(() => {
                    setSongSavedOrDeleted(false)
                }, 5000)
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

export const getAPIChordsFetch = async (
    setHookTheoryChords,
    chosenAPIChords
) => {
    if (chosenAPIChords.length === 0) {
        fetch('https://api.hooktheory.com/v1/trends/nodes', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_HOOK_THEORY_BEARER}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setHookTheoryChords(data.slice(0, 4)) // slice takes only the first 4 array items
            })
            .catch((error) => {
                console.log(error)
            })
    } else if (chosenAPIChords.length > 0) {
        fetch(
            `https://api.hooktheory.com/v1/trends/nodes?cp=${chosenAPIChords.toString()}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.REACT_APP_HOOK_THEORY_BEARER}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                // i only take chords from the api that match those i've put in the sequencer
                const removeUnsupportedChords = data.filter((chord) => {
                    return chord['chord_ID'].length <= 1
                })
                console.log(removeUnsupportedChords)
                setHookTheoryChords(removeUnsupportedChords.slice(0, 4)) // slice takes only the first 4 array items
            })
            .catch((error) => {
                console.log(error)
            })
    }
}
