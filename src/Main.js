import { Grid } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import Sidenav from './components/sidenav/Sidenav'
function Main() {
    return (
        <div className='h-full '>
            <Header />
            <Grid container className='h-full' >
                <Grid item xs={1}>
                    <Sidenav />
                </Grid>
                <Grid item xs={11}>
                    <Outlet />
                </Grid>
            </Grid>

        </div>
    )
}

export default Main