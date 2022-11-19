
import { Grid } from '@mui/material'
import React from 'react'
import ChannelGroups from '../channelGroups/ChannelGroups'
import Sidenav from '../sidenav/Sidenav'

function Block() {
  return (
    <Grid container>
        <Grid item md={1}>
            <Sidenav/>
        </Grid>
        <Grid item md={11}>
            <ChannelGroups/>
        </Grid>
    </Grid>
  )
}

export default Block