import { Box } from '@mui/material'
import { styled } from '@mui/system'
import React, { useContext, useEffect } from 'react'
import { myClient } from '../..'
import RegularBox from '../channelGroups/RegularBox'
import { GroupContext } from '../Groups/Groups'
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

  let groupContext = useContext(GroupContext)

  useEffect(()=>{
    console.log(groupContext)
    const fn = async () => {
      try {
        const chatRoomResponse = await myClient.getChatroom()
        console.log(chatRoomResponse)
      } catch (error) {
        console.log(error)
      }
    }
    fn()
  })


  return (
    <StyledBox>
        
        <RegularBox/>
        <div  style={{
          flexGrow: 0.4
        }}/>
        <Input/>
    </StyledBox>
  )
}

export default GroupChatArea