import React, { useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import CurrentGroups from "./GroupsAndInvitations/CurrentGroups";
import SearchbarGroups from "./SearchBar/SearchBarGroups";
import Tittle from "../groupChatArea/tittle/Tittle";
import { StyledBox } from "../groupChatArea/GroupChatArea";
import "./Groups.css";
import { Button } from "@mui/material";
import { GroupContext } from "../../Main";

function Groups() {
  const groupContext = useContext(GroupContext);
  useEffect(() => {
    console.log(sessionStorage);
    console.log(groupContext);
    if (Object.keys(groupContext.activeGroup).length == 0) {
      // console.log("here");
      if (sessionStorage.getItem("groupContext")) {
        console.log("here");
        let c = JSON.parse(sessionStorage.getItem("groupContext"));
        console.log(c);
        groupContext.setActiveGroup(c);
      }
    } else {
      console.log("idhar bhi aa agye");
      sessionStorage.setItem(
        "groupContext",
        JSON.stringify(groupContext.activeGroup)
      );
    }
  });
  return (
    <div>
      {/* <Button
        fullWidth
        onClick={() => {
          console.log(groupContext);
          console.log(sessionStorage);
        }}
      >
        LOAD
      </Button> */}
      <div className="flex overflow-hidden customHeight flex-1">
        <div className="flex-[.32] customScroll bg-white border-r-[1px] border-[#eeeeee] pt-[20px]">
          {/* Search Bar */}
          <SearchbarGroups />

          {/* Current private groups and intivations */}
          <CurrentGroups />

          {/* All Public Groups */}
        </div>
        <div className="flex-[.68] bg-[#f9f6ff] relative pt-[42px]">
          <Outlet />

          {/* <GroupChatArea/> */}
        </div>
      </div>
    </div>
  );
}

export default Groups;
