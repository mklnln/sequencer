// send normal props, but also give sendChordPattern if that particular row needs it, according to scaleIndeximport React, { memo, useEffect } from 'react'
import styled from 'styled-components'
import SingleCheckbox from './SingleCheckbox'
import { memo, useEffect } from 'react'
import React from 'react'
const CheckboxRow = memo(
    ({
        countCheckboxRenders,
        scaleIndex,
        whichGrid,
        noteTitle,
        bubbleUpCheckboxInfo,
        blankStepCountArray,
        sendChordPattern,
        setSendChordPattern,
        notesToPlay,
        setNotesToPlay,
    }) => {
        useEffect(() => {
            if (countCheckboxRenders) {
                countCheckboxRenders.current = countCheckboxRenders.current + 1
            }
        })

        return (
            <React.Fragment>
                <TitleAndBoxesDiv>
                    <TitleSpanDiv>
                        <NoteTitle>{noteTitle}</NoteTitle>
                    </TitleSpanDiv>
                    <NoteRowDiv>
                        {blankStepCountArray.map((check, index) => {
                            const beatNum = index + 1
                            const commonProps = {
                                key: `sglchk${whichGrid}-row-${scaleIndex}-beat-${beatNum}`,
                                beatNum,
                                scaleIndex,
                                whichGrid,
                                bubbleUpCheckboxInfo,
                                notesToPlay,
                                setNotesToPlay,
                            }

                            return <SingleCheckbox {...commonProps} />
                        })}
                    </NoteRowDiv>
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
const NoteRowDiv = styled.div`
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
