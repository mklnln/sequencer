import React, { useState } from 'react'
import styled from 'styled-components'

const BeatMarkers = ({
    blankStepCountArray,
    currentBeatRef,
    beatForAnimation,
}) => {
    console.log(beatForAnimation)
    return (
        <>
            {blankStepCountArray.map((step, index) => {
                const num = index + 1
                // every 2 beats make a div
                if ((index + 1) % 2 === 0) {
                    return (
                        <React.Fragment key={num}>
                            <BeatMarker
                                key={num}
                                className={
                                    beatForAnimation === num ||
                                    beatForAnimation === num + 1 ||
                                    num === beatForAnimation
                                        ? 'current'
                                        : ''
                                }
                            >
                                <BeatSpan
                                    key={num}
                                    className={
                                        beatForAnimation === num ||
                                        beatForAnimation === num + 1 ||
                                        num === beatForAnimation
                                            ? 'current'
                                            : ''
                                    }
                                >
                                    {num / 2}
                                </BeatSpan>
                            </BeatMarker>
                        </React.Fragment>
                    )
                }
            })}
        </>
    )
}

export default BeatMarkers

const BeatMarker = styled.div`
    border-left: 1px solid var(--lightest-color);
    width: 26.5px;
    height: 20px;
    opacity: 100%;
    padding-right: 26.5px;
    display: flex;
    justify-content: center;
    &.current {
        font-size: 1.5em;
    }
`
const BeatSpan = styled.span`
    // padding-left: 9px;
    color: var(--lighter-color);
    opacity: 50%;
`
