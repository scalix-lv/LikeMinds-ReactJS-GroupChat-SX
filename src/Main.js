import { Grid } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import Sidenav from './components/sidenav/Sidenav'
function Main() {
    return (
        <div>
            <Header />
            <Grid container>
                <Grid item xs={1}>
                    <Sidenav/>
                </Grid>
            </Grid>
            <Outlet/>
        </div>
    )
}

export default Main