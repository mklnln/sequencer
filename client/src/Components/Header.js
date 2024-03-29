import React, { useContext } from 'react'
import styled from 'styled-components'
import LoginButton from './LoginButton'
import { useAuth0 } from '@auth0/auth0-react'
import { MusicParametersContext } from '../App'
import { loadUserSongsFetch } from '../utilities/APIfetches'
import { fakeSong } from '../utilities/BigObjectsAndArrays'

const Header = () => {
    const { user, isAuthenticated, isLoading, error } = useAuth0()
    const { loadUserSongs, setLoadUserSongs } = useContext(
        MusicParametersContext
    )

    if (user && !loadUserSongs) {
        loadUserSongsFetch(user.sub, setLoadUserSongs)
        console.log('we call da fetch boy')
        console.log(loadUserSongs, 'user songs')
    }
    const loadFakeSongs = () => {
        setLoadUserSongs(fakeSong.songs)
    }
    const fetchArrow = () => {
        loadUserSongsFetch(user.sub, setLoadUserSongs)
    }

    return (
        <Banner>
            <TitleDiv>
                <h1>Sequencer</h1>
                <ShadowH1>Sequencer</ShadowH1>
            </TitleDiv>

            <div onClick={fetchArrow}>fetch test</div>
            <div onClick={loadFakeSongs}>load fake songs</div>
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
    top: 6.5%;
    left: 9%;
    opacity: 45%;
`

const Banner = styled.div`
    display: flex;
    width: 95vw;
    align-items: center;
    justify-content: center;
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
