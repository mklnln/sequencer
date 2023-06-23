import React, { useState } from 'react'
import styled from 'styled-components'

const BeatMarkers = ({ blankStepCountArray, currentBeat, whichGrid }) => {
    let countEveryTwoSteps = blankStepCountArray.slice(
        0,
        blankStepCountArray.length / 2
    )
    return (
        <Container>
            <PlaybackHighlight
                className={currentBeat > 0 ? whichGrid : ''}
                style={{ marginLeft: `${(currentBeat - 1) * 20}px` }}
            />
            {countEveryTwoSteps.map((step, index) => {
                const num = index + 1
                // every 2 beats make a div
                return (
                    <React.Fragment key={num}>
                        <BeatMarker>
                            <BeatSpan>{num}</BeatSpan>
                        </BeatMarker>
                    </React.Fragment>
                )
            })}
        </Container>
    )
}

export default BeatMarkers

const Container = styled.div`
    display: flex;
    width: auto;
    padding-left: 20px;
    position: relative;
    justify-content: flex-start;
`

const BeatMarker = styled.div`
    border-left: 1px solid var(--lightest-color);
    height: 20px;
    opacity: 100%;
    display: flex;
    align-items: center;
    padding-right: 18px;
    &.current {
        font-size: 1.5em;
    }
`

const PlaybackHighlight = styled.div`
    width: 19.5px;
    position: absolute;
    background-color: var(--lightest-color);
    opacity: 70%;
    margin-left: -40px;
    border-radius: 10px;
    &.melody {
        height: 300px;
        margin-top: -300px;
    }
    &.chords {
        height: 160px;
        margin-top: -160px;
    }
`
const BeatSpan = styled.span`
    // padding-left: 9px;
    color: var(--lighter-color);
    opacity: 50%;
    width: 21px;
    text-align: center;
`
