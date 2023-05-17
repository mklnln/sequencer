import React, { createContext, StrictMode, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

export const AudioEngineContext = createContext()
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin} // sends back the current address of the app
    >
        <App />
    </Auth0Provider>
)
