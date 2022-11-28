import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AcceptTheirInviteFirst from './AcceptTheirInviteFirst'
import { profileListSample } from './constantsDirectMessages'
import LetThemAcceptInvite from './LetThemAcceptInvite'

import CurrentDms from './searchbar/CurrentDms'
import SearchBarDirectMessages from './searchbar/SearchBarDirectMessages'

function DirectMessagesMain() {
    const [currentProfile, setCurrentProfile] = useState({
        name: "",
        isAdded: "",
        isInvitationPending: "",
        hasInvitationSent: "",
        hasRecievedInvitation: "",
        hasUnreadMessages: "",
        totalUnread: "",
        isFriends: ""

    })
    const [profileList, setProfileList] = useState([])

    useEffect(()=>{
        setTimeout(()=>{
            setProfileList(profileListSample)
        })
    }, [])
    useEffect(()=>{
        console.log(currentProfile)
    }, [currentProfile])
    return (
        <DmContext.Provider value={{
            currentSelectedProfile: currentProfile,
            profileList: profileList,
            setCurrentProfile: setCurrentProfile
        }}>
            <Grid container className='h-full'>
                <Grid item xs={4}>
                    <SearchBarDirectMessages />
                    <CurrentDms />
                </Grid>
                <Grid xs={8} className="h-full bg-[#fffbf2]">
                    {
                        currentProfile.isAdded ? (
                            currentProfile.isFriends ? (
                                null
                            ): (
                                currentProfile.isInvitationPending ? (
                                    currentProfile.hasRecievedInvitation ? (
                                        <AcceptTheirInviteFirst title={currentProfile.name}/>
                                    ):(
                                        <LetThemAcceptInvite  title={currentProfile.name}/>
                                    )
                                ): null
                            )
                        ): null
                    }
                </Grid>
            </Grid>
        </DmContext.Provider>
    )
}

export default DirectMessagesMain


export const DmContext = React.createContext({
    currentSelectedProfile: {
        name: String,
        isAdded: Boolean,
        hasUnreadMessages: Boolean,
        isInvitationPending: Boolean,
        hasInvitationSent: Boolean,
        hasRecievedInvitation: Boolean,
        totalUnread: String,
        isFriends: Boolean
    },
    profileList: [],
    setCurrentProfile: function(){}
})