import {useAuth0} from "@auth0/auth0-react"

import React from "react"
import styled from "styled-components"

const LogoutButton = () => {
  const {logout, isAuthenticated} = useAuth0()
  return (
    isAuthenticated && (
      <>
        <Button onClick={() => logout()}>Sign Out</Button>
      </>
    )
  )
}

export default LogoutButton
const Button = styled.button`
  width: 80px;
  height: 50px;
  background-color: white;
  border: 5px solid #b6cfcf;
  border-radius: 10px;
  margin: 0px 10px;
  color: #3d5c5c;
  font-size: 16px;

  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700px;
  :hover {
    cursor: pointer;
  }
`
