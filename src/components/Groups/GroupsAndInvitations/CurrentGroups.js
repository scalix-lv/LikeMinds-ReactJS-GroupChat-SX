import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Typicode from "likeminds-apis-sdk";
import { createNewClient, getChatRoomDetails, getTaggingList } from "../../../sdkFunctions";
import { myClient } from "../../..";
import { Link, NavLink } from "react-router-dom";
import { groupMainPath } from "../../../routes";
import { GroupContext } from "../Groups";
import cancelIcon from "../../../assets/svg/cancel.svg";
import acceptIcon from "../../../assets/svg/accept.svg";

function CurrentGroups() {
  const [chatRoomsList, setChatRoomsList] = useState([]);

  // content to be deleted
  const groupsInfo = [
    {
      title: "Founders Social",
      newUnread: 3,
    },
    {
      title: "Socialize and Stratagize",
      newUnread: 0,
    },
  ];

  const groupsInviteInfo = [
    {
      title: "Founders Social",
      groupType: "private",
    },
    {
      title: "Socialize and Stratagize",
      groupType: "private",
    },
  ];

  // for gettingChatRoom()
  async function getChatRoomData(chatroomId) {
    try {
      const chatRoomData = await getChatRoomDetails(myClient, chatroomId);
      console.log(chatRoomData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    // loading the list of chatrooms (already joined)
    const fn = async () => {
      try {
        const feedCall = await myClient.getHomeFeedData({
          communityId: 50421,
          page: 1,
        });
        
        let chatroomlist = feedCall.my_chatrooms;
        let newChatRoomList = [...chatRoomsList];
        
        for (let chatroom of chatroomlist) {
          newChatRoomList.push(chatroom);
        }
        console.log(newChatRoomList);
        setChatRoomsList(newChatRoomList);
      } catch (error) {
        console.log(error);
      }
    };
    fn();

    
    
  }, []);

  return (
    <Box>
      {<PublicGroup groupList={chatRoomsList} />}

      {groupsInfo.map((group, groupIndex) => {
        return (
          <NavLink key={group.title + groupIndex.toString()} to={groupMainPath}>
            <GroupTile
              title={group.title}
              newUnread={group.newUnread}
              getChatRoomData={getChatRoomData}
            />
          </NavLink>
        );
      })}

      {groupsInviteInfo.map((group, groupIndex) => {
        return (
          <NavLink key={group.title + groupIndex} to={groupMainPath}>
            <GroupInviteTile
              title={group.title}
              groupType={group.groupType}
              getChatRoomData={getChatRoomData}
            />
          </NavLink>
        );
      })}

      
    </Box>
  );
}

function GroupTile({ title, newUnread, getChatRoomData }) {
  return (
    <div
      className="flex justify-between p-[18px] border-t border-b border-[#EEEEEE] bg-inherit"
      onClick={() => {
        getChatRoomData("none");
      }}
    >
      <Typography
        component={"span"}
        className="text-base font-normal"
        sx={{
          color: newUnread > 0 ? "#3884F7" : "#323232",
        }}
      >
        {title}
        {newUnread <= 0 ? (
          <span className="bg-[#FFEFC6] rounded-[4px] px-[6px] py-[5px] text-[#F6BD2A] line-height-[12px] text-[10px] font-medium m-1">
            Private
          </span>
        ) : null}
      </Typography>
      <span
        className="text-xs font-light"
        style={{
          color: newUnread > 0 ? "#3884F7" : "#323232",
        }}
      >
        {newUnread > 0 ? <>{newUnread} new messages</> : null}
      </span>
    </div>
  );
}

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
          {/* <CloseIcon className="bg-[#F9F9F9] text-[#ADADAD] p-2 rounder-full" /> */}
        </IconButton>

        <IconButton disableRipple={true}>
          <img src={acceptIcon} alt="accept" />
          {/* <DoneIcon className="bg-[#E0FFDF] text-[#83D381] p-2 rounded-full" /> */}
        </IconButton>
      </Box>
    </div>
  );
}

function PublicGroup({ groupTitle, groupList }) {
  const [shouldOpen, setShouldOpen] = useState(true);
  function handleCollapse() {
    setShouldOpen(!shouldOpen);
  }

  const groupContext = useContext(GroupContext);

  // for gettingChatRoom()
  async function getChatRoomData(chatroomId) {
    try {
      const chatRoomData = await getChatRoomDetails(myClient, chatroomId);
      if (!chatRoomData.error) {
        const tagCall = await getTaggingList(chatRoomData.data.community.id, chatRoomData.data.chatroom.id)
        console.log(tagCall)
        chatRoomData.data.membersDetail = tagCall.data.members
        groupContext.setActiveGroup(chatRoomData.data);
      } else {
        console.log(chatRoomData.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box>
      {/* <Box className="flex justify-between px-3.5 py-[18px]">
        <Typography component={"span"} className="text-4 font-medium">
          All Public Groups
        </Typography>

        <IconButton onClick={handleCollapse}>
          {!shouldOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </IconButton>
      </Box> */}
      <Collapse
        in={shouldOpen}
        className="border-b border-solid border-[#EEEEEE]"
      >
        {groupList.map((group, groupIndex) => {
          return (
            <Link
              to={groupMainPath}
              onClick={() => {
                getChatRoomData(group.chatroom.id);
              }}
            >
              <div>
                <PublicGroupTile
                  key={group.chatroom.id + groupIndex}
                  groupTitle={group.chatroom.header}
                />
              </div>
            </Link>
          );
        })}
      </Collapse>
    </Box>
  );
}

function PublicGroupTile({ groupTitle }) {
  const groupcontext = useContext(GroupContext)
  return (
    <Box className="flex justify-between px-3.5 py-[18px] border-t-0 text-center border-b" 
    sx={{
      backgroundColor: groupTitle === groupcontext.activeGroup.chatroom?.header ? '#ECF3FF' : "#FFFFFF"
    }}>
      <Typography 
      sx={{
        color: groupTitle === groupcontext.activeGroup.chatroom?.header ? '#3884f7' : "#000000"
      }}
      component={"span"} className="text-base font-normal">
        {groupTitle}
      </Typography>

      {/* <Button variant='outlined' className='rounded-[5px]'> 
                Join
            </Button> */}
    </Box>
  );
}

export default CurrentGroups;
