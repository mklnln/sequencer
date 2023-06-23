import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG'
import { handleNoteClick, trackAndResetPattern } from '../FrontEndHelpers'
const SingleCheckbox = ({
    beatNum,
    // areXBeatsChecked,
    // setAreXBeatsChecked,
    scaleIndex,
    whichGrid,
    bubbleUpCheckboxInfo,
    notesToPlay,
    setNotesToPlay,
    sendChordPattern,
    setSendChordPattern,
}) => {
    const [checked, setChecked] = useState(false)
    const handleChange = () => {
        bubbleUpCheckboxInfo(beatNum, scaleIndex, whichGrid)
        setChecked(!checked)
    }

    return (
        <SVGContainer
            className={whichGrid}
            key={`svg-note${scaleIndex}-beat-${beatNum}-${whichGrid}`}
        >
            <CheckboxButton
                type="checkbox"
                checked={checked ? 'checked' : ''}
                onChange={handleChange}
            />
            <CheckboxNoiseSVG />
        </SVGContainer>
    )
}

export default React.memo(SingleCheckbox)

const CheckboxButton = styled.input`
    height: 20px;
    width: 20px;
    appearance: none;
    margin: 0px;

    :checked {
        background-color: var(--primary-color);
        opacity: 60%;
        border-radius: 10px;
    }
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        opacity: 30%;
        border-radius: 10px;
    }
    :checked:hover {
        background-color: white;
        opacity: 60%;
    }
    :focus {
    }
`

const SVGContainer = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    // margin: 0px 3.5px;
    &.chords {
        height: 20px;
    }
`
