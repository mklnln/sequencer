import React, {useContext, useEffect} from "react"
import styled from "styled-components"
import Profile from "./Profile"
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"
import {useAuth0} from "@auth0/auth0-react"
import {MusicParametersContext} from "../App"
import {handleLoadSongsFetch} from "../Helpers"
import LoadSaveTestButtons from "./LoadSaveTestButtons"
const Header = () => {
  const {user, isAuthenticated, isLoading, error} = useAuth0()
  const {setLoadUserSongs, songSaved, handleLoadSongsFetch} = useContext(
    MusicParametersContext
  )
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

  return (
    <Banner>
      <h2>Sequencer</h2>
      <button
        onClick={() => {
          console.log(user)
        }}
      >
        check user
      </button>
      <LoadSaveTestButtons />
      {error && <span>Error authenticating.. try again.</span>}
      {!error && isLoading && <span>Loading...</span>}
      {!error && !isLoading && (
        <>
          <>
            {isAuthenticated && (
              <UserInfoDiv
              // todo onClick to profile page where we show all saved songs
              >
                {user.picture && !isLoading && (
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
  width: 97vw;
  /* justify-content: space-between; */
  align-items: center;
  margin: 15px 0px;
  padding-bottom: 15px;
  border-bottom: 3px solid lightgray;
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
const ColumnDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
