import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
const MelodyCheckbox = ({
    handleMelodyBeatCheckbox,
    beatIndex,
    areMelodyBeatsChecked,
    scaleIndex,
}) => {
    const [checked, setChecked] = useState(
        areMelodyBeatsChecked[`note-${scaleIndex}`][beatIndex] ? 'checked' : ''
    )

    useEffect(() => {
        setChecked(
            areMelodyBeatsChecked[`note-${scaleIndex}`][beatIndex]
                ? 'checked'
                : ''
        )
    }, [areMelodyBeatsChecked])

    return (
        <>
            <CheckboxButton
                type="checkbox"
                checked={checked ? 'checked' : ''}
                onChange={() => {
                    handleMelodyBeatCheckbox(scaleIndex, beatIndex, checked)
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
