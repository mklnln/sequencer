import React, { memo, useState } from 'react'
import styled from 'styled-components'
import NoiseSVG from '../assets/SVGs/SliderNoiseSVG.js'

const Slider = memo(({ sliderStaticInfo, bubbleUpParameterInfo }) => {
    const [dragStartY, setDragStartY] = useState(null)
    const [dragging, setDragging] = useState(false)
    const { minValue, maxValue, title, defaultValue } = sliderStaticInfo
    const [sliderValue, setSliderValue] = useState(defaultValue)
    const range = maxValue - minValue // 240 - 30, 210, i.e. lowest highest values possible
    const valuePerPixel = range / 50 // 50px of height, 1 px = this many in value
    const handleMouseMove = (e) => {
        if (dragging) {
            const deltaY = dragStartY - e.clientY
            let newValue = Math.max(
                // math.max chooses higher value, ensuring the value doesn't drop below minValue
                minValue,
                // Math.min of maxValue, stateValue etc chooses lower value to avoid exceeding upper bound
                Math.min(maxValue, sliderValue + deltaY * valuePerPixel)
            )
            setSliderValue(Math.round(newValue))
            if (title === 'Filter') {
                // console.log(newValue, range, '??')
                // let pct = newValue / range
                newValue = (newValue * 0.01) ** 2
                console.log(newValue, 'after exp')
                // something like % of range put it to log
            }
            bubbleUpParameterInfo(Math.round(newValue), title)

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
        const valueWithinRange = sliderValue - minValue
        const percentDisplacementFromTop = (valueWithinRange / range) * 100
        return 100 - percentDisplacementFromTop
    }

    const gap = calculateTop()

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
                    <NoiseSVG />
                    <SliderThumb
                        style={{
                            borderBottomWidth: `${(100 - gap) / 2}px`,
                            top: `${gap}%`, // required variables are out of scope if called below
                        }}
                    />
                </SliderRange>
            </SliderBackground>
        </SliderContainer>
    )
})

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
    height: 90px;
    margin-top: 5px;
    padding-bottom: 10px;
    border: 3px double var(--lightest-color);
`

const SliderRange = styled.div`
    position: relative;
    padding: 10px 0px;
    margin: 0px;
    width: 20px;
    height: 50px;
    cursor: pointer;
    :hover {
        background-color: var(--secondary-color);
        opacity: 60%;
    }
`

const SliderThumb = styled.div`
    // opacity: 0%;
    background-color: rgb(120, 94, 35);
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    border-bottom: 1px solid var(--primary-color);

    width: 10px;
    height: 10px;
`
