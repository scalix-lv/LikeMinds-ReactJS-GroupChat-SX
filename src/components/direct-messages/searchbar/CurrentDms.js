import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { DmContext } from "../DirectMessagesMain";
import { Link } from "react-router-dom";
import {
  allChatroomMembersDm,
  dmChatFeed,
  getChatRoomDetails,
  markRead,
} from "../../../sdkFunctions";
import { directMessageChatPath } from "../../../routes";
import DmMemberTile from "../DmMemberTile";
import InfiniteScroll from "react-infinite-scroll-component";
import { myClient, UserContext } from "../../..";
import { onValue, ref } from "firebase/database";
import { getChatroomConversations } from "../ChatArea";

function CurrentDms() {
  const dmContext = useContext(DmContext);
  const userContext_LM = useContext(UserContext);

  const [openAllUsers, setOpenAllUsers] = useState(true);
  const [totalMembersFiltered, setTotalMembersFiltered] = useState(null);
  const [lastCaughtPageAllMembers, setLastCaughtPageAllMembers] = useState(1);
  const [
    shouldContinuePaginateMembersFeed,
    setShouldContinuePaginateMembersFeed,
  ] = useState(true);
  const [shouldContinuePaginateHomeFeed, setShouldContinuePaginateHomeFeed] =
    useState(true);
  const [lastPageHomeFeed, setLastPageHomeFeed] = useState(1);
  const [feedObjects, setFeedObjects] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);

  function joinFeed(oldArray, newArray, serialObject) {
    serialObject = { ...serialObject };
    // console.log(newArray.length);
    for (let feed of newArray) {
      let roomId = feed.chatroom.id;
      // console.log("A");
      if (serialObject[roomId] === undefined) {
        // console.log("B");
        serialObject[roomId] = true;
        oldArray.push(feed);
      }
    }
    setFeedObjects(serialObject);
    return oldArray;
  }

  async function loadHomeFeed(pageNo) {
    try {
      let oldArr = [...dmContext.homeFeed];
      let feedCall = await dmChatFeed(userContext_LM.community.id, pageNo);
      let newFeedArray = feedCall.data.dm_chatrooms;
      if (newFeedArray.length < 10) {
        setShouldContinuePaginateHomeFeed(false);
      }
      newFeedArray = joinFeed(oldArr, newFeedArray, feedObjects);
      dmContext.setHomeFeed(newFeedArray);
      return newFeedArray;
    } catch (error) {
      // console.log(error);
    }
  }

  async function paginateHomeFeed() {
    try {
      let currentHomeFeed = [...dmContext.homeFeed];
      const pageNo = currentHomeFeed.length / 10;
      const call = await loadHomeFeed(pageNo + 1);
    } catch (error) {
      // console.log(error);
    }
  }

  async function loadAllDmMembers() {
    try {
      let arr = [];
      let page = 1;
      let call;
      while (arr.length < 10) {
        call = await allChatroomMembersDm(50421, page++);
        arr = [...arr, ...call.data.members];
      }
      setLastCaughtPageAllMembers(page);
      dmContext.setMembersFeed(arr);
      setTotalMembersFiltered(call.data.total_members);
    } catch (error) {
      // console.log(error);
    }
  }

  async function paginateAllMembers() {
    try {
      let call = await allChatroomMembersDm(
        userContext_LM.community.id,
        lastCaughtPageAllMembers + 1
      );
      let newArr = [...dmContext.membersFeed];
      newArr = newArr.concat(call.data.members);
      if (newArr.length == totalMembersFiltered) {
        setShouldContinuePaginateMembersFeed(false);
      }
      setLastCaughtPageAllMembers(lastCaughtPageAllMembers + 1);
      dmContext.setMembersFeed(newArr);
    } catch (error) {
      // console.log(error);
    }
  }

  // This effect will run for resetting the context like reply or reseting the input field
  useEffect(() => {
    dmContext.resetContext();
  }, [dmContext.currentProfile]);

  useEffect(() => {
    if (sessionStorage.getItem("dmContext") !== null) {
      // console.log(dmContext);
      if (
        dmContext.currentProfile != undefined &&
        Object.keys(dmContext.currentProfile)?.length
      ) {
        sessionStorage.setItem("dmContext", JSON.stringify(dmContext));
      } else {
        let c = JSON.parse(sessionStorage.getItem("dmContext"));
        dmContext.setCurrentProfile(c.currentProfile);
        dmContext.setCurrentChatroom(c.currentChatroom);
        dmContext.setCurrentChatroomConversations(
          c.currentChatroomConversations
        );
      }
    }
  });

  // this effect will run once and will load the home feed and all members feed
  useEffect(() => {
    loadHomeFeed(1);
    loadAllDmMembers();
    function refreshContext() {
      loadHomeFeed(1);
      loadAllDmMembers();
    }
    dmContext.setRefreshContext(() => refreshContext);
  }, []);

  let db = myClient.fbInstance();

  // for getting the id for the currentchatroom from the session storage
  const getCurrentChatroomID = () => {
    let l = Object.keys(dmContext.currentChatroom).length;
    if (l == 0) {
      return;
    }
    // console.log(l);
    if (l > 0) {
      return dmContext.currentChatroom.id;
    } else {
      return sessionStorage.getItem("currentChatRoomKey");
    }
  };

  // for resetting the conversation of the current chatroom
  useEffect(() => {
    const query = ref(db, "collabcards");
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        loadHomeFeed(1).then((res) => {
          if (res[0].chatroom.id === dmContext.currentChatroom.id) {
            getChatroomConversations(getCurrentChatroomID(), 500, dmContext);
          }
        });
      }
    });
  }, []);

  return (
    <Box>
      {/* <Button
        fullWidth
        onClick={() => {
          console.log(dmContext);
        }}
      >
        Show DM Context
      </Button> */}
      <div className="max-h-[400px] overflow-auto" id="hf-container">
        <InfiniteScroll
          next={paginateHomeFeed}
          dataLength={dmContext.homeFeed.length}
          hasMore={shouldContinuePaginateHomeFeed}
          scrollableTarget="hf-container"
        >
          {dmContext.homeFeed.map((feed, feedIndex) => {
            return (
              <DmTile
                profile={feed}
                key={feedIndex}
                loadHomeFeed={loadHomeFeed}
                selectedId={selectedIndex}
                setSelectedId={setSelectedIndex}
              />
            );
          })}
        </InfiniteScroll>
      </div>

      <div className="py-4 px-5 flex justify-between text-center h-[56px]">
        <span className="leading-6 text-xl">All Members</span>
        <IconButton
          onClick={() => setOpenAllUsers(!openAllUsers)}
          disableRipple
        >
          {!openAllUsers ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </IconButton>
      </div>
      <Collapse in={openAllUsers}>
        <div className="h-[400px] overflow-auto" id="mf-container">
          <InfiniteScroll
            hasMore={shouldContinuePaginateMembersFeed}
            dataLength={dmContext.membersFeed.length}
            next={paginateAllMembers}
            scrollableTarget="mf-container"
          >
            {dmContext.membersFeed.map((feed, feedIndex) => {
              if (feed.id == userContext_LM.currentUser.id) {
                return null;
              }
              return (
                <DmMemberTile
                  profile={feed}
                  profileIndex={feedIndex}
                  key={feed.id}
                  selectedId={selectedIndex}
                  setSelectedId={setSelectedIndex}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      </Collapse>
    </Box>
  );
}

function DmTile({ profile, loadHomeFeed, selectedId, setSelectedId }) {
  const dmContext = useContext(DmContext);
  const userContext_LM = useContext(UserContext);

  const [shouldNotShow, setShouldNotShow] = useState(false);

  async function markReadCall(chatroomId) {
    try {
      let markCall = await markRead(chatroomId);
      if (markCall.data.success) {
        setShouldNotShow(true);
      }
      await loadHomeFeed(1);

      let call = await getChatRoomDetails(myClient, chatroomId);
      dmContext.setCurrentChatroom(call.data.chatroom);
      dmContext.setCurrentProfile(call.data);
      dmContext.setShowLoadingBar(false);
    } catch (error) {
      // console.log(error);
    }
  }

  async function setProfile() {
    try {
      sessionStorage.setItem("currentChatRoomKey", profile.chatroom.id);
      await markReadCall(profile.chatroom.id);
    } catch (error) {
      // console.log(error);
    }
  }

  return (
    <Link
      to={directMessageChatPath}
      style={{
        textDecoration: "none",
      }}
      onClick={() => {
        dmContext.setShowLoadingBar(true);
        setSelectedId(profile.chatroom.id);
      }}
    >
      <div
        onClick={setProfile}
        className="flex justify-between py-[16px] px-[20px] border-t border-solid border-[#EEEEEE] cursor-pointer"
        style={{
          backgroundColor:
            selectedId === profile?.chatroom?.id ? "#ECF3FF" : "#FFFFFF",
        }}
      >
        <Typography
          component={"span"}
          className="text-base font-normal"
          sx={{
            color: selectedId === profile?.chatroom?.id ? "#3884F7" : "#323232",
          }}
        >
          {userContext_LM.currentUser.id === profile.chatroom.member.id
            ? profile.chatroom.chatroom_with_user.name
            : profile.chatroom.member.name}
        </Typography>

        <Typography
          component={"span"}
          className="text-sm font-light"
          sx={{
            color:
              profile.unseen_conversation_count != undefined
                ? profile.unseen_conversation_count > 0
                  ? "#3884F7"
                  : "#323232"
                : profile.unread_messages != undefined
                ? profile.unread_messages > 0
                  ? "#3884F7"
                  : "#323232"
                : "white",
            display: shouldNotShow ? "none" : "inline",
          }}
        >
          {profile.unseen_conversation_count != undefined ? (
            profile.unseen_conversation_count > 0 ? (
              <>{profile.unseen_conversation_count} new messages</>
            ) : null
          ) : profile.unread_messages != undefined ? (
            profile.unread_messages > 0 ? (
              <>{profile.unread_messages} new messages</>
            ) : null
          ) : null}
        </Typography>
      </div>
    </Link>
  );
}

export default CurrentDms;
