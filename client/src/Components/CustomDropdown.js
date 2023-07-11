import { useState } from 'react'
import styled from 'styled-components'
import DropdownArrow from '../assets/SVGs/DropdownArrow'
const CustomDropdown = ({
    title,
    stateValue,
    stateValueOptions,
    loadUserSongs,
    bubbleUpParameterInfo,
    bubbleUpCurrentSongChange,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [hoverOnDropdown, setHoverOnDropdown] = useState(false)

    const handleOptionClick = (option) => {
        setIsDropdownOpen(false)
        if (title === 'Load Song') {
            bubbleUpCurrentSongChange(
                loadUserSongs[option].notesToPlay,
                loadUserSongs[option].parameters,
                option
            )
        } else {
            bubbleUpParameterInfo(option, title)
        }
    }

    // when user clicks outside of the dropdown, it closes
    if (isDropdownOpen && !hoverOnDropdown) {
        const listener = () => {
            setIsDropdownOpen(false)
            document.removeEventListener('click', listener)
        }
        document.addEventListener('click', listener)
    }
    const stringMax = title === 'Load Song' ? 18 : 8

    return (
        <DropdownContainer>
            <ParameterLabel>{title}</ParameterLabel>
            <ULDropdown
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setHoverOnDropdown(true)}
                onMouseLeave={() => setHoverOnDropdown(false)}
                style={{
                    zIndex: isDropdownOpen ? '2' : '0',
                    width: title === 'Load Song' ? '200px' : '95px',
                }}
            >
                {isDropdownOpen ? (
                    stateValueOptions.map((option, index) => (
                        <Option
                            key={option}
                            onClick={() => handleOptionClick(option, index)}
                        >
                            {option.toString().length <= stringMax + 3 ? (
                                <span>{option}</span>
                            ) : (
                                <span>
                                    {option.substring(0, stringMax)}
                                    ...
                                </span>
                            )}
                        </Option>
                    ))
                ) : (
                    <ChosenOptionDiv>
                        <span>
                            {stateValue?.toString().length <= stringMax + 3 ? (
                                <span>{stateValue}</span>
                            ) : (
                                <span>
                                    {stateValue
                                        ?.toString()
                                        .substring(0, stringMax)}
                                    ...
                                </span>
                            )}
                        </span>
                        <DropdownArrow />
                    </ChosenOptionDiv>
                )}
            </ULDropdown>
        </DropdownContainer>
    )
}

const DropdownContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    height: 100%;
    margin: 4px 0px;
`
const ParameterLabel = styled.span`
    font-size: 16px;
    width: 100px;
    text-align: center;
`

const ULDropdown = styled.ul`
    position: absolute;
    top: 100%;
    width: 95px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--lightest-color);
    background-color: #000000;
`

const Option = styled.li`
    padding: 0 5px;
    cursor: pointer;
    display: block;
    letter-spacing: 0em;
    :hover {
        background-color: var(--primary-color);
        color: black;
    }
`

const ChosenOptionDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 2px 5px;
`
export default CustomDropdown
