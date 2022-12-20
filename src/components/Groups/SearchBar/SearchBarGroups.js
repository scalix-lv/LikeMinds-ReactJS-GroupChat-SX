import { Box, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import filterIcon from "../../../assets/svg/menu.svg";
import searchIcon from "../../../assets/svg/searchBoxIcon.svg";

function SearchbarGroups() {
  const [searchString, setSearchString] = useState("");

  // className="border-[#eeeeee] border-[1px] py-[12px] px-[16px] rounded-[10px]"

  return (
    <Box className="p-[20px] flex justify-between">
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment className="mr-[16px]">
              <img src={searchIcon} alt="Search Icon" />
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
            borderRadius: "10px",
            border: "1px solid #EEEEEE",
            width: "370px",
          },
          className:
            "bg-[#F5F5F5] font-[300] text-[14px] h-[48px] max-w-[300px] w-[100%]",
        }}
        placeholder="Search for groups"
        value={searchString}
        onChange={(e) => {
          setSearchString(e.target.value);
        }}
      />
      <div className="ml-2">
        <img src={filterIcon} alt="filter icon" />
      </div>
    </Box>
  );
}

export default SearchbarGroups;
