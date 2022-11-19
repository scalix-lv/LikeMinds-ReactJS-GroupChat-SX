import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, InputAdornment, TextField } from '@mui/material';

function SearchBar() {
    

    const [openSearch, setOpenSearch] = useState(false)
    const closeSearchField = () => {
        setOpenSearch(false)
    }
    const openSearchField = () => {
        setOpenSearch(true)
    }
    return (
        <span>
            {!openSearch ?
                (<IconButton onClick={openSearchField} >
                    <SearchIcon />
                </IconButton>)
                :
                (
                    <SearchField closeSearchField={closeSearchField} />
                )

            }
        </span>
    )
}

function SearchField({ closeSearchField }) {
    const ref = useRef(null)
    useEffect(()=>{
        const handleOutSideClick = (e) =>{
            if(ref.current && !ref.current.contains(e.target)){
                closeSearchField()
            }
        }
        document.addEventListener('click', handleOutSideClick, true);
        return ()=>{
            document.removeEventListener('click', handleOutSideClick, true)
        }
    })
    return (
        <TextField
            ref={ref}
            InputProps={{
                startAdornment: (
                    <InputAdornment sx={{
                        marginRight: "8px"
                    }}>
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    <IconButton onClick={closeSearchField}>
                        <CloseIcon />
                    </IconButton>
                ),
                sx: {
                    fontFamily: "Lato"
                }
                
            }}
            
            sx={{
                background: "#FFFFFF",
                borderRadius: "12px",
                fontFamily: "Lato",
                padding: "0px"
            }}>

        </TextField>
    )
}

export default SearchBar