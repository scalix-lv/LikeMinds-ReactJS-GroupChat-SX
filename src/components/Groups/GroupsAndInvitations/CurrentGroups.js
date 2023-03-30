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
  log,
  markRead,
} from "../../../sdkFunctions";
import { myClient, UserContext } from "../../..";
import { Link, NavLink } from "react-router-dom";
import { groupMainPath, groupPath } from "../../../routes";
import cancelIcon from "../../../assets/svg/cancel.svg";
import acceptIcon from "../../../assets/svg/accept.svg";
import { GroupContext, RouteContext } from "../../../Main";
import {
  ChatRoomContext,
  fn,
  getUnjoinedList,
  paginateHomeFeed,
  paginateUnjoinedFeed,
} from "../Groups";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams, useNavigate } from "react-router-dom";
import { DmContext } from "../../direct-messages/DirectMessagesMain";
import FeedSkeleton from "../../skeletons/FeedSkeleton";

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
    if (status) {
      if (status == "" || status == null) {
        return null;
      }
      setChatroom(status);
    }
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
      <Collapse in={shouldOpenPublicCard}>
        <div className="max-h-[400px] overflow-auto" id="unjoinedContainer">
          {chatroomContext.unJoined.length == 0 ? (
            <FeedSkeleton />
          ) : (
            <InfiniteScroll
              hasMore={chatroomContext.shouldLoadMoreUnjoinedFeed}
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
          )}
        </div>
      </Collapse>
    </Box>
  );
}

function PublicGroup({}) {
  const routeContext = useContext(RouteContext);
  const { status } = useParams();
  const chatroomContext = useContext(ChatRoomContext);
  const groupContext = useContext(GroupContext);
  const [invitationListLength, setInvitationListLength] = useState(0);
  // for gettingChatRoom()
  async function getChatRoomData(chatroomId) {
    try {
      const markReadCall = await markRead(chatroomId);
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
        log(chatRoomData.errorMessage);
      }
    } catch (error) {
      log(error);
    }
  }

  return (
    <Box>
      <div
        id="homefeedContainer"
        className="min-h-[350px] max-h-[400px] overflow-auto border-b border-solid border-[#EEEEEE]"
      >
        {" "}
        {chatroomContext.chatRoomList.length === 0 ? (
          <FeedSkeleton />
        ) : (
          <InfiniteScroll
            hasMore={chatroomContext.shouldLoadMoreHomeFeed}
            next={() => {
              paginateHomeFeed(
                chatroomContext.chatRoomList,
                chatroomContext.setChatRoomList,
                chatroomContext.setShouldLoadMoreHomeFeed
              );
            }}
            dataLength={
              chatroomContext.chatRoomList.length + invitationListLength
            }
            scrollableTarget="homefeedContainer"
          >
            <InvitedGroupList
              callBack={setInvitationListLength}
              listLength={invitationListLength}
            />
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
                    routeContext.setIsNavigationBoxOpen(
                      !routeContext.isNavigationBoxOpen
                    );
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
        )}
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
  const routeContext = useContext(RouteContext);
  const navigate = useNavigate();
  async function joinGroup() {
    try {
      groupContext.setShowLoadingBar(true);
      let call = await joinChatRoom(group.id, userContext.currentUser.id);
      chatroomContext.refreshChatroomContext();
      if (!call.error) {
        navigate(groupMainPath + "/" + group.id);
      }
    } catch (error) {
      // // console.log(error);
    }
  }

  return (
    <div
      className="flex justify-between leading-5 py-4 px-5 border-[#EEEEEE] border-t-[1px]"
      onClick={() => {
        routeContext.setIsNavigationBoxOpen(!routeContext.isNavigationBoxOpen);
      }}
    >
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

function GroupInviteTile({ title, response, id }) {
  const { status } = useParams();
  const groupContext = useContext(GroupContext);
  return (
    <Link
      to={groupMainPath + "/" + id}
      onClick={() => {
        groupContext.setShowLoadingBar(true);
      }}
    >
      <div
        className="bg-white flex justify-between py-2.5 px-5 border-t border-[#EEEEEE] cursor-pointer"
        style={{
          background: id == status ? "rgb(236, 243, 255)" : "white",
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

            <span className="bg-[#FFEFC6] rounded-[4px] px-[6px] py-[5px] text-[#F6BD2A] line-height-[12px] text-[10px] font-medium m-1">
              Private
            </span>
          </Typography>
        </Box>

        <Box>
          <IconButton
            disableRipple={true}
            onClick={() => {
              response(id, 2);
            }}
            className="cursor-pointer"
          >
            <img src={cancelIcon} alt="cancel" />
          </IconButton>

          <IconButton
            disableRipple={true}
            onClick={() => response(id, 1)}
            className="cursor-pointer"
          >
            <img src={acceptIcon} alt="accept" />
          </IconButton>
        </Box>
      </div>
    </Link>
  );
}

const InvitedGroupList = ({ callBack, listLength }) => {
  const [loadMore, setLoadMore] = useState(true);
  const [list, setList] = useState([]);
  const chatroomContext = useContext(ChatRoomContext);
  const groupContext = useContext(GroupContext);
  const navigate = useNavigate();
  const getInvitations = async () => {
    try {
      let pageNo = 1;
      let shouldCall = true;
      let res = [];
      let pageSize = 10;
      while (shouldCall) {
        const call = await myClient.getInvites({
          channel_type: 1,
          page: pageNo++,
          page_size: pageSize,
        });
        const inviteArray = call.user_invites;
        res = res.concat(inviteArray);
        if (inviteArray.length < pageSize) {
          shouldCall = false;
        }
      }
      setList(res);
      callBack(res.length);
    } catch (error) {
      log(error);
    }
  };
  // not required currently as complete pagination is happening synchronously
  const refreshInvitations = async () => {
    try {
      let pageSize = 10;
      let call = await myClient.getInvites({
        channel_type: 1,
        page: 1,
        page_size: pageSize,
      });

      const inviteArray = call.user_invites;
      if (inviteArray.length < pageSize) {
        setLoadMore(false);
        // pageSize;
      }
      setList(inviteArray);
    } catch (e) {
      log(e);
    }
  };

  const invitationResponse = async (channel_id, response) => {
    try {
      const call = await myClient.inviteAction({
        channel_id: channel_id.toString(),
        invite_status: response,
      });
      chatroomContext.refreshChatroomContext();
      if (response === 2) {
        groupContext.setActiveGroup({});
        groupContext.setShowSnackBar(true);
        groupContext.setSnackBarMessage("Invitation Rejected");
        navigate(groupPath);
        return;
      }
      groupContext.setShowSnackBar(true);
      groupContext.setSnackBarMessage("Invitation Accepted");
      let chatroomDetails = await getChatRoomDetails(myClient, channel_id);
      groupContext.setActiveGroup(chatroomDetails.data);
    } catch (error) {
      groupContext.setShowSnackBar(true);
      groupContext.setSnackBarMessage("Request Failed.");
      log(error);
    }
  };
  useEffect(() => {
    getInvitations();
  }, [groupContext.activeGroup]);

  // useEffect(() => {
  //   refreshInvitations();
  // }, [groupContext.activeGroup]);

  return (
    <>
      {/* <div className="max-h-[400px]" id="invitation-groups">
        <InfiniteScroll
          dataLength={list.length}
          hasMore={loadMore}
          next={getInvitations}
          response="invitation-groups"
        > */}
      {list.map((item) => {
        return (
          <GroupInviteTile
            key={item.chatroom.id}
            title={item.chatroom.header}
            id={item.chatroom.id}
            response={invitationResponse}
          />
        );
      })}
      {/* </InfiniteScroll>
      </div> */}
    </>
  );
};
