import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import acceptLogo from '../../assets/acceptInvite.png'

function AcceptInvite() {
  return (
    <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%"
    }}>
        <div style={{flexGrow: 1}}/>
        <img src={acceptLogo}/>
        <Typography fontSize={"24px"} fontWeight={700} color={"#323232"} fontFamily={"Lato"} maxWidth={"400px"} textAlign="center">
        Please accept the invite to view the messages in this Group.
        </Typography>
        <Button variant='filled' sx={{
            backgroundColor: "#3884F7",
            color: "#FFFFFF",
            padding: "16px 30px",
            fontSize: "16px",
            marginY: "12px",
            "&:hover": {
                color: "#3884F7",
                background: "#EBF3FF"
            }
        }}> 
            Accept
        </Button>
        <div style={{flexGrow: 1}}/>

        
        
    </Box>
  )
}

export default AcceptInvite