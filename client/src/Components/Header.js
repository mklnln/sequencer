import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import LoginButton from './LoginButton'
import { useAuth0 } from '@auth0/auth0-react'
import { MusicParametersContext } from '../App'
import { loadUserSongsFetch } from '../utilities/APIfetches'

const Header = () => {
    const { user, isAuthenticated, isLoading, error } = useAuth0()
    const { loadUserSongs, setLoadUserSongs, songSaved, handleLoadSongsFetch } =
        useContext(MusicParametersContext)

    if (user && !loadUserSongs) {
        loadUserSongsFetch(user.sub, setLoadUserSongs)
        console.log('we call da fetch boy')
    }

  

    async function fetchArrow() {
        loadUserSongsFetch(user.sub, setLoadUserSongs)
        console.log('we call da fetch boy')
        // return await fetch(
        //     // `${process.env.REACT_APP_API_URL}/api/load-songs/${user.sub}`
        //     `/api/load-songs/${user.sub}`
        // )
        //     .then((resp) => {
        //         if (!resp.ok) {
        //             throw `Server error: [${resp.status}] [${resp.statusText}] [${resp.url}]`
        //         }
        //         console.log(resp, 'response from fetch')
        //         return resp.json()
        //     })
        //     .then((data) => {
        //         // your code with json here...
        //         console.log(data)
        //         setLoadUserSongs(handleLoadSongsFetch(data.data))
        //     })
        //     .catch((err) => {
        //         console.debug('Error in fetch', err)
        //         // setErrors(err)
        //     })
    }

    return (
        <Banner>
            <TitleDiv>
                <h1>Sequencer</h1>
                <ShadowH1>Sequencer</ShadowH1>
            </TitleDiv>
            {/* <button
                onClick={() => {
                    console.log(user)
                }}
            >
                check user
            </button> */}
            <div onClick={fetchArrow}>fetch test</div>
            {error && <span>Error authenticating.. try again.</span>}
            {!error && isLoading && <span>Loading...</span>}
            {!error && !isLoading && (
                <>
                    <>
                        {isAuthenticated && (
                            <UserInfoDiv>
                                {user.picture && !isLoading && (
                                    <ProfilePic
                                        src={user.picture}
                                        alt={user?.name}
                                    />
                                )}
                                <span>{user?.given_name}</span>
                            </UserInfoDiv>
                        )}
                    </>
                    <LoginButton />
                </>
            )}
        </Banner>
    )
}

export default Header

const TitleDiv = styled.div`
    position: relative;
    padding: 0px 15px;
`
const ShadowH1 = styled.h1`
    position: absolute;
    // border: 1px solid fuchsia;
    top: 6.5%;
    left: 9%;
    opacity: 45%;
`

const Banner = styled.div`
    display: flex;
    width: 95vw;
    align-items: center;
    justify-content: center;
    /* padding-bottom: 15px; */
    margin: 5px;
    border: 6px double var(--lightest-color);
`
const ProfilePic = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin: 10px;
`
const UserInfoDiv = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
`
