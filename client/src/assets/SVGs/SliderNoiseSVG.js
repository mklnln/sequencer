import styled from 'styled-components'

const NoiseSVG = () => {
    return (
        <NoiseStyle
            // width="100"
            // height="100"
            viewBox="0 0 10 8"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="noise-pattern"
                    width="4"
                    height="4"
                    patternUnits="userSpaceOnUse"
                >
                    <rect
                        x="0"
                        y="0"
                        width="2"
                        height="2"
                        fill="rgba(255,231,81,0.25)"
                    />
                    <rect
                        x="2"
                        y="2"
                        width="2"
                        height="2"
                        fill="rgba(255,231,81,0.25)"
                    />
                </pattern>
            </defs>

            <rect
                x="0"
                y="0"
                width="120"
                height="120"
                fill="url(#noise-pattern)"
            />
        </NoiseStyle>
    )
}

// CSS can be finnicky eh
const NoiseStyle = styled.svg`
    // z-index: -5;
    // overflow: hidden;
    position: absolute;
    left: 25%;
    top: -58%;
    height: 110px;
    width: 50%;
`
export default NoiseSVG
