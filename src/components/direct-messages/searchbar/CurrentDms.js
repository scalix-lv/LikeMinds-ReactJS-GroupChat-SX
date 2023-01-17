import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { DmContext } from "../DirectMessagesMain";
import { Link } from "react-router-dom";
import {
  allChatroomMembersDm,
  canDirectMessage,
  dmChatFeed,
  getChatRoomDetails,
  markRead,
} from "../../../sdkFunctions";
import { directMessageChatPath } from "../../../routes";
import DmMemberTile from "../DmMemberTile";
import InfiniteScroll from "react-infinite-scroll-component";

import { myClient, UserContext } from "../../..";

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
  const [shouldContinuePaginateHomeFeed, setShouldContinuePaginateHomeFeed] = useState(true)
  const [lastPageHomeFeed, setLastPageHomeFeed] = useState(1);
  const [feedObjects, setFeedObjects] = useState({})
  function joinFeed(oldArray, newArray, serialObject){
    serialObject = {...serialObject}
    console.log(newArray.length)
    for(let feed of newArray){
      let roomId = feed.chatroom.id
      console.log("A")
      if(serialObject[roomId] === undefined){
        console.log("B")
        serialObject[roomId] = true
        oldArray.push(feed)
      }
      
      
    }
    setFeedObjects(serialObject)
    return oldArray
  }
  async function loadHomeFeed(pageNo) {
    try {
      let oldArr = [...dmContext.homeFeed]
      let feedCall = await dmChatFeed(userContext_LM.community.id, pageNo);
      let newFeedArray = feedCall.data.dm_chatrooms;
      if(newFeedArray.length < 10){
        setShouldContinuePaginateHomeFeed(false)
      }
      newFeedArray = joinFeed(oldArr, newFeedArray, feedObjects)
      dmContext.setHomeFeed(newFeedArray);
    } catch (error) {
      console.log(error);
    }
  }

  async function paginateHomeFeed(){
    try {
      let currentHomeFeed = [...dmContext.homeFeed]
      const pageNo = currentHomeFeed.length/10
      const call = await loadHomeFeed(pageNo+1)
    } catch (error) {
      console.log(error)
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
      console.log(error);
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
      console.log(error);
    }
  }
  async function markReadCall(chatroomId) {
    try {
      await markRead(chatroomId);
      let call = await getChatRoomDetails(myClient, chatroomId);
      dmContext.setCurrentChatroom(call.data.chatroom);
      dmContext.setCurrentProfile(call.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (sessionStorage.getItem("dmContext") !== null) {
      console.log(dmContext);
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

  useEffect(() => {
    loadHomeFeed(1);
    loadAllDmMembers();
    function refreshContext() {
      loadHomeFeed(1);
      loadAllDmMembers();
    }
    dmContext.setRefreshContext(() => refreshContext);
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
        scrollableTarget="hf-container">
        {dmContext.homeFeed.map((feed, feedIndex) => {
          return (
            <DmTile
              profile={feed}
              key={feedIndex}
              loadHomeFeed={loadHomeFeed}
            />
          );
        })}
        </InfiniteScroll>
      </div>
      

      {}
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
            // loader={<h4>loading</h4>}
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
                />
              );
            })}
          </InfiniteScroll>
        </div>
      </Collapse>
    </Box>
  );
}

function DmTile({ profile, loadHomeFeed }) {
  const dmContext = useContext(DmContext);
  const userContext_LM = useContext(UserContext);

  const [shouldNotShow, setShouldNotShow] = useState(false)
  async function markReadCall(chatroomId) {
    try {
      let markCall = await markRead(chatroomId);
      if(markCall.data.success){
        setShouldNotShow(true)
      }
      loadHomeFeed(1);

      let call = await getChatRoomDetails(myClient, chatroomId);
      dmContext.setCurrentChatroom(call.data.chatroom);
      dmContext.setCurrentProfile(call.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function setProfile() {
    console.log(profile);
    try {
      if (profile.unseen_conversation_count > 0) {
        await markRead(profile.chatroom.id);
        await loadHomeFeed(1);
      }
      sessionStorage.setItem("currentChatRoomKey", profile.chatroom.id)
      
      let call = await getChatRoomDetails(myClient, profile.chatroom.id);
      // dmContext.setCurrentProfile(call.data);
      // dmContext.setCurrentChatroom(call.data.chatroom);
      await markReadCall(profile.chatroom.id)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Link
      to={directMessageChatPath}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        onClick={setProfile}
        className="flex justify-between py-[16px] px-[20px] border-t border-solid border-[#EEEEEE] cursor-pointer"
        style={{
          backgroundColor:
            dmContext?.currentChatroom?.id === profile?.chatroom?.id
              ? "#ECF3FF"
              : "#FFFFFF",
        }}
      >
        <Typography
          component={"span"}
          className="text-base font-normal"
          sx={{
            color:
              dmContext?.currentChatroom?.id === profile?.chatroom?.id
                ? "#3884F7"
                : "#323232",
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
            color:profile.unseen_conversation_count != undefined ?
              (profile.unseen_conversation_count > 0 ? "#3884F7" : "#323232") : profile.unread_messages != undefined ? (
                profile.unread_messages > 0 ? "#3884F7" : "#323232"
              ) : "white",
            display: shouldNotShow ? "none" : 'inline'
          }}
        >
          {profile.unseen_conversation_count != undefined  ? (
            profile.unseen_conversation_count > 0 ? 
            <>{profile.unseen_conversation_count} new messages</>
            :null
          ) : profile.unread_messages != undefined ? (
            profile.unread_messages > 0 ? <>{profile.unread_messages} new messages</> : null
          ) : null
         }
        </Typography>
      </div> 
    </Link>
  );
}

function DmInviteTile({ title, handleCurrentProfile, profile }) {
  const sampleClick = () => {
    console.log("hello");
  };
  return (
    <div
      onClick={() => {
        handleCurrentProfile(profile);
      }}
      className="bg-white flex justify-between py-[16px] px-[20px] border-t border-solid border-[#EEEEEE] cursor-pointer"
    >
      <Box>
        <Typography
          variant="body2"
          className="text-[#ADADAD] text-sm text-left font-normal"
        >
          Wish to connect
        </Typography>

        <Typography
          component={"p"}
          className="text-[#323232] text-base font-normal"
        >
          {title}
        </Typography>
      </Box>

      <Box>
        <IconButton disableRipple={true}>
          <CloseIcon
            fontSize="large"
            className="bg-[#F9F9F9] text-[#ADADAD] p-2 rounded-full text-[2rem]"
          />
        </IconButton>

        <IconButton disableRipple={true}>
          <DoneIcon
            fontSize="large"
            className="bg-[#E0FFDF] text-[#83D381] p-2 rounded-full text-[2rem]"
          />
        </IconButton>
      </Box>
    </div>
  );
}

function MemberTile({ groupTitle }) {
  const [shouldOpen, setShouldOpen] = useState(true);
  function handleCollapse() {
    setShouldOpen(!shouldOpen);
  }

  const publicGroups = Array(10).fill({
    groupTitle: "Person",
  });

  return (
    <Box>
      <Box className="flex justify-between px-3.5 py-[18px] border border-gray">
        <Typography component={"span"} className="text-4 font-medium">
          All Members
        </Typography>

        <IconButton onClick={handleCollapse}>
          {!shouldOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </IconButton>
      </Box>
      <Collapse
        in={shouldOpen}
        className="border border-solid border-[#EEEEEE]"
      >
        {publicGroups.map((group, groupIndex) => {
          return (
            <NotAddedMemberTile
              key={group.groupTitle + groupIndex}
              groupTitle={group.groupTitle + " " + groupIndex}
            />
          );
        })}
      </Collapse>
    </Box>
  );
}

function NotAddedMemberTile({ groupTitle }) {
  return (
    <Box className="flex justify-between px-3.5 py-[16px] px-[20px] border-t-0 text-center border-b">
      <Typography component={"span"} className="text-base font-normal">
        {groupTitle}
      </Typography>

      <Button variant="outlined">JOIN</Button>
    </Box>
  );
}

export default CurrentDms;
