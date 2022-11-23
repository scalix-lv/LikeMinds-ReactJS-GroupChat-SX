import { Box, Button, Collapse, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

function CurrentGroups() {
    const groupsInfo = [
        {
            title: "Founders Social",
            newUnread: 3
        },
        {
            title: "Socialize and Stratagize",
            newUnread: 0
        }
    ]

    const groupsInviteInfo = [
        {
            title: "Founders Social",
            groupType: "private"
        },
        {
            title: "Socialize and Stratagize",
            groupType: "private"
        }
    ]

    
    return (
        <Box sx={
            {
                
                
            }
        }>
            {
                groupsInfo.map((group, groupIndex) => {
                    return (
                        <GroupTile key={group.title + groupIndex.toString()} title={group.title} newUnread={group.newUnread} />
                    )
                })
            }

            {
                groupsInviteInfo.map((group, groupIndex) => {
                    return (
                        <GroupInviteTile title={group.title} groupType={group.groupType} />
                    )
                })
            }

            {
                <PublicGroup />
            }
        </Box>
    )
}

function GroupTile({ title, newUnread }) {
    return (
        <Box
            sx={{
                backgroundColor: newUnread > 0 ? "#ECF3FF" : "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                padding: "18px 18px",
                border: "1px solid #EEEEEE",
            }}
        >
            <Typography component={'span'}
                sx={{
                    color: newUnread > 0 ? "#3884F7" : "#323232",
                    fontSize: "16px",
                    fontWeight: 400
                }}
            >
                {title}
                {newUnread <= 0 ? (
                    <span style={{
                        backgroundColor: "#FFEFC6",
                        padding: "4px",
                        color: "#F6BD2A",
                        fontSize: "10px",
                        fontWeight: 500,
                        margin: "4px"
                    }}>
                        Private
                    </span>
                ) : null}
            </Typography>
            <Typography component={'span'} sx={{
                color: newUnread > 0 ? "#3884F7" : "#323232",
                fontSize: "12px",
                fontWeight: 300
            }}>
                {newUnread > 0 ? (<>{newUnread} new messages</>) : null}
            </Typography>
        </Box>
    )
}


function GroupInviteTile({ title, groupType }) {
    return (
        <Box
            sx={{
                backgroundColor: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                padding: "18px 18px",
                border: "1px solid #EEEEEE",
            }}
        >
            <Box>
                <Typography component={'p'}
                    sx={{
                        color: "#ADADAD",
                        fontSize: "12px",
                        fontWeight: 400,
                        textAlign: "left"
                    }}
                >
                    You have been invited to

                </Typography>


                <Typography component={'p'}
                    sx={{
                        color: "#323232",
                        fontSize: "16px",
                        fontWeight: 400
                    }}
                >
                    {title}
                    {groupType === "private" ? (
                        <span style={{
                            backgroundColor: "#FFEFC6",
                            padding: "4px",
                            color: "#F6BD2A",
                            fontSize: "10px",
                            fontWeight: 500,
                            margin: "4px"
                        }}>
                            Private
                        </span>
                    ) : null}
                </Typography>
            </Box>

            <Box>
                <IconButton disableRipple={true}>
                    <CloseIcon sx={{
                        backgroundColor: "#F9F9F9",
                        color: "#ADADAD",
                        padding: "8px",
                        borderRadius: "50%"
                    }} />
                </IconButton>

                <IconButton disableRipple={true}>
                    <DoneIcon sx={{
                        backgroundColor: "#E0FFDF",
                        color: "#83D381",
                        padding: "8px",
                        borderRadius: "50%"
                    }} />
                </IconButton>
            </Box>

        </Box>
    )
}

function PublicGroup({groupTitle}) {
    const [shouldOpen, setShouldOpen] = useState(true)
    function handleCollapse() {
        setShouldOpen(!shouldOpen)
    }

    const publicGroups = Array(10).fill({
        groupTitle: "Public Group"
    })
    console.log(publicGroups)
    return (
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 18px "

            }}>
                <Typography component={"span"} sx={{
                    fontSize: "20px",
                    fontWeight: 500,
                }}>
                    All Public Groups
                </Typography>

                <IconButton onClick={handleCollapse}>
                    {
                        !shouldOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
                    }
                </IconButton>

            </Box>
            <Collapse
                in={shouldOpen}
                sx={{
                    border: "1px solid #EEEEEE"
                }}>
                {
                    publicGroups.map((group, groupIndex)=>{
                        return (
                            <PublicGroupTile key={group.groupTitle + groupIndex} groupTitle={group.groupTitle + " " + groupIndex}/>
                        )
                    })
                }
            </Collapse>
        </Box>
    )
}

function PublicGroupTile({ groupTitle }) {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 18px ",
            alignItems: "center "
        }}>
            <Typography component={"span"} sx={{
                fontSize: "16px",
                fontWeight: 400,
            }}>
                {groupTitle}
            </Typography>

            <Button variant='outlined'>
                JOIN
            </Button>

        </Box>
    )
}



export default CurrentGroups