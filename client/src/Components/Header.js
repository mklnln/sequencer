import React, {useContext, useEffect} from "react"
import styled from "styled-components"
import Profile from "./Profile"
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"
import {useAuth0} from "@auth0/auth0-react"
import {MusicParametersContext} from "../App"
const Header = () => {
  const {user, isAuthenticated, isLoading, error} = useAuth0()
  const {loadUserSongs, setLoadUserSongs, handleLoadSongsFetch, songSaved} =
    useContext(MusicParametersContext)
  useEffect(() => {
    if (user || songSaved === "Song saved!") {
      console.log(user.sub)
      fetch(`/api/user-login/${user.sub}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "loading user and songs")
          setLoadUserSongs(handleLoadSongsFetch(data.data))
        })
    }
  }, [user])

  // todo since this will gives us back the entire document, simply saving the songs in an array of objects [{[0,0],[0,0]etc}, {[0,0],[0,0]etc}] where the key to a given object can be the nameof the song, we can show the keys and click them to load them into the sequencer, changing state on the affected variables. we may need to make an object inside like 'parameters' so that it's obvious what to set states to

  return (
    <Banner>
      <h2>Sequencer</h2>
      {error && <span>Error authenticating.. try again.</span>}
      {!error && isLoading && <span>Loading...</span>}
      {!error && !isLoading && (
        <>
          <>
            {isAuthenticated && (
              <UserInfoDiv
              // todo onClick to profile page where we show all saved songs
              >
                {user.picture && (
                  <ProfilePic src={user.picture} alt={user?.name} />
                )}
                <span>{user?.given_name}</span>
              </UserInfoDiv>
            )}
          </>
          <LoginButton />
          <LogoutButton />
        </>
      )}
    </Banner>
  )
}

export default Header

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid fuchsia;
`
const ProfilePic = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  margin: 10px;
`
const UserInfoDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: right;
  align-items: center;
`
