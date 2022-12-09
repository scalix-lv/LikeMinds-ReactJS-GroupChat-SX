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
});

function Groups() {
  const [activeGroup, setActiveGroup] = useState({});

  return (
    <GroupContext.Provider
      value={{
        activeGroup: activeGroup,
        setActiveGroup: setActiveGroup,
      }}
    >
      <div
        className="flex overflow-hidden"
        style={{ height: "calc(100vh - 72px)" }}
      >
        <div className="w-[540px] overflow-auto">
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
