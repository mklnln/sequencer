// send normal props, but also give sendChordPattern if that particular row needs it, according to scaleIndeximport React, { memo, useEffect } from 'react'
import styled from 'styled-components'
import SingleCheckbox from './SingleCheckbox'
import { memo, useEffect } from 'react'
import React from 'react'
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
        useEffect(() => {
            if (countCheckboxRenders) {
                countCheckboxRenders.current = countCheckboxRenders.current + 1
            }
        })

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
                            const beatNum = index + 1
                            const commonProps = {
                                key: `sglchk${whichGrid}-row-${scaleIndex}-beat-${beatNum}`,
                                beatNum,
                                scaleIndex,
                                whichGrid,
                                bubbleUpCheckboxInfo,
                            }
                            // ? why not invert the crazy thing and just say
                            // ? if

                            if (sendChordPattern) {
                                console.log(
                                    sendChordPattern,
                                    'chordo',
                                    noteTitle
                                )
                                if (
                                    beatNum <
                                        sendChordPattern.chordInputStepCopy ||
                                    beatNum >=
                                        sendChordPattern.chordInputStepCopy +
                                            sendChordPattern.pattern.length
                                ) {
                                    // beatNum = changing index of map fxn, 1-16
                                    // if beatNum is less than 1 OR
                                    // beatNum greater than or equal to (inputStep (1) +4 i.e. 5)

                                    return <SingleCheckbox {...commonProps} />
                                } else {
                                    console.log(
                                        beatNum,
                                        sendChordPattern.chordInputStepCopy +
                                            sendChordPattern.pattern.length,
                                        'this is the LOG THAT CHANGES PROPS'
                                    )
                                    return (
                                        <SingleCheckbox
                                            {...commonProps}
                                            {...{
                                                sendChordPattern,
                                                setSendChordPattern,
                                                chordInputStep,
                                            }}
                                        />
                                    )
                                }
                            } else {
                                return <SingleCheckbox {...commonProps} />
                            }
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
