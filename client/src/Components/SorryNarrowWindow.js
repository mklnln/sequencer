import React, { useState } from 'react'
import styled from 'styled-components'

const SorryNarrowWindow = () => {
    return (
        <TextDiv>
            <SorrySpan>
                Please widen your browser window &gt; 900px and refresh the
                page.
            </SorrySpan>
        </TextDiv>
    )
}

export default SorryNarrowWindow

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
