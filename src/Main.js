import { createTheme, Grid, ThemeProvider } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import Sidenav from './components/sidenav/Sidenav'
const newTheme = createTheme({
    typography: {
        fontFamily: ['Lato'],
        body2: {
            fontSize: "12px"
        }
        
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none"
                }
            }
        }
    }
    
    
    
})

function Main() {
    return (
        <ThemeProvider theme={newTheme}>
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
        </ThemeProvider>
    )
}

export default Main