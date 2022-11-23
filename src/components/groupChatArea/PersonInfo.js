// import { AccountCircleIcon } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import React from 'react'
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import styled from '@emotion/styled';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { StyledBox } from './GroupChatArea';
import { IconButton } from '@mui/material';
import { Typography } from '@mui/material';
function PersonInfo() {
    const mediaArray = [
        LinkedInIcon,
        InstagramIcon,
        TwitterIcon
    ]

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
                    Group Info / Person 1
                </Typography>
            </Box>
            <Box sx={{
                // maxWidth: "400px",
                marginLeft: "12px",
                marginTop: "16px"
            }}>
                <Box>
                    <AccountCircleIcon sx={{
                        fontSize: "56px"
                    }} />
                </Box>
                <p style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    fontFamily: "Lato",
                    margin: "8px 0",
                    color: "#323232"
                }}>
                Person 1
                </p>
                <Box sx={{
                    margin: "8px 0px"
                }}>
                   {
                    mediaArray.map((MediaIcon, mediaIconIndex)=>{
                        return (
                            <MediaIcon sx={{
                                margin: "4px",
                                fontSize: "30px"
                            }}/>
                        )
                    })
                   }
                </Box>
                <Typography sx={{
                    fontFamily: "Lato"
                }} fontSize={"14px"} fontWeight={400} color={"#323232"} marginTop={2}>
                    An organized and enthusiastic designer, whose life has been nothing but a series of unplanned and unexpected events. I enjoy working on topics that are out of the box and that would let me come up with innovative ideas.
                </Typography>

                <Typography sx={{
                    fontFamily: "Lato"
                }} fontSize={"16px"} fontWeight={700} color={"#323232"} marginTop={2}>
                    Founder of <a href='#' style={{
                        color: "#734AC7"
                    }}>
                        @Beyond Design
                    </a>
                </Typography>



                <Box sx={{
                    padding: "16px 0"
                }}>
                    <p
                        style={{
                            fontFamily: 'Lato',
                            fontStyle: "normal",
                            fontWeight: 700,
                            fontSize: "24px",
                        }}
                    >
                        Find them in
                    </p>

                    <InfoTile title={"Hiring Techniques"} buttontitle={"Forum"} />
                    <InfoTile title={"Beyond Design"} buttontitle={"Group"} />

                </Box>
            </Box>



        </StyledBox >
    )
}

function InfoTile({ index, title, buttontitle }) {

    return (
        <Box sx={{
            background: "#FFFFFF",
            padding: "8px 16px",
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #EEEEEE",
            alignItems: "center",
            marginBottom: "8px"
        }}>
            <Box>
                <p style={{
                    margin: "4px 0 8px 0"
                }}>
                    <span style={{
                        color: "#323232",
                        fontSize: "16px",
                        fontWeight: 600
                    }}>
                        {title}
                    </span>
                </p>

                <Button variant='outlined' sx={{
                    padding: "4px 6px",
                    color: "#E0FFDF",
                    background: "#83D381",
                    "&:hover": {
                        background: "#E0FFDF",
                        color: "#83D381"
                    }
                }}
                    startIcon={
                        (
                            <FiberManualRecordIcon color='#E0FFDF' />
                        )
                    }
                >
                    {buttontitle}
                </Button>
            </Box>
            <div style={{ flexGrow: 1, }} />

            <Button variant='outlined' sx={{
                padding: "5px 16px",
                color: "#3884F7"
            }}>
                View
            </Button>

        </Box>
    )
}

export default PersonInfo