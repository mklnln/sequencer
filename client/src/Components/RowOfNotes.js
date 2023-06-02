import MelodyCheckbox from './SingleCheckbox'

const RowOfNotes = ({ note, areMelodyBeatsChecked, beatNum, scaleIndex }) => {
    return (
        <>
            {areMelodyBeatsChecked[`note-${scaleIndex}`].map((check, index) => {
                return (
                    <MelodyCheckbox
                        key={`row-${scaleIndex}-beat-${index}-check${check}-beat${beatNum}`}
                        note={note}
                        areMelodyBeatsChecked={areMelodyBeatsChecked}
                        beatNum={index}
                        scaleIndex={scaleIndex}
                    />
                )
                // }
            })}
        </>
    )
}

export default RowOfNotes
