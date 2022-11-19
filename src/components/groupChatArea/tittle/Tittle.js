import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import React from 'react'
import Gap from '../../../styledAccessories/Gap'


import SearchBar from '../../../styledAccessories/SearchBar'
import MoreOptions from '../../../styledAccessories/MoreOptions'
const TitleBox = styled(Box)({
    display: "flex",
    borderBottom: '1px solid #ADADAD',
    width: "100%",
    marginRight: "96px",
    marginLeft: "24px",
    padding: "0 0 16px",
    marginTop: '24px'

})


function Tittle({ headerProps }) {
    return (

        <Box sx={{ display: "flex" }}>
            <TitleBox>
                <TitleArea title={headerProps.title} memberCount={headerProps.memberCount} />
                <Gap />
                <OptionArea />
            </TitleBox>
            <Box sx={{ flexGrow: 1 }} />
        </Box>

    )
}

function TitleArea({ title, memberCount }) {
    return (
        <Box sx={{
            textAlign: "left"
        }}>

            {/* For Group Title */}
            <Typography component={'p'} sx={{
                fontFamily: "Lato",
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '24px'
            }}>{title ? title : null}</Typography>


            {/* For Group Members */}

            <Typography component={'p'} sx={{
                fontFamily: "Lato",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "14.5px"
            }}>{memberCount ? memberCount : null} members</Typography>
        </Box>
    )
}

function OptionArea() {
    return (
        <Box >
            <SearchBar />
            <MoreOptions/>
        </Box>
    )
}



export default Tittle