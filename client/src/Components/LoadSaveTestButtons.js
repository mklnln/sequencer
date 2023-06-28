import { useAuth0 } from '@auth0/auth0-react'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import CustomDropdown from './CustomDropdown'
import { deleteSongFetch, saveSongFetch } from '../utilities/APIfetches'

const LoadSaveTestButtons = ({ notesToPlay }) => {
    const {
        songSavedOrDeleted,
        loadSong,
        loadUserSongs,
        areChordBeatsChecked,
        stepCount,
        rootNote,
        tempo,
        wonkFactor,
        melodyVolume,
        chordsVolume,
        sound,
        filterCutoff,
        attack,
        decay,
        sustain,
        release,
        setSongSavedOrDeleted,
        setLoadUserSongs,
        setLoadSong,
    } = useContext(MusicParametersContext)

    const { user, isAuthenticated, isLoading, error } = useAuth0()
    const [songName, setSongName] = useState('')

    const handleLoadSongsFetch = (songsAndIDs) => {
        console.log(songsAndIDs, 'fetch')
        const keysToUse = Object.keys(songsAndIDs).filter((key) => {
            return key !== 'userID' && key !== '_id'
        })
        const newState = {}
        keysToUse.forEach((key) => {
            newState[key] = songsAndIDs[key]
        })
        return newState
    }

    const handleSave = () => {
        // const testForInput = []
        // Object.keys(areChordBeatsChecked).forEach((chord) => {
        //     areChordBeatsChecked[chord].map((beat) => {
        //         if (beat === 1) {
        //             testForInput.push(beat)
        //         }
        //     })
        // })
        if (songName === '') {
            alert(`You can't save without a song name.`)
            // } else if (testForInput.length === 0) {
            //     alert(
            //         `You can't save without actually putting some notes in the sequencer.`
            //     )
        } else {
            // load all relevant parameters into the body for the backend
            const saveObj = {}
            saveObj[songName] = {}
            saveObj[songName].notesToPlay = notesToPlay
            saveObj.userID = user.sub
            saveObj[songName].stepCount = stepCount
            saveObj[songName].rootNote = rootNote
            saveObj[songName].tempo = tempo
            saveObj[songName].wonkFactor = wonkFactor
            saveObj[songName].melodyVolume = melodyVolume
            saveObj[songName].chordsVolume = chordsVolume
            saveObj[songName].sound = sound
            saveObj[songName].filterCutoff = filterCutoff
            saveObj[songName].attack = attack
            saveObj[songName].decay = decay
            saveObj[songName].sustain = sustain
            saveObj[songName].release = release

            console.log(saveObj, songName, stepCount)
            setSongSavedOrDeleted('saving to database...')
            saveSongFetch(setLoadUserSongs, setSongSavedOrDeleted, saveObj)
        }
    }
    const handleDelete = () => {
        if (loadSong === '75442486-0878-440c-9db1-a7006c25a39f' && user.sub) {
            window.alert(
                'Invalid selection. In order to delete, you must be logged-in and load the song from the dropdown list and then click delete. Making changes after loading will prevent deletion.'
            )
        } else {
            const bodyObj = {}
            bodyObj.songName = loadSong
            bodyObj.userID = user.sub
            deleteSongFetch(setSongSavedOrDeleted, setLoadUserSongs, bodyObj)
        }
    }

    const handleSongName = (e) => {
        setSongName(e.target.value)
    }
    return (
        <MainDiv>
            <ColumnDiv>
                {/* <StyledButton
                    onClick={() => {
                        console.log(sound)
                    }}
                >
                    test
                </StyledButton> */}
            </ColumnDiv>
            <br />
            {loadUserSongs ? (
                <>
                    {isAuthenticated && (
                        <>
                            <ColumnDiv>
                                <span>Name</span>
                                <StyledInput
                                    type="text"
                                    onChange={handleSongName}
                                    value={songName}
                                />

                                <StyledButton onClick={handleSave}>
                                    <span>Save</span>
                                </StyledButton>
                            </ColumnDiv>

                            <span>
                                {songSavedOrDeleted ? songSavedOrDeleted : ''}
                            </span>
                            {loadUserSongs ? (
                                <LoadingSongsDiv>
                                    <ColumnDiv>
                                        <CustomDropdown
                                            title="Load Song"
                                            stateValue={loadSong}
                                            stateValueOptions={Object.keys(
                                                loadUserSongs
                                            )}
                                            setState={setLoadSong}
                                        />
                                        {/* <label>Load Song:</label>
                                        <select
                                            value={loadSong}
                                            onChange={(e) => {
                                                setLoadSong(e.target.value)
                                            }}
                                        >
                                            <option default hidden>
                                                Choose a song...
                                            </option>
                                            {Object.keys(loadUserSongs).map(
                                                (song, index) => {
                                                    return (
                                                        <>
                                                            <option
                                                                key={song}
                                                                value={song}
                                                            >
                                                                {song}
                                                            </option>
                                                        </>
                                                    )
                                                }
                                            )}
                                        </select> */}
                                    </ColumnDiv>
                                </LoadingSongsDiv>
                            ) : (
                                <span>loading songs...</span>
                            )}
                            {/* <ColumnDiv>
                                {loadSong !==
                                    '75442486-0878-440c-9db1-a7006c25a39f' && (
                                    <DeleteButton
                                        onClick={() => handleDelete()}
                                    >
                                        delete currently loaded song
                                    </DeleteButton>
                                )}
                            </ColumnDiv> */}
                        </>
                    )}
                </>
            ) : (
                <span>log in to see your saved songs</span>
            )}
        </MainDiv>
    )
}

export default LoadSaveTestButtons
const LoadingSongsDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const DeleteButton = styled.button`
    margin: 20px;

    background-color: red;
`
const MainDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    border: 1px solid fuchsia;
`

const ColumnDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin: 0px 20px;
`

const StyledInput = styled.input`
    margin-left: 5px;
    background: black;
    color: var(--primary-color);
    outline: solid 0.2px var(--lightest-color);
    padding: 4px;
    font-family: 'MS-DOS';
    font-size: 16px;
    border: none;
`

const StyledButton = styled.div`
    border: 1px solid var(--lightest-color);
    margin: 10px;
    padding: 4px 8px;
    // width: 40%;
    max-width: 100px;
    && {
        text-align: center;
        // padding-left: 0px;
    }
    display: flex;
    justify-content: center;
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        color: black;
    }
`
