import React, { memo, useState } from 'react'
import styled from 'styled-components'
import NoiseSVG from '../assets/SVGs/SliderNoiseSVG.js'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG.js'

const Slider = memo(
    ({
        parameterName,
        // dragging,
        // setDragging,
        // dragStartY,
        // setDragStartY,
        // slider,
        sliderStaticInfo,
        bubbleUpSliderInfo,
    }) => {
        const [dragStartY, setDragStartY] = useState(null)
        const [dragging, setDragging] = useState(false)
        // const { stateValue, setParameterState } = slider
        const { minValue, maxValue, title, defaultValue } = sliderStaticInfo
        const [sliderValue, setSliderValue] = useState(defaultValue)
        const range = maxValue - minValue // 240 - 30, 210, i.e. lowest highest values possible
        const valuePerPixel = range / 50 // 50px of height, 1 px = this many in value
        const handleMouseMove = (e) => {
            if (dragging) {
                const deltaY = dragStartY - e.clientY
                const newValue = Math.max(
                    // math.max chooses higher value, ensuring the value doesn't drop below minValue
                    minValue,
                    // Math.min of maxValue, stateValue etc chooses lower value to avoid exceeding upper bound
                    Math.min(maxValue, sliderValue + deltaY * valuePerPixel)
                )
                bubbleUpSliderInfo(Math.round(newValue), title)
                setSliderValue(Math.round(newValue))
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
    }
)

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

const NoiseFill = styled.span`
    position: relative;
    top: -5%;
    margin: auto;
    height: 100px;
    user-select: none;
    word-break: break-all;
    width: 10px;
    // letter-spacing: em;
    line-height: 3.5px;
    position: absolute;
    font-size: 22px;
    color: var(--lightest-color);
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
