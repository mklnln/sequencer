import MelodyCheckbox from './MelodyCheckbox'

const RowOfNotes = ({
    note,
    areMelodyBeatsChecked,
    beatIndex,
    scaleIndex,
    handleCheckbox,
}) => {
    console.log(note, 'from RowANotes theer budy')
    return (
        <>
            {areMelodyBeatsChecked[`note-${scaleIndex}`].map((check, index) => {
                return (
                    <MelodyCheckbox
                        key={`row-${scaleIndex}-beat-${index}`}
                        note={note}
                        areMelodyBeatsChecked={areMelodyBeatsChecked}
                        beatIndex={index}
                        scaleIndex={scaleIndex}
                        handleCheckbox={handleCheckbox}
                    />
                )
                // }
            })}
        </>
    )
}

export default RowOfNotes
