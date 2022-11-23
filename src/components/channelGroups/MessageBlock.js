import { Box } from '@mui/material'
import React from 'react'
import MessageBox from './MessageBox'

function MessageBlock({
    userId, message, reactions, metaDetails
}) {

    const currentUser = "NASH"
  return (
    <Box sx={{
        display: "flex",
        flexDirection: userId === currentUser ? 'row-reverse' : 'row',
        padding: '8px 0',
    }}>
        <MessageBox userId={userId} username={userId} messageString={"Hello"} time={"10:15pm"}/>
    </Box>
  )
}

export default MessageBlock