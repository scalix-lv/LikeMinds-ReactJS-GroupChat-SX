import { Box } from '@mui/material'
import { styled } from '@mui/system'
import React from 'react'
import Tittle from './tittle/Tittle'
const StyledBox = styled(Box)({
    backgroundColor: "#F1E8D5",
    minHeight: "100vh"
})
function GroupChatArea() {
  return (
    <StyledBox>
        <Tittle headerProps={{
            title: "Founders Social",
            memberCount: 5
        }}/>
    </StyledBox>
  )
}

export default GroupChatArea