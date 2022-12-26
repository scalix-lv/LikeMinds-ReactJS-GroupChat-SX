import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import SearchBarContainer from "../../SearchBar/SearchBar";
import searchIcon from "./../../../assets/search.png";
function SearchBarDirectMessages() {
  const [searchString, setSearchString] = useState("");
  const [shouldOpen, setShouldOpen] = useState(false);

  function callToApi() {
    return null;
  }

  useEffect(() => {
    let S_Length = searchString.length;
    if (!Boolean(S_Length % 3)) {
      callToApi();
    }
  }, [searchString]);

  return (
    <div>
      <div
        className="h-[100%] w-[100%] absolute top-[72px] overflow-hidden"
        onClick={() => {
          setShouldOpen(false);
        }}
        style={{
          background: shouldOpen ? "rgba(0,0,0, 0.5)" : "none",
          zIndex: shouldOpen ? 0 : -100,
        }}
      />
      <Box className="pt-1.5 px-4 pb-1.5 relative  flex justify-between my-3 mx-0">
        <TextField
          className="mr-4"
          InputProps={{
            startAdornment: (
              <InputAdornment className="mr-2" position="start">
                {/* <SearchIcon className='text-black'/> */}
                <img src={searchIcon} className="w-[20px] h-[20px]" />
              </InputAdornment>
            ),
            endAdornment:
              searchString.length > 1 ? (
                <InputAdornment className="mr-1" position="end">
                  <CloseIcon />
                </InputAdornment>
              ) : null,
            sx: {
              fontFamily: "Lato",
            },

            className: "bg-[#F5F5F5] w-[310px] text-md leading-3 p-1",
            inputProps: {
              style: {
                padding: "8px",
              },
            },
          }}
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
            console.log(searchString);
            if (!shouldOpen) {
              if (searchString.length > 0) {
                setShouldOpen(true);
              }
            }
          }}
        />
        <IconButton
          disableRipple={true}
          className="p-3 border border-[#F5F5F5] p-2 border mx-3 my-0 "
          sx={{
            border: "1px solid #EEEEEE",
            borderRadius: "5px",
          }}
        >
          <FilterListIcon
            fontSize="large"
            className="text-[40px] font-light text-[#000000] "
          />
        </IconButton>
        <Collapse
          in={shouldOpen}
          className="absolute w-[100%] h-[100%] mt-16 bg-white z-10"
        >
          <SearchBarContainer />
        </Collapse>
      </Box>
    </div>
  );
}

export default SearchBarDirectMessages;
