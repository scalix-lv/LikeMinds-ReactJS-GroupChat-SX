import React, { useContext, useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import CurrentGroups from "./GroupsAndInvitations/CurrentGroups";
import SearchbarGroups from "./SearchBar/SearchBarGroups";
import Tittle from "../groupChatArea/tittle/Tittle";
import {
  ConversationContext,
  CurrentSelectedConversationContext,
  StyledBox,
} from "../groupChatArea/GroupChatArea";
import "./Groups.css";
import { Button } from "@mui/material";
import { GroupContext } from "../../Main";
import { communityId, myClient } from "../..";
import { getUnjoinedRooms } from "../../sdkFunctions";
export const ChatRoomContext = createContext({
  chatRoomList: [],
  refreshChatroomContext: () => {},
  unJoined: [],
  shouldLoadMoreHomeFeed: Boolean,
  shouldLoadMoreUnjoinedFeed: Boolean,
  setChatRoomList: () => {},
  setUnjoined: () => {},
  setShouldLoadMoreHomeFeed: () => {},
  setShouldLoadMoreUnjoinedFeed: () => {},
});

// for getting the list  of chatroom
export const fn = async (chatroomList, setChatRoomsList, setShouldLoadMore) => {
  try {
    const pageNoToCall = Math.floor(chatroomList.length / 10) + 1;
    const feedCall = await myClient.getHomeFeedData({
      communityId: communityId,
      page: pageNoToCall,
    });
    let newChatRoomList = chatroomList.concat(feedCall.my_chatrooms);

    console.log(newChatRoomList);
    setChatRoomsList(newChatRoomList);
    if (feedCall.my_chatrooms.length < 10) {
      setShouldLoadMore(false);
    }
  } catch (error) {
    console.log(error);
  }
};

// for getting the list of unjoined grouop
export const getUnjoinedList = async (
  unJoined,
  setUnjoined,
  setShouldLoadMore
) => {
  try {
    let pageNoToCall = Math.floor(unJoined.length / 5) + 1;
    const feedCall = await getUnjoinedRooms(communityId, pageNoToCall);
    let newChatRoomList = unJoined.concat(feedCall.data.chatrooms);
    setUnjoined(newChatRoomList);
    if (feedCall.data.chatrooms.length < 5) {
      setShouldLoadMore(false);
    }
  } catch (error) {
    console.log(error);
  }
};

function Groups() {
  const groupContext = useContext(GroupContext);

  const [chatRoomsList, setChatRoomsList] = useState([]);
  const [unJoined, setUnjoined] = useState([]);
  const [shouldLoadMoreHomeFeed, setShouldLoadMoreHomeFeed] = useState(true);
  const [shouldLoadMoreUnjoinedFeed, setShouldLoadMoreUnjoinedFeed] =
    useState(true);

  const [conversationsArray, setConversationArray] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [conversationObject, setConversationObject] = useState({});

  useEffect(() => {
    if (Object.keys(groupContext.activeGroup).length == 0) {
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
  }, [groupContext.activeGroup]);
  useEffect(() => {
    sessionStorage.removeItem("last_message_id");
  }, [groupContext.activeGroup]);

  useEffect(() => {
    // loading the list of chatrooms (already joined)

    fn(chatRoomsList, setChatRoomsList, setShouldLoadMoreHomeFeed);
    getUnjoinedList(unJoined, setUnjoined, setShouldLoadMoreUnjoinedFeed);
  }, []);
  return (
    <div>
      <CurrentSelectedConversationContext.Provider
        value={{
          conversationObject,
          setConversationObject,
          setIsSelected,
          isSelected,
        }}
      >
        <ChatRoomContext.Provider
          value={{
            chatRoomList: chatRoomsList,

            unJoined: unJoined,
            shouldLoadMoreHomeFeed: shouldLoadMoreHomeFeed,
            shouldLoadMoreUnjoinedFeed: shouldLoadMoreUnjoinedFeed,
            setChatRoomList: setChatRoomsList,
            setUnjoined: setUnjoined,
            setShouldLoadMoreHomeFeed: setShouldLoadMoreHomeFeed,
            setShouldLoadMoreUnjoinedFeed: setShouldLoadMoreUnjoinedFeed,
            refreshChatroomContext: () => {
              fn(chatRoomsList, setChatRoomsList, setShouldLoadMoreHomeFeed);
              getUnjoinedList(
                unJoined,
                setUnjoined,
                setShouldLoadMoreUnjoinedFeed
              );
            },
          }}
        >
          <ConversationContext.Provider
            value={{
              conversationsArray: conversationsArray,
              setConversationArray: setConversationArray,
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
              {Object.keys(groupContext.activeGroup).length > 0 ? (
                <div className="flex-[.68] bg-[#f9f6ff] relative pt-[42px]">
                  <Outlet />

                  {/* <GroupChatArea/> */}
                </div>
              ) : null}
            </div>
          </ConversationContext.Provider>
        </ChatRoomContext.Provider>
      </CurrentSelectedConversationContext.Provider>
    </div>
  );
}

export default Groups;
