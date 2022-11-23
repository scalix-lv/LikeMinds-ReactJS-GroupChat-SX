
import { Grid } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import ChannelGroups from '../channelGroups/ChannelGroups'
import GroupChatArea from '../groupChatArea/GroupChatArea'
import Sidenav from '../sidenav/Sidenav'
import CurrentGroups from './GroupsAndInvitations/CurrentGroups'
import SearchbarGroups from './SearchBar/SearchBarGroups'
import Tittle from '../groupChatArea/tittle/Tittle'
import { StyledBox } from '../groupChatArea/GroupChatArea'
function Groups() {
  function setHeight(){
    const t = (window.innerHeight - 72).toString() + "px"
    console.log(t)
    return t
  }
  return (
    <Grid container>
        <Grid item xs={4} sx={{
          border: "1px solid #EEEEEE",
          textAlign: "center",
          // height: setHeight()
        }}>

          {/* Search Bar */}
          <SearchbarGroups/>

          {/* Current private groups and intivations */}
          <CurrentGroups/>


          {/* All Public Groups */}
        </Grid>

        <Grid item xs={8}>
        <StyledBox>
          <Tittle headerProps={{
            title: "Founders Social",
            memberCount: 5
        }}/>
        <Outlet/>
        </StyledBox>
          {/* <GroupChatArea/> */}
          
        </Grid>
    </Grid>
  )
}

export default Groups