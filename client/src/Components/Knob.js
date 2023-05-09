import React, { useState } from 'react'
import styled from 'styled-components'

const Knob = ({ value, onChange }) => {
    const [dragging, setDragging] = useState(false)
    const [dragStartY, setDragStartY] = useState(null)
    const handleMouseDown = (e) => {
        console.log('mouse down, dragging is true')
        setDragging(true)
        setDragStartY(e.clientY)
    }

    const handleMouseMove = (e) => {
        if (dragging) {
            console.log('we draggin!')
            console.log(e.clientY)
            const deltaY = dragStartY - e.clientY
            const newValue = Math.max(30, Math.min(240, value + deltaY))
            console.log(newValue, 'newval')
            onChange(newValue)
            setDragStartY(e.clientY)
        }
    }

    const handleMouseUp = () => {
        console.log('mouse up, dragging is false')
        setDragging(false)
    }

    const handleMouseLeave = () => {
        console.log('mouse up, dragging is false')
        // setDragging(false)
    }

    return (
        <SliderContainer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <SliderBackground
            // style={{
            //     position: 'relative',
            //     width: '10px',
            //     height: '50px',
            //     backgroundColor: '#f1f1f1',
            //     cursor: 'pointer',
            //     userSelect: 'none',
            // }}
            >
                <div
                    style={{
                        position: 'relative',
                        top: `${100 - value}%`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#333',
                    }}
                />
            </SliderBackground>
        </SliderContainer>
    )
}

export default Knob

const SliderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
    background: #5e5e5e;
    height: 90px;
`
const SliderBackground = styled.div`
    position: relative;
    width: 10px;
    height: 50px;
    background-color: #f1f1f1;
    cursor: pointer;
    userselect: none;
`
