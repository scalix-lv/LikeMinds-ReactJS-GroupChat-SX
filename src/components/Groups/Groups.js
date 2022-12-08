
import { Grid } from '@mui/material'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import CurrentGroups from './GroupsAndInvitations/CurrentGroups'
import SearchbarGroups from './SearchBar/SearchBarGroups'
import Tittle from '../groupChatArea/tittle/Tittle'
import { StyledBox } from '../groupChatArea/GroupChatArea'

export const GroupContext = React.createContext({
  activeGroup: {},
  setActiveGroup: () => { }
})


function Groups() {

  const [activeGroup, setActiveGroup] = useState({})

  return (
    <GroupContext.Provider
      value={{
        activeGroup: activeGroup,
        setActiveGroup: setActiveGroup
      }}
    >
      <Grid container>

        <Grid item xs={4} className="text-center border-gray border">

          {/* Search Bar */}
          <SearchbarGroups />

          {/* Current private groups and intivations */}
          <CurrentGroups />


          {/* All Public Groups */}
        </Grid>

        <Grid item xs={8}>

          <StyledBox>

            <Tittle headerProps={{
              title: "Founders Social",
              memberCount: 5
            }} />

            <Outlet />

          </StyledBox>
          {/* <GroupChatArea/> */}

        </Grid>

      </Grid>
      
    </GroupContext.Provider>
  )
}

export default Groups