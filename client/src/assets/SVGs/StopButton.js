import styled from 'styled-components'

const StopButton = () => {
    return (
        <SVG
            viewBox="0 0 40 40"
            height="40"
            width="40"
            style={{ padding: '8px' }}
        >
            {/* // <SVG height="62" viewBox="0 0 80 80" width="96"> */}
            <path d="M0 0h48v48H0z" fill="var(--primary-color)" />
            <path d="M12 12h24v24H12z" fill="var(--primary-color)" />
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
`
