import styled from 'styled-components'

const HookTheoryChordButton = ({ chord, handleChordClick, index }) => {
    return (
        <VerticalAlignDiv>
            <ChordButton
                onClick={() => handleChordClick(chord.chord_ID, index)}
            >
                {chord['chord_HTML']}
            </ChordButton>

            <ProbabilityText>
                {(chord.probability * 100).toFixed(1)}%
            </ProbabilityText>
        </VerticalAlignDiv>
    )
}

export default HookTheoryChordButton

const ChordButton = styled.button`
    width: 80px;
    height: 50px;
    font-size: 24px;
    background-color: black;
    border: 4px double var(--lightest-color);
    font-family: 'MS-DOS';
    color: var(--primary-color);
    // max-width: 100px;
    && {
        text-align: center;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
        cursor: pointer;
        background-color: var(--primary-color);
        color: black;
        border: 4px double black;
    }
`

const ProbabilityText = styled.span`
    padding: 10px;
    font-size: 16px;
    color: var(--primary-color);
`

const VerticalAlignDiv = styled.div`
    display: flex;
    width: 100px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
