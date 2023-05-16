import { useState } from 'react'
import styled from 'styled-components'
import DropdownArrow from '../assets/SVGs/DropdownArrow'

const CustomDropdown = ({
    title,
    stateValue,
    stateValueOptions,
    setState,
    // handleOptionClick,
    // isDropdownOpen,
    // setIsDropdownOpen,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleOptionClick = (option, index) => {
        setState(option)
        setIsDropdownOpen(false)
        console.log('option thereby click`d')
        // console.log(rootNoteOptions.indexOf(option), 'bybybyb')
        // root = rootNoteOptions.indexOf(option) + 1
    }

    const mouseLeave = () => {
        console.log('mouse left')
        setIsDropdownOpen(false)
    }
    return (
        <DropdownContainer onMouseLeave={mouseLeave}>
            <ParameterLabel>{title}</ParameterLabel>
            <ULDropdown onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {isDropdownOpen ? (
                    stateValueOptions.map((option, index) => (
                        <Option
                            key={option}
                            onClick={() => handleOptionClick(option, index)}
                            style={
                                isDropdownOpen
                                    ? { zIndex: '200' }
                                    : { zIndex: '1' }
                            }
                        >
                            {option}
                        </Option>
                    ))
                ) : (
                    <ChosenOptionDiv>
                        <ChosenOptionSpan>{stateValue}</ChosenOptionSpan>
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // width: 20px;
    // height: full;
`
const ParameterLabel = styled.span``

const ULDropdown = styled.ul`
    position: absolute;
    // top: 100%;
    // left: 0;
    width: 55px;

    display: flex;
    // z-index: 100;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // top: 100%;
    display: inline-block;
    padding: 0;
    margin: 0;
    list-style: none;
    cursor: pointer;

    border: 1px solid var(--lightest-color);
    background-color: #000000;
`

const Option = styled.li`
    z-index: 3;
    padding: 0 10px;
    cursor: pointer;
    display: block;
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
    padding: 5px 8px;
`
const ChosenOptionSpan = styled.span`
    z-index: 1;
    padding: 2px 0 0 0;
    cursor: pointer;
    display: block;
`
export default CustomDropdown
