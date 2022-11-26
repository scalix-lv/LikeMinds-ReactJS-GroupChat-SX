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

        <Box className='flex'>
            <TitleBox>
                <TitleArea title={headerProps.title} memberCount={headerProps.memberCount} />
                <Gap />
                <OptionArea />
            </TitleBox>
            <Box className='flex'/>
        </Box>

    )
}

function TitleArea({ title, memberCount }) {
    return (
        <Box className='text-left'>

            {/* For Group Title */}
            <span component={'p'}
            className="font-semibold text-xl leading-6"
            sx={{
                fontFamily: "Lato",
            }}>{title ? title : null}</span>


            {/* For Group Members */}

            <Typography component={'p'}
            className="text-sm font-normal leading-[14.5px]"
            sx={{
                fontFamily: "Lato",
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