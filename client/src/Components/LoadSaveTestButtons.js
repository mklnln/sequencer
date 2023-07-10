import { useAuth0 } from '@auth0/auth0-react'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import CustomDropdown from './CustomDropdown'
import { deleteSongFetch, saveSongFetch } from '../utilities/APIfetches'

const LoadSaveTestButtons = ({
    notesToPlay,
    setNotesToPlay,
    parameterValuesObj,
    bubbleUpCurrentSongChange,
}) => {
    const {
        songSavedOrDeleted,
        currentSong,
        loadUserSongs,
        stepCount,
        setSongSavedOrDeleted,
        setLoadUserSongs,
        setCurrentSong,
    } = useContext(MusicParametersContext)
    const { user, isAuthenticated } = useAuth0()
    const [songName, setSongName] = useState('')
    const handleSave = (event) => {
        event.preventDefault()
        document.activeElement.blur()

        if (songName === '') {
            alert(`You can't save without a song name.`)
        } else {
            // load all relevant parameters into the body for the backend
            const saveObj = {
                userID: user.sub,
                song: {
                    songName: songName,
                    notesToPlay: notesToPlay,
                    parameters: parameterValuesObj,
                },
            }

            setSongSavedOrDeleted('saving to database...')
            saveSongFetch(setLoadUserSongs, setSongSavedOrDeleted, saveObj)
        }
    }

    const handleDelete = () => {
        if (
            currentSong === '75442486-0878-440c-9db1-a7006c25a39f' &&
            user.sub
        ) {
            window.alert(
                'Invalid selection. In order to delete, you must be logged-in and load the song from the dropdown list and then click delete. Making changes after loading will prevent deletion.'
            )
        } else {
            const bodyObj = {}
            bodyObj.songName = currentSong
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
                        console.log(currentSong, 'currentSong')
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
                                        stateValue={currentSong}
                                        stateValueOptions={Object.keys(
                                            loadUserSongs
                                        )}
                                        setState={setCurrentSong}
                                        setNotesToPlay={setNotesToPlay}
                                        loadUserSongs={loadUserSongs}
                                        bubbleUpCurrentSongChange={
                                            bubbleUpCurrentSongChange
                                        }
                                    />
                                    {/* <label>Load Song:</label>
                                        <select
                                            value={currentSong}
                                            onChange={(e) => {
                                                setCurrentSong(e.target.value)
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
                                {currentSong !==
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
