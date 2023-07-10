import { useState } from 'react'
import styled from 'styled-components'
import DropdownArrow from '../assets/SVGs/DropdownArrow'
const CustomDropdown = ({
    title,
    stateValueOptions,
    loadUserSongs,
    setState,
    bubbleUpParameterInfo,
    bubbleUpCurrentSongChange,
    defaultValue,
}) => {
    // dropdown logic must be in this smaller component or else they all open if its kept in Sequencer.js
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [hoverOnDropdown, setHoverOnDropdown] = useState(false)
    // without dropdownValue, state wont update the UI
    const [dropdownValue, setDropdownValue] = useState(defaultValue)
    const handleOptionClick = (option) => {
        setDropdownValue(option)
        setIsDropdownOpen(false)
        if (title === 'Load Song') {
            console.log('load new song bool true')
            setState(option)
            bubbleUpCurrentSongChange(
                loadUserSongs[option].notesToPlay,
                loadUserSongs[option].parameters
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

    return (
        <DropdownContainer>
            <ParameterLabel>{title}</ParameterLabel>
            <ULDropdown
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setHoverOnDropdown(true)}
                onMouseLeave={() => setHoverOnDropdown(false)}
                style={
                    isDropdownOpen
                        ? {
                              zIndex: '2',
                          }
                        : { zIndex: '0' }
                }
            >
                {isDropdownOpen ? (
                    stateValueOptions.map((option, index) => (
                        <Option
                            key={option}
                            onClick={() => handleOptionClick(option, index)}
                        >
                            {option}
                        </Option>
                    ))
                ) : (
                    <ChosenOptionDiv>
                        <span>{dropdownValue}</span>
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
const ParameterLabel = styled.span``

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
