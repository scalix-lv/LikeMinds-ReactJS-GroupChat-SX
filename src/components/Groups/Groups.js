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
      <div className="flex overflow-hidden customHeight">
        <div className="w-[540px] customScroll">
          {/* Search Bar */}
          <SearchbarGroups />

          {/* Current private groups and intivations */}
          <CurrentGroups />

          {/* All Public Groups */}
        </div>

        <div className="w-full bg-[#f6f6ff] relative">
          <Outlet />

          {/* <GroupChatArea/> */}
        </div>
      </div>
    </GroupContext.Provider>
  );
}

export default Groups;
