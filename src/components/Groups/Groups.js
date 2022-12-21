import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CurrentGroups from "./GroupsAndInvitations/CurrentGroups";
import SearchbarGroups from "./SearchBar/SearchBarGroups";
import Tittle from "../groupChatArea/tittle/Tittle";
import { StyledBox } from "../groupChatArea/GroupChatArea";
import "./Groups.css";
export const GroupContext = React.createContext({
  activeGroup: {},
  setActiveGroup: () => {},
  refreshContextUi: () => {},
});

function Groups() {
  const [activeGroup, setActiveGroup] = useState({});
  const [refreshState, setRefreshState] = useState(true);
  function refreshGroups() {
    console.log("hello refreshing the state");
    setRefreshState(!refreshState);
  }
  return (
    <GroupContext.Provider
      value={{
        activeGroup: activeGroup,
        setActiveGroup: setActiveGroup,
        refreshContextUi: refreshGroups,
      }}
    >
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
    </GroupContext.Provider>
  );
}

export default Groups;
