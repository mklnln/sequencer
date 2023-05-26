import React from 'react'
import styled from 'styled-components'

const BeatMarkers = ({ blankStepCountArray, currentBeat, currentBeatRef }) => {
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
                                    currentBeat === num ||
                                    currentBeat === num + 1 ||
                                    num === currentBeatRef.current
                                        ? 'current'
                                        : ''
                                }
                            >
                                <BeatSpan
                                    key={num}
                                    className={
                                        currentBeat === num ||
                                        currentBeat === num + 1 ||
                                        num === currentBeatRef.current
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
`
const BeatSpan = styled.span`
    // padding-left: 9px;
    color: var(--lighter-color);
    opacity: 50%;
`
