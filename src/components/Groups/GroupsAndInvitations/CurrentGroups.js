import { Box, Button, Collapse, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
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
        <Box className='flex justify-between p-[18px] border border-solid border-[#EEEEEE]'
            sx={{
                backgroundColor: newUnread > 0 ? "#ECF3FF" : "#FFFFFF",

            }}
        >
            <Typography component={'span'} className="text-base font-normal"
                sx={{
                    color: newUnread > 0 ? "#3884F7" : "#323232",
                }}
            >
                {title}
                {newUnread <= 0 ? (
                    <span className='bg-[#FFEFC6] p-1 text-[#F6BD2A] text-[10px] font-medium m-1'>
                        Private
                    </span>
                ) : null}
            </Typography>
            <span className="text-xs font-light" style={{
                color: newUnread > 0 ? "#3884F7" : "#323232",
            }}>
                {newUnread > 0 ? (<>{newUnread} new messages</>) : null}
            </span>
        </Box>
    )
}


function GroupInviteTile({ title, groupType }) {
    return (
        <Box className='bg-white flex justify-between p-[18px] border border-solid border-[#EEEEEE]'

        >
            <Box>
                <Typography variant='body2'
                    className="text-[#ADADAD] text-xs text-left font-normal"

                >
                    You have been invited to

                </Typography>


                <Typography component={'p'} className="text-[#323232] text-base font-normal"

                >
                    {title}
                    {groupType === "private" ? (
                        <span className='bg-[#FFEFC6] p-1 text-[#F6BD2A] text-[10px] font-medium m-1'
                        >
                            Private
                        </span>
                    ) : null}
                </Typography>
            </Box>

            <Box>
                <IconButton disableRipple={true}>
                    <CloseIcon
                        className='bg-[#F9F9F9] text-[#ADADAD] p-2 rounder-full'
                    />
                </IconButton>

                <IconButton disableRipple={true}>
                    <DoneIcon
                        className='bg-[#E0FFDF] text-[#83D381] p-2 rounded-full'
                    />
                </IconButton>
            </Box>

        </Box>
    )
}

function PublicGroup({ groupTitle }) {
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
            <Box
                className='flex justify-between px-3.5 py-[18px]'
            >
                <Typography component={"span"}
                    className="text-4 font-medium"
                >
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
                className="border border-solid border-[#EEEEEE]"
            >
                {
                    publicGroups.map((group, groupIndex) => {
                        return (
                            <PublicGroupTile key={group.groupTitle + groupIndex} groupTitle={group.groupTitle + " " + groupIndex} />
                        )
                    })
                }
            </Collapse>
        </Box>
    )
}

function PublicGroupTile({ groupTitle }) {
    return (
        <Box
            className='flex justify-between px-3.5 py-[18px] border-t-0 text-center border-b'
        >
            <Typography component={"span"}
                className="text-base font-normal"
            >
                {groupTitle}
            </Typography>

            <Button variant='outlined' className='rounded-[5px]'> 
                Join
            </Button>

        </Box>
    )
}



export default CurrentGroups