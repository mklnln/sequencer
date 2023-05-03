import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MusicParametersContext } from '../App'
const Checkbox = ({
    handleCheckbox,
    beatIndex,
    areChordBeatsChecked,
    chordIndex,
}) => {
    const [checked, setChecked] = useState(
        areChordBeatsChecked[`note-${chordIndex}`][beatIndex] ? 'checked' : ''
    )

    useEffect(() => {
        setChecked(
            areChordBeatsChecked[`note-${chordIndex}`][beatIndex]
                ? 'checked'
                : ''
        )
    }, [areChordBeatsChecked])

    return (
        <>
            <CheckboxButton
                type="checkbox"
                checked={checked ? 'checked' : ''}
                onChange={() => {
                    handleCheckbox(chordIndex, beatIndex, checked, 'Chords')
                    setChecked(!checked)
                }}
            />
        </>
    )
}

export default Checkbox

const CheckboxButton = styled.input`
    border: none;
    background-color: gray;
    width: 20px;
    opacity: 25%;
    height: 20px;
    appearance: none;

    :hover {
        cursor: pointer;
        background-color: #eaeae1;
        border: 5px solid #eaeae1;
        opacity: 25%;
        padding: 5px;
        border-radius: 5px;
    }
    :checked {
        background-color: #eaeae1;
        border-radius: 10px;
        border: 5px solid #eaeae1;
        opacity: 80%;
        padding: 5px;
    }
    :checked && :hover {
        background-color: white;
    }
`
