import React, { memo, useState } from 'react'
import styled from 'styled-components'
import NoiseSVG from '../assets/SVGs/SliderNoiseSVG.js'

const Slider = memo(
    ({ sliderStaticInfo, bubbleUpParameterInfo, stateValue }) => {
        const [dragStartY, setDragStartY] = useState(null)
        const [dragging, setDragging] = useState(false)
        let { minValue, maxValue, title } = sliderStaticInfo
        const [sliderUIValue, setSliderUIValue] = useState(
            title === 'Filter' ? 75 : stateValue
        )

        let renderedValue = sliderUIValue

        // the filter value uses an exponential curve, so we track the UI separately
        if (title === 'Filter') {
            minValue = 1
            maxValue = 100
        }
        const range = maxValue - minValue // 240 - 30, 210, i.e. lowest highest values possible
        const valuePerPixel = range / 50 // 50px of height, 1 px = this many in value

        let newValue = sliderUIValue
        let deltaY = 0
        const handleMouseMove = (e) => {
            if (dragging) {
                deltaY = dragStartY - e.clientY
                // ensuring newValue stays within the proper bounds...
                newValue = Math.max(
                    minValue,
                    Math.min(maxValue, renderedValue + deltaY * valuePerPixel)
                )
                setSliderUIValue(newValue)
                setDragStartY(e.clientY)
            }
        }
        const handleMouseOff = () => {
            if (dragging) {
                setDragging(false)
                newValue = newValue ** 2
                if (title !== 'Filter') {
                    newValue = newValue / 100
                }
                bubbleUpParameterInfo(Math.round(newValue), title)
            }
        }
        const handleMouseDown = (e) => {
            setDragging(true)
            setDragStartY(e.clientY)
        }

        const calculateTop = () => {
            const valueWithinRange = renderedValue - minValue
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
                    onMouseUp={handleMouseOff}
                    onMouseLeave={handleMouseOff}
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
    user-select: none;
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
