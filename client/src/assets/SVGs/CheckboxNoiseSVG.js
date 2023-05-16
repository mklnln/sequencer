import styled from 'styled-components'

const CheckboxNoiseSVG = () => {
    return (
        <NoiseStyle
            width="100%"
            height="100%"
            viewBox="-10 2 20 10"
            xmlns="http://www.w3.org/2000/svg"
            // style={{ fill: 'rgb(255, 0, 255)' }}
            // fill="rgb(255, 0, 255)"
            // transform="rotate(45)"
        >
            <defs>
                <pattern
                    id="noise-pattern"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                >
                    <rect
                        x="0"
                        y="0"
                        width="2"
                        height="2"
                        // fill="rgba(255,22,81,0.25)"
                        // fill="rgb(255, 0, 255)"
                    />
                    <rect
                        x="2"
                        y="2"
                        width="2"
                        height="2"
                        // style={{ fill: 'rgb(255, 0, 255)' }}
                        // fill="rgb(255, 0, 255)"
                        // fill="rgba(255,2,81,0.25)"
                    />
                    {/* <rect
                        x="2"
                        y="0"
                        width="2"
                        height="2"
                        fill="rgba(255,31,42,0.8)"
                    />
                    <rect
                        x="0"
                        y="2"
                        width="2"
                        height="2"
                        fill="rgba(255,31,42,0.8)"
                    /> */}
                </pattern>
            </defs>

            <rect
                x="-6"
                y="-6"
                width="20"
                height="20"
                fill="url(#noise-pattern)"
                transform="rotate(45)"
            />
        </NoiseStyle>
    )
}

// CSS can be finnicky eh
const NoiseStyle = styled.svg`
    // rect {
    //     fill: inherit;
    // }
    z-index: -5;
    // overflow: hidden;
    position: absolute;
    left: 0%;
    // top: 20%;
    height: 100%;
    width: 100%;
    // fill: gray !important;
    // color: fuchsia;

    // border: 1px solid fuchsia;
    // background-color: yellow;
`
export default CheckboxNoiseSVG
