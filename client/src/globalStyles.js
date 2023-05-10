import { createGlobalStyle } from 'styled-components'
const GlobalStyle = createGlobalStyle`
body {
    margin: 10px;
    background-color: #3d5c5c;
    color: white;
    // font-family: Arial, Helvetica, sans-serif;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 400;
letter-spacing: 0.25em;
display: flex; justify-content: center; align-items: center;
}

span {
    user-select: none;
}
`

export default GlobalStyle
