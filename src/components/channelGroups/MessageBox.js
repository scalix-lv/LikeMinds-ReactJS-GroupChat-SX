import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
function MessageBox({
    username,
    messageString,
    time,
    userId
}) {
    return (
        <Box sx={{
            display: "flex",
        }}>
            <StringBox username={username} messageString={messageString} time={time} userId={userId} />
            <MoreOptions />
        </Box>
    )
}

function StringBox({ username, messageString, time, userId }) {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: "space-between",
            padding: "16px 20px 16px 20px",
            width: "280px",
            background: userId === "NASH" ? "#ECF3FF" : "#FFFFFF",
            borderRadius: "10px"
        }}>

            <Box>
                <Typography component={'p'} fontWeight={700} fontSize={12} fontFamily={"Lato"}>
                    {username}
                </Typography>

                <Typography component={'p'} fontWeight={300} fontSize={14} fontFamily={"Lato"}>
                    {messageString}
                </Typography>
            </Box>
            <TimeBox time={time} />
        </Box>
    )
}

function TimeBox({ time }) {
    return (
        <span
            style={{
                fontSize: "10px",
                fontWeight: 300,
                color: "#323232"
            }}
        >
            {time}
        </span>
    )
}

function MoreOptions() {
    const [anchor, setAnchor] = useState(null)

    let open = Boolean(anchor)

    const ref = useRef(null)


    useState(()=>{
        const handleCloseFunction = (e) =>{
            if(ref.current && !ref.current.contains(e.target)){
                setAnchor(null)
            }
        }
        document.addEventListener('click', handleCloseFunction)
        return ()=>{
            document.removeEventListener('click', handleCloseFunction)
        }
    })

    
    const options = [
        {
            title: "Reply"
        },
        {
            title: "Reply Privately"
        },
        {
            title: "Report"
        }
    ]
    return (
        <Box>
            <IconButton
            ref={ref}
            onClick={(e)=>{
                setAnchor(e.currentTarget)
            }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                open={open}
                anchorEl={anchor}
            >
                {
                    options.map((option, optionIndex)=>{
                        return (
                            <MenuItem key={option.title}>
                                {option.title}
                            </MenuItem>
                        )
                    })
                }

            </Menu>



        </Box>
    )
}

export default MessageBox