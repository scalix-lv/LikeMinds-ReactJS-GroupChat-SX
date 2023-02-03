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
// import SearchIcon from "@mui/icons-material/Search";
import SearchBarContainer from "../../SearchBar/SearchBar";
// import searchIcon from "./../../../assets/search.png";

import filterIcon from "../../../assets/svg/menu.svg";
import searchIcon from "../../../assets/svg/searchBoxIcon.svg";
import { myClient } from "../../..";
function SearchBarDirectMessages() {
  const [searchString, setSearchString] = useState("");
  const [shouldOpen, setShouldOpen] = useState(false);

  async function callToApi(string) {
    try {
      let call = await myClient.searchChatroom({
        follow_status: true,
        search: string,
        page: 1,
        page_size: 5,
        search_type: "header",
      });
      // console.log(call);
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    let S_Length = searchString.length;
    if (!Boolean(S_Length % 3)) {
      callToApi(searchString);
    }
  }, [searchString]);
  return (
    <div>
      <Box className="p-[20px] flex justify-between">
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className="mr-[16px]">
                <img src={searchIcon} alt="Search Icon" />
              </InputAdornment>
            ),
            endAdornment:
              searchString.length > 1 ? (
                <InputAdornment className="mr-2" position="end">
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
    </div>
  );
}

export default SearchBarDirectMessages;
