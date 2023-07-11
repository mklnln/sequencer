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
    console.log(currentSong, 'currentsong')
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
            setCurrentSong(songName)
            setSongSavedOrDeleted('saving to database...')
            saveSongFetch(setLoadUserSongs, setSongSavedOrDeleted, saveObj)
            bubbleUpCurrentSongChange(notesToPlay, parameterValuesObj)
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
            <SavedMessageDiv>
                <SavedMessage>
                    {songSavedOrDeleted ? songSavedOrDeleted : ''}
                </SavedMessage>
            </SavedMessageDiv>
            <br />
            <>
                {isAuthenticated && (
                    <>
                        <ColumnDiv>
                            <span>Name</span>

                            <RowDiv>
                                <form onSubmit={handleSave}>
                                    <StyledInput
                                        type="text"
                                        onChange={handleSongName}
                                        value={songName}
                                    />
                                </form>

                                <StyledButton onClick={handleSave}>
                                    <span>SAVE</span>
                                </StyledButton>
                            </RowDiv>
                        </ColumnDiv>

                        {loadUserSongs ? (
                            <LoadingSongsDiv>
                                <RowDiv>
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
                                        defaultValue={
                                            currentSong ? currentSong : '---'
                                        }
                                    />
                                </RowDiv>
                            </LoadingSongsDiv>
                        ) : (
                            <span>loading...</span>
                        )}
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
    margin-bottom: 21px;
`
const SavedMessageDiv = styled.div`
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 18px;
`
const SavedMessage = styled.span`
    /* border: 1px solid var(--primary-color); */
`

const DeleteButton = styled.button`
    margin: 20px;

    background-color: red;
`
const MainDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-bottom: 5px;
`

const RowDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin: 1px 50px;
`

const ColumnDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* height: 50px; */
`
const StyledInput = styled.input`
    margin-left: 5px;
    background: black;
    color: var(--primary-color);
    padding: 4px;
    font-family: 'MS-DOS';
    font-size: 16px;
    outline: none;
    height: 12px;
    border: 1px solid var(--lightest-color);
    &:focus {
        border: 1px solid var(--primary-color);
    }
`

const StyledButton = styled.button`
    all: inherit;
    border: 1px solid var(--lightest-color);
    margin: 0px 10px;
    padding: 0px 8px;
    max-width: 100px;
    height: 20px;
    &:focus {
        border: 1px solid var(--primary-color);
    }
    && {
        text-align: center;
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
