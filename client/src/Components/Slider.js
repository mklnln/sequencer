import React, { memo, useState } from 'react'
import styled from 'styled-components'
import NoiseSVG from '../assets/SVGs/SliderNoiseSVG.js'
import CheckboxNoiseSVG from '../assets/SVGs/CheckboxNoiseSVG.js'

const Slider = memo(
    ({
        parameterName,
        dragging,
        setDragging,
        // dragStartY,
        // setDragStartY,
        slider,
        sliderStaticInfo,
    }) => {
        const [dragStartY, setDragStartY] = useState(null)
        console.log(sliderStaticInfo, 'static info!!')
        console.log(slider, 'slider in state')
        const { minValue, maxValue, title, stateValue, setParameterState } =
            slider
        const range = maxValue - minValue // 240 - 30, 210, i.e. lowest highest values possible
        const valuePerPixel = range / 50 // 50px of height, 1 px = this many in value
        const handleMouseMove = (e) => {
            if (dragging) {
                const deltaY = dragStartY - e.clientY
                const newValue = Math.max(
                    // math.max chooses higher value, ensuring the value doesn't drop below minValue
                    minValue,
                    // Math.min of maxValue, stateValue etc chooses lower value to avoid exceeding upper bound
                    Math.min(maxValue, stateValue + deltaY * valuePerPixel)
                )
                console.log(newValue, 'newval')
                setParameterState(Math.round(newValue))
                console.log(stateValue, newValue)
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

        // const debounce = (func, timeout = 300) => {
        //     let timer
        //     return (...args) => {
        //         clearTimeout(timer)
        //         timer = setTimeout(() => {
        //             console.log('debeouncing!')
        //             func.apply(this, args)
        //         }, timeout)
        //     }
        // }
        // function saveInput() {
        //     console.log('Saving data')
        // }
        // const debounceMouseMove = (e) => {
        //     console.log('devouncemosuemove!')
        //     debounce(() => handleMouseMove(e))
        // }
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
                        }}
                        onMouseLeave={() => {
                            hover = false
                            setHoverState(false)
                        }}
                        style={
                            {
                                // borderBottomColor: 'fuchsia',
                                // borderBottom: ` solid #ff00000`,
                            }
                        }
                    >
                        {/* <NoiseFill>wwwwwwwwwwwwwwwwwww</NoiseFill> */}
                        <NoiseSVG />
                        {/* <CheckboxNoiseSVG /> */}
                        <SliderThumb
                            style={{
                                borderBottomWidth: `${(100 - gap) / 2}px`,
                                top: `${gap}%`, // required variables are out of scope if called below
                                // backgroundColor: hoverState ? '#444444' : '#111111',
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
    // overflow: hidden;
    // display: flex;
    // justify-content: center;
    position: relative;
    // left: 5%;
    // z-index: 1;
    padding: 10px 0px;
    margin: 0px;
    width: 20px;
    height: 50px;
    // background-color: var(--secondary-color);
    cursor: pointer;
    // border-bottom: 10px solid white;
    userselect: none;
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
    :hover {
        // opacity: 85%;
    }
`
