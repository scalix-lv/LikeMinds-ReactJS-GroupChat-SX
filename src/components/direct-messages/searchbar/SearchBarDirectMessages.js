import { Box, Collapse, IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SearchBarContainer from '../../SearchBar/SearchBar';

function SearchBarDirectMessages() {

  const [searchString, setSearchString] = useState("")
  const [shouldOpen, setShouldOpen] = useState(false)

  function callToApi(){
    return null
  }

  useEffect(()=>{
    let S_Length = searchString.length
    if(!Boolean(S_Length%3)){
      callToApi()
    }
  },[searchString])

  return (
    <div>
      <div className='h-[100%] w-[100%] absolute top-[72px] overflow-hidden' onClick={()=>{
        setShouldOpen(false)
      }} style={{background: shouldOpen ? "rgba(0,0,0, 0.5)" : 'none'}}/>
      <Box className='pt-1.5 px-4 pb-1.5 relative  flex justify-between my-3 mx-0'
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
          console.log(searchString)
          if(!shouldOpen){
            if(searchString.length > 0){
              setShouldOpen(true)
            }
          }
        }}
        />
        <IconButton
        disableRipple={true}
        className="p-3 border-0.5 border-[#F5F5F5] rounder-[12px] mx-3 my-0"
        >
          <FilterListIcon className='text-[32px] text-[#000000]'/>
        </IconButton>
        <Collapse in={shouldOpen} className="absolute w-[100%] h-[100%] mt-16 bg-white z-10" >
          <SearchBarContainer/>
        </Collapse>
    </Box>
    </div>
  )
}

export default SearchBarDirectMessages