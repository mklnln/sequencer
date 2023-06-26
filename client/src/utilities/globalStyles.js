import { createGlobalStyle } from 'styled-components'
import NouveauIBM from '../assets/fonts/Nouveau_IBM.ttf'

const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: 'MS-DOS';
    src: url(${NouveauIBM}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

head {
    
}

body {
    // If a primaryColor prop is provided, it will be used as the value of --primary-color. 
    // If no primaryColor prop is provided, the default value of #0077FF will be used.

    --primary-color: ${(props) => props.primaryColor || 'rgb(255,176,0)'};
    --lighter-color: rgb(255,231,81);
    --lightest-color: rgba(255,231,81,0.25);
    margin: 10px;
    background-color: #000000;
    color: var(--primary-color);
    // font-family: 'IBM Plex Mono', monospace;
    font-family: 'MS-DOS';
    font-weight: 400;
    letter-spacing: 0.125em;
    display: flex; justify-content: center; align-items: center;
}

span {
    color: var(--primary-color);
    user-select: none;
    letter-spacing: 0.00em;
}
option {
    :hover{
        background-color: fuchsia;
    }
}
`

export default GlobalStyle
