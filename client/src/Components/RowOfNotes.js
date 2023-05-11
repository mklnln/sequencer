import MelodyCheckbox from './MelodyCheckbox'

const RowOfNotes = ({
    note,
    areMelodyBeatsChecked,
    beatIndex,
    scaleIndex,
    handleCheckbox,
}) => {
    return (
        <>
            {areMelodyBeatsChecked[`note-${scaleIndex}`].map((check, index) => {
                return (
                    <MelodyCheckbox
                        key={`row-${scaleIndex}-beat-${index}-check${check}-beat${beatIndex}`}
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
