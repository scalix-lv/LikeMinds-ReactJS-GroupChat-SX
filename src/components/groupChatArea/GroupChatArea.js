import { Box } from '@mui/material'
import { styled } from '@mui/system'
import React from 'react'
import RegularBox from '../channelGroups/RegularBox'
import Input from '../InputComponent/Input'
import Tittle from './tittle/Tittle'


// Exported Styled Box
export const StyledBox = styled(Box)({
    backgroundColor: "#FFFBF2",
    minHeight: "100vh",
    borderTop: "1px solid #EEEEEE",
    display: "flex",
    flexDirection: "column",
    height: "100%"
})
function GroupChatArea() {
  const chats = [{

  }]
  return (
    <StyledBox>
        
        <RegularBox/>
        <div className='grow'/>
        <Input/>
    </StyledBox>
  )
}

export default GroupChatArea