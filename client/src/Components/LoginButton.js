import { useAuth0 } from '@auth0/auth0-react'

import React from 'react'
import styled from 'styled-components'

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0()
    return isAuthenticated ? (
        <Login onClick={() => logout()}>Sign Out</Login>
    ) : (
        <>
            <Login onClick={() => loginWithRedirect()}>Sign In</Login>
        </>
    )
}

export default LoginButton

const Login = styled.div`
    border: 1px solid var(--lightest-color);
    margin: 10px;
    padding: 5px;
    width: 40%;
    max-width: 100px;
    && {
        text-align: center;
    }
    display: flex;
    justify-content: center;
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        color: black;
    }
`
