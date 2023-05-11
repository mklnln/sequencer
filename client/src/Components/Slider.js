import React, { useState } from 'react'
import styled from 'styled-components'

const Slider = ({
    parameterName,
    dragging,
    setDragging,
    // dragStartY,
    // setDragStartY,
    slider,
}) => {
    const [dragStartY, setDragStartY] = useState(null)
    const { minValue, maxValue, title, stateValue, setParameterState } = slider
    const range = maxValue - minValue // 240 - 30, 210, i.e. lowest highest values possible
    const valuePerPixel = range / 50 // 50px of height, 1 px = this many in value
    const handleMouseMove = (e) => {
        if (dragging) {
            const deltaY = dragStartY - e.clientY
            const newValue = Math.max(
                minValue,
                Math.min(maxValue, stateValue + deltaY * valuePerPixel)
            )
            console.log(newValue, 'newval')
            setParameterState(Math.round(newValue))
            setDragStartY(e.clientY)
        }
    }
    const handleMouseUp = () => {
        setDragging(false)
    }
    const handleMouseDown = (e) => {
        setDragging(true)
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

    const gap = calculateTop()
    console.log(50 - gap, 'px')
    let hover = false
    const [hoverState, setHoverState] = useState(false)
    return (
        <SliderContainer>
            <span>{title}</span>
            <SliderBackground
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <SliderRange
                    onMouseEnter={() => {
                        hover = true
                        setHoverState(true)
                        console.log(hover)
                    }}
                    onMouseLeave={() => {
                        hover = false
                        setHoverState(false)
                        console.log(hover)
                    }}
                    style={
                        {
                            // borderBottomColor: 'fuchsia',
                            // borderBottom: ` solid #ff00000`,
                        }
                    }
                >
                    <SliderThumb
                        style={{
                            borderBottomWidth: `${(100 - gap) / 2}px`,
                            top: `${gap}%`, // required variables are out of scope if called below
                            backgroundColor: hoverState ? '#444444' : '#111111',
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
    background: #222222;
    height: 90px;
    margin-top: 5px;
    padding-bottom: 10px;
`
const SliderRange = styled.div`
    position: relative;
    width: 10px;
    height: 50px;
    background-color: #f1f1f1;
    // background-color: var(--secondary-color);
    cursor: pointer;
    // border-bottom: 10px solid white;
    userselect: none;
    :hover {
        // opacity: 80%;
    }
`
const SliderThumb = styled.div`
    background-color: #333;
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    border-bottom: 1px solid var(--primary-color);

    width: 10px;
    height: 10px;
    :hover {
        // opacity: 85%;
    }
`
