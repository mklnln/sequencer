import styled from 'styled-components'

const StopButton = () => {
    return (
        <SVG
            viewBox="0 0 50 50"
            height="40"
            width="40"
            // style={{ padding: '8px' }}
        >
            {/* for the filled shape */}
            <path d="M0 0h48v48H0z" fill="var(--primary-color)" />
            {/* for just the outline vv */}
            {/* <path d="M0 0h48v48H0z" stroke="var(--primary-color)" />  */}
        </SVG>
    )
}
export default StopButton

const SVG = styled.svg`
    // padding: 18px;
    margin: 4px;
    // border: 1px solid fuchsia;
    // :active {
    //     border-top: 3px solid black;
    //     border-left: 3px solid black;
    // }
    filter: drop-shadow(3px 4px 3px rgba(255, 176, 0, 0.3));
`
