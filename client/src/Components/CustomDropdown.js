import { useState } from 'react'
import styled from 'styled-components'
import DropdownArrow from '../assets/SVGs/DropdownArrow'
const CustomDropdown = ({ title, stateValue, stateValueOptions, setState }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleOptionClick = (option, index) => {
        let set = option
        if (title === 'Steps') {
            set = parseInt(option)
        }
        setState(set)
        setIsDropdownOpen(false)
    }

    const mouseLeave = () => {
        setIsDropdownOpen(false)
    }
    return (
        <DropdownContainer>
            <ParameterLabel>{title}</ParameterLabel>
            <ULDropdown
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                        <span>{stateValue}</span>
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
