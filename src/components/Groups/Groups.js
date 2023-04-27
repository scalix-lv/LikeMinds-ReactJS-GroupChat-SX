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
import { Button, CircularProgress } from "@mui/material";
import { GroupContext, RouteContext } from "../../Main";
import { communityId, myClient, UserContext } from "../..";
import {
  getAllChatroomMember,
  getChatRoomDetails,
  getUnjoinedRooms,
  refreshGroupFeed,
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
  feedObjects: {},
  setFeedObjects: () => {},
  lmj: Boolean,
  setLmj: () => {},
  lmu: Boolean,
  setLmu: () => {},
  setShowCircularProgress: () => {},
  showCircularProgress: Boolean,
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
    setChatRoomsList(newChatRoomList);
  } catch (error) {}
};
const refreshHomeFeed = async (setChatRoomList, setShouldLoadMoreHomeFeed) => {
  try {
    const communityId = sessionStorage.getItem("communityId");
    const feedCall = await myClient.getHomeFeedData({
      communityId: communityId,
      page: 1,
    });
    setChatRoomList(feedCall.my_chatrooms);
    setShouldLoadMoreHomeFeed(true);
  } catch (error) {
    // console.log(error);
  }
};

const refreshUnjoinedFeed = async (
  setUnjoinedFeedList,
  setShouldLoadMoreUnjoinedFeed
) => {
  try {
    let call = await getUnjoinedRooms(sessionStorage.getItem("communityId"), 1);
    setUnjoinedFeedList(call.data.chatrooms);
    setShouldLoadMoreUnjoinedFeed(true);
  } catch (error) {}
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
    let pageNoToCall = Math.floor(unJoined.length / 10) + 1;

    const feedCall = await getUnjoinedRooms(communityId, pageNoToCall);
    let newChatRoomList = unJoined.concat(feedCall.data.chatrooms);
    setUnjoined(newChatRoomList);
    if (feedCall.data.chatrooms.length < 10) {
      setShouldLoadMore(false);
    }
  } catch (error) {
    // console.log(error);
  }
};

export const paginateHomeFeed = async (
  currentHomeFeed,
  setHomeFeed,
  setShouldLoadHomeFeed
) => {
  try {
    const pageNo = Math.floor(currentHomeFeed.length / 10) + 1;
    const communityId = sessionStorage.getItem("communityId");
    const call = await myClient.getHomeFeedData({
      communityId: communityId,
      page: pageNo,
    });
    if (call.my_chatrooms.length < 10) {
      setShouldLoadHomeFeed(false);
    }
    const newHomeFeed = [...currentHomeFeed, ...call.my_chatrooms];
    setHomeFeed(newHomeFeed);
  } catch (error) {
    // console.log(error);
  }
};

export const paginateUnjoinedFeed = async (
  currentUnjoinedList,
  setUnjoinedList,
  setShouldLoadMoreUnjoinedGroup
) => {
  try {
    const pageNo = Math.floor(currentUnjoinedList.length / 10) + 1;
    const communityId = sessionStorage.getItem("communityId");
    const call = await getUnjoinedRooms(communityId, pageNo);
    if (call.data.chatrooms.length < 10) {
      setShouldLoadMoreUnjoinedGroup(false);
    }
    let newUnjoinedList = [...currentUnjoinedList, ...call.data.chatrooms];
    setUnjoinedList(newUnjoinedList);
  } catch (error) {
    // console.log(error);
  }
};

function Groups(props) {
  const { children } = props;

  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const [serialObject, setSerialObject] = useState({});
  const [feedSerialObject, setFeedSerialObject] = useState({});
  const [chatRoomsList, setChatRoomsList] = useState([]);
  const [unJoined, setUnjoined] = useState([]);
  const [shouldLoadMoreHomeFeed, setShouldLoadMoreHomeFeed] = useState(true);
  const [shouldLoadMoreUnjoinedFeed, setShouldLoadMoreUnjoinedFeed] =
    useState(true);
  const [conversationsArray, setConversationArray] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [conversationObject, setConversationObject] = useState({});
  const [memberList, setMemberList] = useState([]);
  const [feedObjects, setFeedObjects] = useState({
    secretFeed: [],
    joinedFeed: [],
    unjoinedFeed: [],
  });
  const [lmj, setLmj] = useState(true);
  const [lmu, setLmu] = useState(false);
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const routeContext = useContext(RouteContext);
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

  // useEffect(() => {
  //   // loading the list of chatrooms (already joined)
  //   fn(
  //     chatRoomsList,
  //     setChatRoomsList,
  //     setShouldLoadMoreHomeFeed,
  //     userContext.community.id,
  //     serialObject,
  //     setSerialObject
  //   );
  //   getUnjoinedList(
  //     unJoined,
  //     setUnjoined,
  //     setShouldLoadMoreUnjoinedFeed,
  //     userContext.community.id
  //   );
  // }, []);

  useEffect(() => {
    async function getAllMembers() {
      let cont = true;
      let list = [];
      let pgNo = 1;
      while (cont) {
        let call = await myClient.allMembers({
          chatroom_id: groupContext.activeGroup?.chatroom?.id,
          community_id: groupContext.activeGroup?.community?.id,
          page: pgNo,
        });
        list = list.concat(call.members);
        pgNo = pgNo + 1;
        if (call.members.length < 10) {
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
    if (groupContext?.activeGroup?.id != undefined) {
      getAllMembers();
    }
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
              // refreshHomeFeed(setChatRoomsList, setShouldLoadMoreHomeFeed);
              // refreshUnjoinedFeed(setUnjoined, setShouldLoadMoreUnjoinedFeed);
              setLmj(true);
              setLmu(false);
              refreshGroupFeed(
                feedObjects,
                setFeedObjects,
                true,
                setLmj,
                lmu,
                setLmu
              );
            },
            feedObjects: feedObjects,
            setFeedObjects: setFeedObjects,
            lmj,
            setLmj,
            lmu,
            setLmu,
            setShowCircularProgress,
            showCircularProgress,
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
              <div
                className={`flex-[.32] bg-white border-r-[1px] border-[#eeeeee] pt-[20px] overflow-auto feed-panel relative
              ${
                routeContext.isNavigationBoxOpen
                  ? "z:max-sm:flex-1 sm:max-md:flex-[.85]"
                  : "z:max-md:hidden"
              }
              `}
              >
                {/* Search Bar */}
                <SearchbarGroups />

                {/* Current private groups and intivations */}
                <CurrentGroups />

                {/* All Public Groups */}
              </div>
              {Object.keys(groupContext.activeGroup).length > 0 ? (
                <div
                  className={`flex-[.68] bg-[#FFFBF2] relative pt-[42px] ${
                    routeContext.isNavigationBoxOpen
                      ? "sm:max-md:absolute sm:max-md:z-[-1] z:max-sm:hidden"
                      : "z:max-md:flex-[1]"
                  }`}
                >
                  {/* {showCircularProgress ? <CircularProgress /> : null} */}
                  <Outlet />
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
