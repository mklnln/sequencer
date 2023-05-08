import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
const MelodyCheckbox = ({
    handleCheckbox,
    beatIndex,
    areMelodyBeatsChecked,
    scaleIndex,
}) => {
    const [checked, setChecked] = useState(
        // used for styling, see bottom :checked class
        areMelodyBeatsChecked[`note-${scaleIndex}`][beatIndex] ? 'checked' : ''
    )

    useEffect(() => {
        setChecked(
            areMelodyBeatsChecked[`note-${scaleIndex}`][beatIndex]
                ? 'checked'
                : ''
        )
        // console.log(areMelodyBeatsChecked, beatIndex, scaleIndex, 'usefx')
        // ! holy fuck this is causing a lot of console logs!! worth figurin this the fuck out, goddamn
        // *its caused by there being acouple hundred checkboxes, lol
        // it is indeed necessary. without it, clicking 'reset melodies' keeps the checkboxes highlighted as if they were checked
        // however, these checked boxes are not reflected in areBeatsChecked states
        // todo see if theres a way to make each checked state keep up to date with a global change like reset melodies.
        // ---------> this is a band-aid fix. i could potentially only call this when the global changes happen. // ! usefx only on a global change!
    }, [areMelodyBeatsChecked])

    return (
        <>
            <CheckboxButton
                type="checkbox"
                checked={checked ? 'checked' : ''}
                onChange={() => {
                    handleCheckbox(scaleIndex, beatIndex, 'Melody')
                    setChecked(!checked)
                }}
            />
        </>
    )
}

export default MelodyCheckbox

const CheckboxButton = styled.input`
    border: none;
    background-color: gray;
    width: 4px;
    opacity: 25%;
    height: 4px;
    padding: 5px 10px;
    appearance: none;

    :hover {
        cursor: pointer;
        border: none;
        background-color: #eaeae1;
        width: 4px;
        opacity: 25%;
        height: 4px;
        padding: 5px 10px;
        border-radius: 4px;
    }
    :checked {
        border: none;
        background-color: #eaeae1;
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
