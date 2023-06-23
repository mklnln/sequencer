import React, { useState } from 'react'
import styled from 'styled-components'

const SorryMobile = () => {
    return (
        <TextDiv>
            <SorrySpan>
                Sorry, mobile platforms are not supported yet.
            </SorrySpan>
        </TextDiv>
    )
}

export default SorryMobile

const TextDiv = styled.div`
    height: 90vh;
    width: 85vw;
    display: flex;
    justify-content: center;
    align-items: center;
`

const SorrySpan = styled.span`
    text-align: center;
`
