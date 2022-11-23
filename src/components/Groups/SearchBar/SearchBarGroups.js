import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

function SearchbarGroups() {

  const [searchString, setSearchString] = useState("")

  return (
    <Box
      sx={{
        padding: "24px 8px 6px 8px",
        display: "flex",
        justifyContent: "space-evenly",
        margin: "12px 0px"
      }}
    >
      <TextField 

        InputProps={{
          startAdornment: (
            <InputAdornment sx={{
              marginRight: "8px"
            }}>
              <SearchIcon sx={{
                color: "#000000"
              }}/>
            </InputAdornment>
          ),
          endAdornment: searchString.length > 100 ? (
            <InputAdornment sx={{
              marginRight: "8px"
            }}>
              <CloseIcon />
            </InputAdornment>
          ): null,
          sx: {
            fontFamily: "Lato",
            backgroundColor: "#F5F5F5",
            width: "310px"
          }
        }}
        
        value={searchString}
        onChange={(e)=>{
          setSearchString(e.target.value)
        }}
        />
        <IconButton
        disableRipple={true}
        sx={{
          padding: "12px",
          border: "1px solid #EEEEEE",
          borderRadius: "12px",
          margin: "0 12px",
        }}>
          <FilterListIcon sx={{
            fontSize: "32px",
            color: "#000000",
            
          }}/>
        </IconButton>
    </Box>
  )
}

export default SearchbarGroups