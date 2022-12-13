import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import filterIcon from "../../../assets/svg/menu.svg";
import searchIcon from "../../../assets/svg/searchBoxIcon.svg";

function SearchbarGroups() {
  const [searchString, setSearchString] = useState("");

  return (
    <Box className="pt-1.5 px-4 pb-1.5  flex justify-between my-3 mx-0">
      <TextField
        className="mr-4"
        InputProps={{
          startAdornment: (
            <InputAdornment className="mr-2">
              {/* <SearchIcon className="text-black" /> */}
              <img src={searchIcon} alt="" />
            </InputAdornment>
          ),
          endAdornment:
            searchString.length > 1 ? (
              <InputAdornment className="mr-8">
                <CloseIcon />
              </InputAdornment>
            ) : null,
          sx: {
            fontFamily: "Lato",
          },

          className: "bg-[#F5F5F5] w-[270px] text-md leading-3 p-1",
          inputProps: {
            style: {
              padding: "8px",
            },
          },
        }}
        placeholder="Search for groups"
        value={searchString}
        onChange={(e) => {
          setSearchString(e.target.value);
        }}
      />
      <div className="ml-2">
        <img src={filterIcon} alt="" />
      </div>
      {/* <IconButton disableRipple={true} className="p-0 m-0"> */}
      {/* <FilterListIcon className="text-[32px] text-[#000000]" /> */}
      {/* </IconButton> */}
    </Box>
  );
}

export default SearchbarGroups;
