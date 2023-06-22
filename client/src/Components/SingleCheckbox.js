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
            {whichGrid === 'melody' ? (
                <MelodyCheckboxButton
                    type="checkbox"
                    checked={checked ? 'checked' : ''}
                    onChange={handleChange}
                />
            ) : (
                <ChordCheckboxButton
                    type="checkbox"
                    checked={checked ? 'checked' : ''}
                    onChange={handleChange}
                    className={whichGrid}
                />
            )}
            <CheckboxNoiseSVG />
        </SVGContainer>
    )
}

export default React.memo(SingleCheckbox)

const MelodyCheckboxButton = styled.input`
    position: absolute;
    z-index: 1;
    border: none;
    // background-color: var(--lighter-color);
    width: 4px;
    opacity: 0%;
    height: 10px;
    width: 20px;
    // padding: 5px 10px;
    appearance: none;
    margin: 0px;

    :hover {
        cursor: pointer;
        border: none;
        background-color: var(--lighter-color);
        width: 4px;
        opacity: 50%;
        height: 4px;
        padding: 5px 10px;
        border-radius: 4px;
    }
    :checked {
        border: none;
        background-color: var(--lighter-color);
        width: 4px;
        opacity: 80%;
        height: 4px;
        padding: 5px 10px;
        border-radius: 10px;
    }
    :checked && :hover {
        background-color: white;
    }
`

const ChordCheckboxButton = styled.input`
    border: none;
    background-color: var(--lighter-color);
    width: 20px;
    opacity: 25%;
    height: 20px;
    appearance: none;
    &.chords {
        height: 20px;
        // border: 32px solid fuchsia;
    }
    :hover {
        cursor: pointer;

        // border: 5px solid #eaeae1;
        background-color: var(--lighter-color);
        opacity: 50%;
        // background-color: #eaeae1;
        // opacity: 25%;
        padding: 5px;
        border-radius: 5px;
    }
    :checked {
        background-color: var(--lighter-color);
        border-radius: 10px;
        // border: 5px solid #eaeae1;
        opacity: 80%;
        padding: 5px;
    }
    :checked && :hover {
        background-color: white;
    }
`

const SVGContainer = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    // border: 1px solid fuchsia;
    margin: 0px 3.5px;
    // background-color: var(--lighter-color);
    overflow: hidden;
    // ! might be useful to change the containing div height/width, no idea what im doin tho
    height: 10px;
    width: 20px;
    &.chords {
        height: 20px;
    }
`
