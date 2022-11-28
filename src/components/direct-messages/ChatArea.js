import { Box } from '@mui/material'
import { styled } from '@mui/system'
import React from 'react'
import GroupChatArea from '../groupChatArea/GroupChatArea'
// import RegularBox from '../channelGroups/RegularBox'
import Input from '../InputComponent/Input'

import RegularBox from "./../channelGroups/RegularBox"
import TittleDm from './TitleDM'


// Exported Styled Box
export const StyledBox = styled(Box)({
    backgroundColor: "#FFFBF2",
    minHeight: "100vh",
    borderTop: "1px solid #EEEEEE",
    display: "flex",
    flexDirection: "column",
    height: "100%"
})
function ChatArea({profile}) {
  
  return (
    <StyledBox>
        <TittleDm title={profile.name}/>
        {/* <RegularBox/> */}
        <GroupChatArea/>
        <div className='grow'/>
        <Input/>
        
    </StyledBox>
  )
}

export default ChatArea