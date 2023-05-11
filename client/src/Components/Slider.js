import React, { useState } from 'react'
import styled from 'styled-components'

const Slider = ({
    parameterName,
    onChange,
    dragging,
    setDragging,
    dragStartY,
    setDragStartY,
    slider,
}) => {
    const { minValue, maxValue, title, stateValue, setStateFxn } = slider
    const range = maxValue - minValue // 240 - 30, 210, i.e. lowest highest values possible
    const valuePerPixel = range / 50 // 50px of height, 1 px = this many in value
    const handleMouseMove = (e) => {
        console.log('mouse move', dragging)
        if (dragging) {
            console.log('we draggin!')
            console.log(e.clientY)
            const deltaY = dragStartY - e.clientY
            const newValue = Math.max(
                minValue,
                Math.min(maxValue, stateValue + deltaY * valuePerPixel)
            )
            console.log(newValue, 'newval')
            onChange(Math.round(newValue))
            setDragStartY(e.clientY)
        }
    }
    const handleMouseUp = () => {
        setDragging(false)
        console.log('dragging false')
    }
    const handleMouseDown = (e) => {
        setDragging(true)
        console.log('dragging true')
        setDragStartY(e.clientY)
    }

    const handleMouseLeave = () => {
        setDragging(false)
    }
    const calculateTop = () => {
        const valueWithinRange = stateValue - minValue
        const percentDisplacementFromTop = (valueWithinRange / range) * 100
        return 100 - percentDisplacementFromTop
    }
    return (
        <SliderContainer>
            <span>{title}</span>
            <SliderBackground
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <SliderRange>
                    <div
                        style={{
                            position: 'relative',
                            top: `${calculateTop()}%`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#333',
                        }}
                    />
                </SliderRange>
            </SliderBackground>
        </SliderContainer>
    )
}

export default Slider

const SliderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20px;
`

const SliderBackground = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
    background: #5e5e5e;
    height: 90px;

    margin-top: 5px;
`
const SliderRange = styled.div`
    position: relative;
    width: 10px;
    height: 50px;
    background-color: #f1f1f1;
    cursor: pointer;
    border-bottom: 10px solid white;
    userselect: none;
`
