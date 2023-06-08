import React, { memo, useEffect } from 'react'
import styled from 'styled-components'
import SingleCheckbox from './SingleCheckbox'
const CheckboxRow = memo(
    ({
        makeMelodyNotesState,
        countCheckboxRenders,
        // areXBeatsChecked,
        // setAreXBeatsChecked,
        scaleIndex,
        whichGrid,
        noteTitle,
        bubbleUpCheckboxInfo,
        // notesToPlay,
        // setNotesToPlay,
        blankStepCountArray,
        sendChordPattern,
        setSendChordPattern,
        chordInputStep,
    }) => {
        console.log(sendChordPattern, 'chordpatt', scaleIndex)
        useEffect(() => {
            if (countCheckboxRenders) {
                countCheckboxRenders.current = countCheckboxRenders.current + 1
            }
        })
        let sendCheckPatternArr = []
        if (sendChordPattern) {
            // make array corresponding to the thing
            for (let i = 1; i <= blankStepCountArray.length; i++) {
                // array reflects non-zero indexing
                if (i === chordInputStep) {
                    sendCheckPatternArr.push()
                }
            }
        }
        return (
            <React.Fragment
            // key={`${whichGrid}-chkrow-note-${scaleIndex}-beat-${beatNum}}`}
            >
                <TitleAndBoxesDiv>
                    <TitleSpanDiv>
                        <NoteTitle>{noteTitle}</NoteTitle>
                    </TitleSpanDiv>
                    <ChordDiv>
                        {blankStepCountArray.map((check, index) => {
                            const beatNum = index
                            return (
                                <SingleCheckbox
                                    key={`sglchk${whichGrid}-row-${scaleIndex}-beat-${beatNum}`}
                                    // areXBeatsChecked={areXBeatsChecked}
                                    // setAreXBeatsChecked={setAreXBeatsChecked}
                                    beatNum={beatNum}
                                    scaleIndex={scaleIndex}
                                    whichGrid={whichGrid}
                                    // notesToPlay={notesToPlay}
                                    // setNotesToPlay={setNotesToPlay}
                                    bubbleUpCheckboxInfo={bubbleUpCheckboxInfo}
                                />
                            )
                        })}
                    </ChordDiv>
                </TitleAndBoxesDiv>
            </React.Fragment>
        )
    }
)

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
