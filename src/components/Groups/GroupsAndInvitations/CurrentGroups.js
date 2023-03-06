import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Typicode from "likeminds-chat-beta";
import {
  createNewClient,
  getChatRoomDetails,
  getTaggingList,
  getUnjoinedRooms,
  joinChatRoom,
  markRead,
} from "../../../sdkFunctions";
import { myClient, UserContext } from "../../..";
import { Link, NavLink } from "react-router-dom";
import { groupMainPath } from "../../../routes";
import cancelIcon from "../../../assets/svg/cancel.svg";
import acceptIcon from "../../../assets/svg/accept.svg";
import { GroupContext } from "../../../Main";
import {
  ChatRoomContext,
  fn,
  getUnjoinedList,
  paginateHomeFeed,
  paginateUnjoinedFeed,
} from "../Groups";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams, useNavigate } from "react-router-dom";

function CurrentGroups() {
  const [shouldOpenPublicCard, setShouldPublicCard] = useState(true);
  const { status } = useParams();
  const chatroomContext = useContext(ChatRoomContext);
  const groupContext = useContext(GroupContext);
  async function setChatroom(chatroomId) {
    try {
      const markReadCall = await markRead(chatroomId);
      // // console.log(markReadCall);
      const chatRoomData = await getChatRoomDetails(myClient, chatroomId);

      if (!chatRoomData.error) {
        const tagCall = await getTaggingList(
          chatRoomData.data.community.id,
          chatRoomData.data.chatroom.id
        );

        chatRoomData.data.membersDetail = tagCall.data.members;
        groupContext.setActiveGroup(chatRoomData.data);
        groupContext.setShowLoadingBar(false);
      } else {
        // // console.log(chatRoomData.errorMessage);
      }
    } catch (error) {}
  }
  useEffect(() => {
    // // console.log("here");
    setChatroom(status);
  }, [status]);
  return (
    <Box>
      {/*  */}
      <PublicGroup groupList={chatroomContext.chatRoomsList} />

      <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
        <span>All Public Groups</span>
        <IconButton onClick={() => setShouldPublicCard(!shouldOpenPublicCard)}>
          {!shouldOpenPublicCard ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </IconButton>
      </div>
      <Collapse
        in={shouldOpenPublicCard}
        // sx={{
        //   maxHeight: "400px",
        //   overflowY: "auto",
        // }}
      >
        <div className="max-h-[400px] overflow-auto" id="unjoinedContainer">
          <InfiniteScroll
            hasMore={true}
            next={() => {
              paginateUnjoinedFeed(
                chatroomContext.unJoined,
                chatroomContext.setUnjoined,
                chatroomContext.setShouldLoadMoreUnjoinedFeed
              );
            }}
            dataLength={chatroomContext.unJoined.length}
            scrollableTarget="unjoinedContainer"
          >
            {chatroomContext.unJoined.map((group, groupIndex) => {
              return (
                <UnjoinedGroup
                  groupTitle={group.header}
                  group={group}
                  key={group.title + groupIndex}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      </Collapse>
    </Box>
  );
}

function PublicGroup({ groupTitle, groupList }) {
  const [shouldOpen, setShouldOpen] = useState(true);
  const [loadMoreGroups, shouldLoadMoreGroups] = useState(true);
  const { status } = useParams();
  function handleCollapse() {
    setShouldOpen(!shouldOpen);
  }
  const chatroomContext = useContext(ChatRoomContext);
  const groupContext = useContext(GroupContext);

  // for gettingChatRoom()
  async function getChatRoomData(chatroomId) {
    try {
      const markReadCall = await markRead(chatroomId);
      // // console.log(markReadCall);
      const chatRoomData = await getChatRoomDetails(myClient, chatroomId);

      if (!chatRoomData.error) {
        const tagCall = await getTaggingList(
          chatRoomData.data.community.id,
          chatRoomData.data.chatroom.id
        );

        chatRoomData.data.membersDetail = tagCall.data.members;
        groupContext.setActiveGroup(chatRoomData.data);
        groupContext.setShowLoadingBar(false);
      } else {
        // // console.log(chatRoomData.errorMessage);
      }
    } catch (error) {
      // // console.log(error);
    }
  }

  return (
    <Box>
      <div
        id="homefeedContainer"
        className="max-h-[400px] overflow-auto border-b border-solid border-[#EEEEEE]"
      >
        <InfiniteScroll
          hasMore={chatroomContext.shouldLoadMoreHomeFeed}
          next={() => {
            paginateHomeFeed(
              chatroomContext.chatRoomList,
              chatroomContext.setChatRoomList,
              chatroomContext.setShouldLoadMoreHomeFeed
            );
          }}
          dataLength={chatroomContext.chatRoomList.length}
          scrollableTarget="homefeedContainer"
        >
          {chatroomContext.chatRoomList.map((group, groupIndex) => {
            return (
              <Link
                to={groupMainPath + "/" + group.chatroom.id}
                onClick={() => {
                  if (status != group.chatroom.id) {
                    groupContext.setShowLoadingBar(true);
                  } else {
                    markRead(group.chatroom.id);
                  }
                }}
                key={group.chatroom.id + groupIndex + group.chatroom.header}
              >
                <div>
                  <PublicGroupTile
                    key={group.chatroom.id + groupIndex}
                    groupTitle={group.chatroom.header}
                    group={group}
                  />
                </div>
              </Link>
            );
          })}
        </InfiniteScroll>
      </div>
    </Box>
  );
}

function PublicGroupTile({ groupTitle, group }) {
  const groupcontext = useContext(GroupContext);
  const { status } = useParams();
  return (
    <div
      className="flex justify-between py-4 px-5 border-[#EEEEEE] border-t-[1px] items-center"
      style={{
        backgroundColor: group.chatroom.id == status ? "#ECF3FF" : "#FFFFFF",
      }}
    >
      <Typography
        sx={{
          color: group.chatroom.id == status ? "#3884f7" : "#000000",
        }}
        component={"span"}
        className="text-4 text-[#323232] leading-[17px]"
      >
        {groupTitle}
        {group.chatroom?.is_secret === true ? (
          <span className="bg-[#FFEFC6] rounded-[4px] px-[6px] py-[5px] text-[#F6BD2A] line-height-[12px] text-[10px] font-medium m-1">
            Private
          </span>
        ) : null}
      </Typography>

      {group.unseen_conversation_count > 0 && group.chatroom.id !== status ? (
        <span className="text-[#3884f7] text-xs">
          {group.unseen_conversation_count} new messages
        </span>
      ) : null}
    </div>
  );
}

function UnjoinedGroup({ groupTitle, group }) {
  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const chatroomContext = useContext(ChatRoomContext);
  const navigate = useNavigate();
  async function joinGroup() {
    try {
      groupContext.setShowLoadingBar(true);
      let call = await joinChatRoom(
        group.id,
        userContext.currentUser.id,
        groupContext.refreshContextUi
      );
      if (!call.error) {
        navigate(groupMainPath + "/" + group.id);
      }

      // console.log(call);
    } catch (error) {
      // // console.log(error);
    }
  }

  return (
    <div className="flex justify-between leading-5 py-4 px-5 border-[#EEEEEE] border-t-[1px]">
      <Typography
        sx={{
          marginTop: "6px",
        }}
        component={"span"}
        className="text-base font-normal"
      >
        {groupTitle}
      </Typography>
      {!group.follow_status ? (
        <Button
          variant="outlined"
          className="rounded-[5px]"
          onClick={joinGroup}
        >
          Join
        </Button>
      ) : null}
    </div>
  );
}

export default CurrentGroups;

function GroupInviteTile({ title, groupType, getChatRoomData }) {
  return (
    <div
      className="bg-white flex justify-between p-[18px] border-b border-[#EEEEEE]"
      onClick={() => {
        getChatRoomData("none");
      }}
    >
      <Box>
        <Typography
          variant="body2"
          className="text-[#ADADAD] text-xs text-left font-normal"
        >
          You have been invited to
        </Typography>

        <Typography
          component={"p"}
          className="text-[#323232] text-base font-normal"
        >
          {title}
          {groupType === "private" ? (
            <span className="bg-[#FFEFC6] rounded-[4px] px-[6px] py-[5px] text-[#F6BD2A] line-height-[12px] text-[10px] font-medium m-1">
              Private
            </span>
          ) : null}
        </Typography>
      </Box>

      <Box>
        <IconButton disableRipple={true}>
          <img src={cancelIcon} alt="cancel" />
        </IconButton>

        <IconButton disableRipple={true}>
          <img src={acceptIcon} alt="accept" />
        </IconButton>
      </Box>
    </div>
  );
}
