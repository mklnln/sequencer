import {createGlobalStyle} from "styled-components"
const GlobalStyle = createGlobalStyle`
body {
    margin: 10px;
    background-color: #3d5c5c;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
letter-spacing: 0.25em;
display: flex; justify-content: center; align-items: center;
}
.current{
    border-bottom: 5px solid transparent;
}
span.current{
    opacity: 100%;
    color: white;
}
span.octave{
    color: lightgoldenrodyellow;
}
`

export default GlobalStyle
