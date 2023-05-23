import MelodyCheckbox from './SingleCheckbox'

const RowOfNotes = ({ note, areMelodyBeatsChecked, beatIndex, scaleIndex }) => {
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
                    />
                )
                // }
            })}
        </>
    )
}

export default RowOfNotes
