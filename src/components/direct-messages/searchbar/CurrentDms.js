import { Box, Button, Collapse, IconButton, Typography } from '@mui/material'
import React, { useState, useContext } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { DmContext } from '../DirectMessagesMain';
import { Link } from 'react-router-dom';
function CurrentDms() {
    const profileContext = useContext(DmContext)
    const { profileList, setCurrentProfile, currentSelectedProfile } = profileContext

    const handleCurrentProfile = (profile) => {
        console.log(currentSelectedProfile)
        setCurrentProfile(profile)
    }
    const sampleClick = () => {
        console.log("hello")
    }
    return (
        <Box>
            {
                profileList.map((profile, profileIndex) => {
                    console.log(profile)
                    if (profile.isAdded) {
                        if (profile.isInvitationPending) {
                            if (profile.hasRecievedInvitation) {
                                return <DmInviteTile profile={profile} handleCurrentProfile={handleCurrentProfile} key={profile.name + profileIndex} title={profile.name} />
                            } else if (profile.hasInvitationSent) {
                                return <DmTile handleCurrentProfile={handleCurrentProfile} key={profile.name + profileIndex} profile={profile} />
                            }
                        } else {
                            if (profile.isFriend) {
                                return <DmTile
                                    handleCurrentProfile={handleCurrentProfile}
                                    key={profile.name + profileIndex} profile={profile} />
                            }
                        }
                    }
                })
            }
            <MemberTile />


        </Box>
    )
}

function DmTile({ profile, handleCurrentProfile }) {
    const sampleClick = () => {
        console.log("hello")
    }
    return (


        <div
            onClick={()=>{
                handleCurrentProfile(profile)
            }}
            className='flex justify-between p-[18px] border border-solid border-[#EEEEEE] cursor-pointer'
            sx={
                profile.isFriend ? ({
                    backgroundColor: profile.hasUnreadMessages > 0 ? "#ECF3FF" : "#FFFFFF",
                }) : null}

        >
            <Typography component={'span'} className="text-base font-normal"
                sx={
                    profile.isFriend ? ({
                        color: profile.hasUnreadMessages > 0 ? "#3884F7" : "#323232",
                    }) : null}
            >
                {profile.name}

            </Typography>
            <Typography component={'span'} className="text-sm font-light" sx={
                profile.isFriend ? ({
                    color: profile.hasUnreadMessages > 0 ? "#3884F7" : "#323232",
                }) : null}>
                {profile.hasUnreadMessages && profile.isFriend > 0 ? (<>{profile.totalUnread} new messages</>) : null}
            </Typography>
        </div>
    )

}


function DmInviteTile({ title, handleCurrentProfile, profile }) {
    const sampleClick = () => {
        console.log("hello")
    }
    return (
        
            <div
            onClick={()=>{
                handleCurrentProfile(profile)
            }}
            className='bg-white flex justify-between p-[18px] border border-solid border-[#EEEEEE] cursor-pointer'

        >
            <Box>
                <Typography variant='body2'
                    className="text-[#ADADAD] text-sm text-left font-normal"

                >
                    Wish to connect

                </Typography>


                <Typography component={'p'} className="text-[#323232] text-base font-normal"

                >
                    {title}

                </Typography>
            </Box>

            <Box>
                <IconButton disableRipple={true}>
                    <CloseIcon fontSize='large'
                        className='bg-[#F9F9F9] text-[#ADADAD] p-2 rounded-full text-[2rem]'
                    />
                </IconButton>

                <IconButton disableRipple={true}>
                    <DoneIcon fontSize='large'
                        className='bg-[#E0FFDF] text-[#83D381] p-2 rounded-full text-[2rem]'
                    />
                </IconButton>
            </Box>

        </div>
        
    )
}

function MemberTile({ groupTitle }) {
    const [shouldOpen, setShouldOpen] = useState(true)
    function handleCollapse() {
        setShouldOpen(!shouldOpen)
    }

    const publicGroups = Array(10).fill({
        groupTitle: "Person"
    })
    // console.log(publicGroups)
    return (
        <Box>
            <Box
                className='flex justify-between px-3.5 py-[18px] border border-gray'
            >
                <Typography component={"span"}
                    className="text-4 font-medium"
                >
                    All Members
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
                            <NotAddedMemberTile key={group.groupTitle + groupIndex} groupTitle={group.groupTitle + " " + groupIndex} />
                        )
                    })
                }
            </Collapse>
        </Box>
    )
}

function NotAddedMemberTile({ groupTitle }) {
    return (
        <Box
            className='flex justify-between px-3.5 py-[18px] border-t-0 text-center border-b'
        >
            <Typography component={"span"}
                className="text-base font-normal"
            >
                {groupTitle}
            </Typography>

            <Button variant='outlined'>
                JOIN
            </Button>

        </Box>
    )
}



export default CurrentDms