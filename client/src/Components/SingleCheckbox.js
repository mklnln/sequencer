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
    // console.log(notesToPlay)
    if (
        sendChordPattern?.pattern?.[beatNum - 1] !== undefined &&
        sendChordPattern?.grid === whichGrid
    ) {
        let numBool = checked ? 1 : 0
        if (numBool !== sendChordPattern.pattern[beatNum - 1]) {
            setChecked(sendChordPattern.pattern[beatNum - 1])
        }
        // ! how do i stop this call once we've clearly gone through everything?
        trackAndResetPattern(sendChordPattern, setSendChordPattern)
    }

    // // this is currently resetting the state on all the notes of a row
    // // i want to only set state on the ones that are changed
    // // beatNum <? chordInputStep + 4
    // // e.g. 1,2,3,4 for 1+4 = 5
    // // 1 <, good
    // //
    // // if (sendChordPattern?.pattern && checked === false) {
    // let stateNum = checked ? 1 : 0
    // let patternNum = sendChordPattern?.pattern[beatNum - 1]
    // if (
    //     sendChordPattern?.pattern &&
    //     beatNum < sendChordPattern.chordInputStepCopy + 4
    // ) {
    //     if (stateNum !== patternNum) {
    //         setChecked(patternNum)
    //     }
    //     console.log(beatNum, scaleIndex, 'checked done setted, hereby')
    //     setSendChordPattern(null)
    // }

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
