import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG'
import { handleCheckbox } from '../Helpers'
const SingleCheckbox = ({
    beatIndex,
    areXBeatsChecked,
    setAreXBeatsChecked,
    scaleIndex,
    whichGrid,
}) => {
    const [checked, setChecked] = useState(
        // used for styling, see bottom :checked class
        areXBeatsChecked[`note-${scaleIndex}`][beatIndex] ? 'checked' : ''
    )

    useEffect(() => {
        setChecked(
            areXBeatsChecked[`note-${scaleIndex}`][beatIndex] ? 'checked' : ''
        )
        // console.log(areXBeatsChecked, beatIndex, scaleIndex, 'usefx')
        // ! holy fuck this is causing a lot of console logs!! worth figurin this the fuck out, goddamn
        // *its caused by there being acouple hundred checkboxes, lol
        // it is indeed necessary. without it, clicking 'reset melodies' keeps the checkboxes highlighted as if they were checked
        // however, these checked boxes are not reflected in areBeatsChecked states
        // todo see if theres a way to make each checked state keep up to date with a global change like reset melodies.
        // ---------> this is a band-aid fix. i could potentially only call this when the global changes happen. // ! usefx only on a global change!
    }, [areXBeatsChecked])

    return (
        <>
            <SVGContainer className={whichGrid}>
                {whichGrid === 'melody' ? (
                    <MelodyCheckboxButton
                        type="checkbox"
                        checked={checked ? 'checked' : ''}
                        onChange={() => {
                            handleCheckbox(
                                scaleIndex,
                                beatIndex,
                                areXBeatsChecked,
                                setAreXBeatsChecked,
                                'melody'
                            )
                            setChecked(!checked)
                        }}
                    />
                ) : (
                    <ChordCheckboxButton
                        type="checkbox"
                        checked={checked ? 'checked' : ''}
                        onChange={() => {
                            handleCheckbox(
                                scaleIndex,
                                beatIndex,
                                areXBeatsChecked,
                                setAreXBeatsChecked,
                                'chords'
                            )
                            setChecked(!checked)
                        }}
                        className={whichGrid}
                    />
                )}
                <CheckboxNoiseSVG />
            </SVGContainer>
        </>
    )
}

export default SingleCheckbox

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
