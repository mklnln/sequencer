import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG'
import {
    handleNoteClick,
    trackAndResetPattern,
} from '../utilities/FrontEndHelpers'
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
    const [checked, setChecked] = useState(0)
    const handleChange = () => {
        bubbleUpCheckboxInfo(beatNum, scaleIndex, whichGrid)
        // setChecked(!checked)
        console.log('reset checked')
    }

    if (
        notesToPlay[`beat-${beatNum}`][`note-${scaleIndex}`]?.[whichGrid] ===
            1 &&
        checked === 0
    ) {
        console.log('we set it yes we did')
        setChecked(1)
    } else if (
        // ! we dont have
        notesToPlay[`beat-${beatNum}`][`note-${scaleIndex}`]?.[whichGrid] ===
            undefined &&
        checked === 1
    ) {
        console.log('we removed it in fact')
        setChecked(0)
    }

    // if (
    //     sendChordPattern?.pattern?.[beatNum - 1] !== undefined &&
    //     sendChordPattern?.grid === whichGrid
    // ) {
    //     let numBool = checked ? 1 : 0
    //     if (numBool !== sendChordPattern.pattern[beatNum - 1]) {
    //         setChecked(sendChordPattern.pattern[beatNum - 1])
    //     }
    //     // ! how do i stop this call once we've clearly gone through everything?
    //     trackAndResetPattern(sendChordPattern, setSendChordPattern)
    // }

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
