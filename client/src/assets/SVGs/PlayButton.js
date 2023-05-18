import styled from 'styled-components'

const PlayButton = () => {
    return (
        <SVG
            version="1.1"
            // x="0"
            // y="0"
            viewBox="0 0 100 100"
            height="64"
            width="64"
        >
            <path
                d="M78.158 51.843L25.842 82.048c-1.418.819-3.191-.205-3.191-1.843v-60.41c0-1.638 1.773-2.661 3.191-1.843l52.317 30.205c1.418.819 1.418 2.867-.001 3.686z"
                fill="var(--primary-color)"
            />
        </SVG>
    )
}
export default PlayButton

const SVG = styled.svg`
    filter: drop-shadow(3px 4px 3px rgba(255, 176, 0, 0.3));
`
