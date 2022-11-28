import { Box } from '@mui/material'
import React from 'react'
import MessageBox from './MessageBox'

function MessageBlock({
    userId, message, reactions, metaDetails
}) {

    const currentUser = "NASH"
  return (
    <Box
    className='flex py-2 px-0'
    sx={{
        
        flexDirection: userId === currentUser ? 'row-reverse' : 'row',
        
    }}>
        <MessageBox userId={userId} username={userId} messageString={"Hello"} time={"10:15pm"}/>
    </Box>
  )
}

export default MessageBlock