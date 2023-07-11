import React from 'react'
import styled from 'styled-components'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG'
const SingleCheckbox = ({
    beatNum,
    scaleIndex,
    whichGrid,
    bubbleUpCheckboxInfo,
    notesToPlay,
}) => {
    const handleChange = () => {
        bubbleUpCheckboxInfo(beatNum, scaleIndex, whichGrid)
    }

    return (
        <SVGContainer
            className={whichGrid}
            key={`svg-note${scaleIndex}-beat-${beatNum}-${whichGrid}`}
        >
            <CheckboxButton
                type="checkbox"
                className={
                    notesToPlay[`beat-${beatNum}`][`note-${scaleIndex}`]?.[
                        whichGrid
                    ] === 1
                        ? 'checked'
                        : ''
                }
                onClick={handleChange}
            />
            <CheckboxNoiseSVG />
        </SVGContainer>
    )
}

export default React.memo(SingleCheckbox)

const CheckboxButton = styled.div`
    height: 20px;
    width: 20px;
    appearance: none;
    margin: 0px;

    &.checked {
        background-color: var(--primary-color);
        opacity: 45%;
        border-radius: 10px;
    }
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        opacity: 20%;
        border-radius: 10px;
    }
    &.checked:hover {
        background-color: white;
        opacity: 60%;
    }
`

const SVGContainer = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
`
