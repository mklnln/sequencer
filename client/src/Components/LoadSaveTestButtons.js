import { useAuth0 } from '@auth0/auth0-react'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import CustomDropdown from './CustomDropdown'
import { deleteSongFetch, saveSongFetch } from '../utilities/APIfetches'

const LoadSaveTestButtons = ({ notesToPlay, setNotesToPlay }) => {
    const {
        songSavedOrDeleted,
        loadSong,
        loadUserSongs,
        stepCount,
        rootNote,
        tempo,
        wonkFactor,
        sound,
        setSongSavedOrDeleted,
        setLoadUserSongs,
        setLoadSong,
    } = useContext(MusicParametersContext)
    const { user, isAuthenticated } = useAuth0()
    const [songName, setSongName] = useState('')
    const handleSave = (event) => {
        event.preventDefault()
        document.activeElement.blur()

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
            saveObj.userID = user.sub
            saveObj['song'] = {}
            saveObj['song'].songName = songName
            saveObj['song'].notesToPlay = notesToPlay
            saveObj['song'].stepCount = stepCount
            saveObj['song'].rootNote = rootNote
            saveObj['song'].tempo = tempo
            saveObj['song'].wonkFactor = wonkFactor
            saveObj['song'].melodyVolume = melodyVolume
            saveObj['song'].chordsVolume = chordsVolume
            saveObj['song'].sound = sound
            saveObj['song'].filterCutoff = filterCutoff
            saveObj['song'].attack = attack
            saveObj['song'].decay = decay
            saveObj['song'].sustain = sustain
            saveObj['song'].release = release

            console.log(
                saveObj,
                songName,
                stepCount,
                'checking all saving parameters'
            )
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
                <StyledButton
                    onClick={() => {
                        console.log(loadSong, 'loadsong')
                    }}
                >
                    test
                </StyledButton>
            </ColumnDiv>
            <br />
            <>
                {isAuthenticated && (
                    <>
                        <ColumnDiv>
                            <span>Name</span>

                            <form onSubmit={handleSave}>
                                <StyledInput
                                    type="text"
                                    onChange={handleSongName}
                                    value={songName}
                                />
                            </form>

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
                                        setNotesToPlay={setNotesToPlay}
                                        loadUserSongs={loadUserSongs}
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
                            <span>loading...</span>
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
    /* outline: solid 0.2px var(--lightest-color); */
    padding: 4px;
    font-family: 'MS-DOS';
    font-size: 16px;
    outline: none;
    border: 1px solid var(--lightest-color);
    &:focus {
        border: 1px solid var(--primary-color);
    }
`

const StyledButton = styled.button`
    /* font-family: inherit; */
    /* background-color: inherit; */
    /* font-size: inherit; */
    all: inherit;
    border: 1px solid var(--lightest-color);
    margin: 10px;
    padding: 4px 8px;
    // width: 40%;
    max-width: 100px;
    &:focus {
        border: 1px solid var(--primary-color);
    }
    && {
        text-align: center;
        // padding-left: 0px;
    }
    display: flex;
    justify-content: center;
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        span {
            color: black;
        }
    }
`
