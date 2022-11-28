import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

function SearchBarDirectMessages() {

  const [searchString, setSearchString] = useState("")

  return (
    <Box className='pt-1.5 px-4 pb-1.5  flex justify-between my-3 mx-0'
    >
      <TextField 
        className='mr-4'
        InputProps={{
          startAdornment: (
            <InputAdornment className='mr-2'>
              <SearchIcon className='text-black'/>
            </InputAdornment>
          ),
          endAdornment: searchString.length > 1 ? (
            <InputAdornment className='mr-8'>
              <CloseIcon />
            </InputAdornment>
          ): null,
          sx: {
            fontFamily: "Lato",
            
          },

          className: "bg-[#F5F5F5] w-[310px] text-md leading-3 p-1",
          inputProps:{
            style: {
              padding: "8px"
            }
          }
          
        }}
        
        value={searchString}
        onChange={(e)=>{
          setSearchString(e.target.value)
        }}
        />
        <IconButton
        disableRipple={true}
        className="p-3 border-0.5 border-[#F5F5F5] rounder-[12px] mx-3 my-0"
        >
          <FilterListIcon className='text-[32px] text-[#000000]'/>
        </IconButton>
    </Box>
  )
}

export default SearchBarDirectMessages