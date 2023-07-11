import React, { useState } from 'react'
import styled from 'styled-components'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG'
const SingleCheckbox = ({
    beatNum,
    scaleIndex,
    whichGrid,
    bubbleUpCheckboxInfo,
    notesToPlay,
}) => {
    const [checked, setChecked] = useState(0)
    const handleChange = () => {
        bubbleUpCheckboxInfo(beatNum, scaleIndex, whichGrid)
    }

    if (
        notesToPlay[`beat-${beatNum}`][`note-${scaleIndex}`]?.[whichGrid] ===
            1 &&
        checked === 0
    ) {
        setChecked(1)
    } else if (
        notesToPlay[`beat-${beatNum}`][`note-${scaleIndex}`]?.[whichGrid] ===
            undefined &&
        checked === 1
    ) {
        setChecked(0)
    }

    return (
        <SVGContainer
            className={whichGrid}
            key={`svg-note${scaleIndex}-beat-${beatNum}-${whichGrid}`}
        >
            <CheckboxButton
                type="checkbox"
                className={checked ? 'checked' : ''}
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
