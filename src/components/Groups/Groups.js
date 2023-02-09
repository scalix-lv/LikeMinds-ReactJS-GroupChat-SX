import React, { useContext, useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import CurrentGroups from "./GroupsAndInvitations/CurrentGroups";
import SearchbarGroups from "./SearchBar/SearchBarGroups";
import Tittle from "../groupChatArea/tittle/Tittle";
import {
  ConversationContext,
  CurrentSelectedConversationContext,
  getChatroomConversationArray,
  StyledBox,
} from "../groupChatArea/GroupChatArea";
import "./Groups.css";
import { Button } from "@mui/material";
import { GroupContext } from "../../Main";
import { communityId, myClient, UserContext } from "../..";
import {
  getAllChatroomMember,
  getChatRoomDetails,
  getUnjoinedRooms,
} from "../../sdkFunctions";
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
export const fn = async (
  chatroomList,
  setChatRoomsList,
  setShouldLoadMore,
  communityId,
  serialObject,
  setSerialObject
) => {
  try {
    const pageNoToCall = Math.floor(chatroomList.length / 10) + 1;
    const feedCall = await myClient.getHomeFeedData({
      communityId: communityId,
      page: pageNoToCall,
    });

    let oldArr = [...chatroomList];
    let newChatRoomList = joinTheHomeFeeds(
      oldArr,
      feedCall.my_chatrooms,
      serialObject,
      setSerialObject
    );
    // console.log("This is the updated list, ", oldArr);
    setChatRoomsList(newChatRoomList);
  } catch (error) {
    // console.log(error);
  }
};
const refreshHomeFeed = async (communityId, setChatRoomList) => {
  try {
    const feedCall = await myClient.getHomeFeedData({
      communityId: communityId,
      page: 0,
    });
    setChatRoomList(feedCall.my_chatrooms);
  } catch (error) {
    console.log(error);
  }
};
const joinTheHomeFeeds = (oldArr, newArr, serialObject, setSerialObject) => {
  const so = { ...serialObject };
  for (let feed of newArr) {
    if (so[feed.chatroom.id] === undefined) {
      so[feed.chatroom.id] = true;
      oldArr.push(feed);
    } else {
    }
  }
  setSerialObject(so);

  return oldArr;
};

// for getting the list of unjoined grouop
export const getUnjoinedList = async (
  unJoined,
  setUnjoined,
  setShouldLoadMore,
  communityId,
  pageNo
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
    // console.log(error);
  }
};

function Groups() {
  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const [serialObject, setSerialObject] = useState({});
  const [chatRoomsList, setChatRoomsList] = useState([]);
  const [unJoined, setUnjoined] = useState([]);
  const [shouldLoadMoreHomeFeed, setShouldLoadMoreHomeFeed] = useState(true);
  const [shouldLoadMoreUnjoinedFeed, setShouldLoadMoreUnjoinedFeed] =
    useState(true);
  const [conversationsArray, setConversationArray] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [conversationObject, setConversationObject] = useState({});
  const [memberList, setMemberList] = useState([]);
  useEffect(() => {
    if (Object.keys(groupContext.activeGroup).length == 0) {
      if (sessionStorage.getItem("groupContext")) {
        let c = JSON.parse(sessionStorage.getItem("groupContext"));

        groupContext.setActiveGroup(c);
      }
    } else {
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
    if (Object.keys(groupContext.activeGroup).length === 0) {
      // console.log("hello");
    } else {
      fn(
        chatRoomsList,
        setChatRoomsList,
        setShouldLoadMoreHomeFeed,
        userContext.community.id,
        serialObject,
        setSerialObject
      );
      // console.log(groupContext);
      if (unJoined.length == 0) {
        return;
      }
      getChatRoomDetails(myClient, groupContext.activeGroup.chatroom.id).then(
        (res) => {
          if (res.data) {
            let unJoineds = [...unJoined];
            for (let uc of unJoineds) {
              if (uc.id == res.data.chatroom.id) {
                uc.follow_status = true;
              }
            }
            setUnjoined(unJoineds);
          }
        }
      );
    }
  }, [groupContext.activeGroup]);

  useEffect(() => {
    // loading the list of chatrooms (already joined)

    fn(
      chatRoomsList,
      setChatRoomsList,
      setShouldLoadMoreHomeFeed,
      userContext.community.id,
      serialObject,
      setSerialObject
    );
    getUnjoinedList(
      unJoined,
      setUnjoined,
      setShouldLoadMoreUnjoinedFeed,
      userContext.community.id
    );
  }, []);

  useEffect(() => {
    async function getAllMembers() {
      let cont = true;
      let list = [];
      let pgNo = 1;
      while (cont) {
        let call = await myClient.allMembers({
          chatroom_id: groupContext.activeGroup.chatroom.id,
          community_id: groupContext.activeGroup.community.id,
          page: pgNo,
        });

        list = list.concat(call.members);
        pgNo = pgNo + 1;
        if (call.members.length < 11) {
          cont = false;
        }
      }
      if (
        JSON.stringify(groupContext.activeGroup.members) !==
        JSON.stringify(list)
      ) {
        let obj = { ...groupContext.activeGroup };
        obj.members = list;

        groupContext.setActiveGroup(obj);
      }
    }
    getAllMembers();
  }, [groupContext.activeGroup]);

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
              // fn(chatRoomsList, setChatRoomsList, setShouldLoadMoreHomeFeed);
              refreshHomeFeed(
                groupContext.activeGroup.community.id,
                setChatRoomsList
              );
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
              refreshConversationArray: getChatroomConversationArray,
            }}
          >
            <div className="flex overflow-hidden customHeight flex-1">
              <div className="flex-[.32] bg-white border-r-[1px] border-[#eeeeee] pt-[20px] overflow-auto feed-panel relative">
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
