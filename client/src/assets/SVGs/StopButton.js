import styled from 'styled-components'

const StopButton = () => {
    return (
        <SVG viewBox="0 0 50 50" height="40" width="40">
            <path d="M0 0h48v48H0z" fill="var(--primary-color)" />
        </SVG>
    )
}
export default StopButton

const SVG = styled.svg`
    margin: 4px;
    filter: drop-shadow(3px 4px 3px rgba(255, 176, 0, 0.3));
`
