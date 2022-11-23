import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styled from '@emotion/styled';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import IconButton from '@mui/material';

const StyledBox = styled(Box)({
    backgroundColor: "#FFFBF2",
    minHeight: "100vh",
    // borderTop: "1px solid #EEEEEE",
    display: "flex",
    flexDirection: "column"
})


function GroupInfo() {
    const participants = Array(5).fill(1)
    return (
        <StyledBox style={{
            marginTop: "none",
            padding: "0px 96px 0px 12px",
        }}>
            <Box sx={{
                
                display: "flex",
                alignItems: "center",
            }}>
                <IconButton>
                    <KeyboardBackspaceIcon />
                </IconButton>
                <Typography sx={{
                    fontFamily: "Lato"
                }} fontSize={"20px"} fontWeight={700} color={"#3884F7"}>
                    Group Info
                </Typography>
            </Box>
            <Box sx={{
                // maxWidth: "400px",
                marginLeft: "12px"
            }}>
            This group is a community of people working in start- ups coming together to help each other.
            <Typography sx={{
                    fontFamily: "Lato"
                }} fontSize={"16px"} fontWeight={700} color={"#323232"} marginTop={2}>
                    Participants
                </Typography>

                <Box sx={{
                    padding: "24px 0"
                }}>
                    {
                participants.map((profile, profileIndex)=>{
                    return (
                        <ParticipantTile key={profile + profileIndex} index={profileIndex}/>
                    )
                })
            }
                </Box>
            </Box>

            

        </StyledBox>
    )
}

function ParticipantTile({index}){
    
    return (
        <Box sx={{
            background: "#FFFFFF",
            padding: "12px 8px",
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #EEEEEE",
            alignItems: "center"
        }}>
            <AccountCircleIcon sx={{
                fontSize: "32px",
                marginRight: "12px"
            }}/>
            <span style={{fontFamily: "Lato", fontWeight: 700, fontSize: "14px"}}>Person {index}</span>
            <div style={{flexGrow: 1, }}/>
            <IconButton>
                <KeyboardArrowRightIcon/>
            </IconButton>

        </Box>
    )
}
export default GroupInfo