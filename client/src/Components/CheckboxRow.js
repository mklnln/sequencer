import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG'
import MelodyCheckbox from './SingleCheckbox'
import SingleCheckbox from './SingleCheckbox'
const CheckboxRow = ({
    countCheckboxRenders,
    areXBeatsChecked,
    setAreXBeatsChecked,
    scaleIndex,
    whichGrid,
    noteTitle,
    notesToPlay,
    setNotesToPlay,
}) => {
    // todo dynamically bring in makeXstate and areXbeats
    // const [checked, setChecked] = useState(
    //     // used for styling, see bottom :checked class
    //     areXBeatsChecked[`note-${scaleIndex}`][beatIndex] ? 'checked' : ''
    // )
    // useEffect(() => {
    //     setChecked(
    //         areXBeatsChecked[`note-${scaleIndex}`][beatIndex] ? 'checked' : ''
    //     )
    //     // console.log(areXBeatsChecked, beatIndex, scaleIndex, 'usefx')
    //     // ! holy fuck this is causing a lot of console logs!! worth figurin this the fuck out, goddamn
    //     // *its caused by there being acouple hundred checkboxes, lol
    //     // it is indeed necessary. without it, clicking 'reset melodies' keeps the checkboxes highlighted as if they were checked
    //     // however, these checked boxes are not reflected in areBeatsChecked states
    //     // todo see if theres a way to make each checked state keep up to date with a global change like reset melodies.
    //     // ---------> this is a band-aid fix. i could potentially only call this when the global changes happen. // ! usefx only on a global change!
    // }, [areXBeatsChecked])

    useEffect(() => {
        if (countCheckboxRenders) {
            countCheckboxRenders.current = countCheckboxRenders.current + 1
        }
    })
    return (
        <React.Fragment
        // key={`${whichGrid}-chkrow-note-${scaleIndex}-beat-${beatIndex}}`}
        >
            <TitleAndBoxesDiv>
                <TitleSpanDiv>
                    <NoteTitle>{noteTitle}</NoteTitle>
                </TitleSpanDiv>
                <ChordDiv>
                    {areXBeatsChecked[`note-${scaleIndex}`].map(
                        (check, index) => {
                            const beatIndex = index + 1
                            return (
                                <SingleCheckbox
                                    key={`sglchk${whichGrid}-row-${scaleIndex}-beat-${beatIndex}`}
                                    areXBeatsChecked={areXBeatsChecked}
                                    setAreXBeatsChecked={setAreXBeatsChecked}
                                    beatIndex={beatIndex}
                                    scaleIndex={scaleIndex}
                                    whichGrid={whichGrid}
                                    notesToPlay={notesToPlay}
                                    setNotesToPlay={setNotesToPlay}
                                />
                            )
                        }
                    )}
                </ChordDiv>
            </TitleAndBoxesDiv>
        </React.Fragment>
    )
}

export default CheckboxRow
const TitleAndBoxesDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const TitleSpanDiv = styled.div`
    width: 20px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
`
const ChordDiv = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    height: 20px;
`
const NoteTitle = styled.span`
    text-align: left;
    font-size: 17.65px;
    margin: none;
    display: inline-block;
    opacity: 75%;
    padding-right: 8px;
`
