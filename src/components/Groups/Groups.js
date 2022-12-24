import React, { useContext, useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import CurrentGroups from "./GroupsAndInvitations/CurrentGroups";
import SearchbarGroups from "./SearchBar/SearchBarGroups";
import Tittle from "../groupChatArea/tittle/Tittle";
import { StyledBox } from "../groupChatArea/GroupChatArea";
import "./Groups.css";
import { Button } from "@mui/material";
import { GroupContext } from "../../Main";
import { myClient } from "../..";
import { getUnjoinedRooms } from "../../sdkFunctions";
export const ChatRoomContext = createContext({
  chatRoomList: [],
  refreshChatroomContext: () => {},
  unJoined: [],
});

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

  const [chatRoomsList, setChatRoomsList] = useState([]);
  const [unJoined, setUnjoined] = useState([]);

  const [refreshVariable, setRefreshVariable] = useState(true);

  // for getting the list  of chatroom
  const fn = async () => {
    try {
      const feedCall = await myClient.getHomeFeedData({
        communityId: 50421,
        page: 1,
      });

      let newChatRoomList = feedCall.my_chatrooms;

      console.log(newChatRoomList);
      setChatRoomsList(newChatRoomList);
    } catch (error) {
      console.log(error);
    }
  };

  // for getting the list of unjoined grouo
  const getUnjoinedList = async (comm_id) => {
    try {
      const feedCall = await getUnjoinedRooms(comm_id);
      setUnjoined(feedCall.data.chatrooms);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // loading the list of chatrooms (already joined)

    fn();
    getUnjoinedList(50421);
  }, []);
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
      <ChatRoomContext.Provider
        value={{
          chatRoomList: chatRoomsList,
          refreshChatroomContext: () => {
            fn();
            getUnjoinedList(50421);
          },
          unJoined: unJoined,
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
      </ChatRoomContext.Provider>
    </div>
  );
}

export default Groups;
