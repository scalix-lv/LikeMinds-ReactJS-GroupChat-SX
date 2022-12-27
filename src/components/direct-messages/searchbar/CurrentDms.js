import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { DmContext } from "../DirectMessagesMain";
import { Link } from "react-router-dom";
import { allChatroomMembersDm, dmChatFeed } from "../../../sdkFunctions";
import { directMessageChatPath } from "../../../routes";
import DmMemberTile from "../DmMemberTile";

function CurrentDms() {
  const dmContext = useContext(DmContext);

  const [openAllUsers, setOpenAllUsers] = useState(true);

  async function loadHomeFeed() {
    try {
      let feedCall = await dmChatFeed(50421, 1);
      let newFeedArray = feedCall.data.dm_chatrooms;
      dmContext.setHomeFeed(newFeedArray);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadAllDmMembers() {
    try {
      let call = await allChatroomMembersDm(50421);
      dmContext.setMembersFeed(call.data.members);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("dmContext") !== null) {
      if (Object.keys(dmContext.currentProfile).length) {
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
    loadHomeFeed();
    loadAllDmMembers();
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
      {dmContext.homeFeed.map((feed, feedIndex) => {
        return <DmTile profile={feed} key={feedIndex} />;
      })}
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
        {dmContext.membersFeed.map((feed, feedIndex) => {
          return (
            <DmMemberTile
              profile={feed}
              profileIndex={feedIndex}
              key={feed.id}
            />
          );
        })}
      </Collapse>
    </Box>
  );
}

function DmTile({ profile }) {
  const dmContext = useContext(DmContext);
  function setProfile() {
    dmContext.setCurrentProfile(profile);
    dmContext.setCurrentChatroom(profile.chatroom);
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
        className="flex justify-between p-[18px] border border-solid border-[#EEEEEE] cursor-pointer"
        style={{
          backgroundColor:
            profile.unseen_conversation_count > 0 ? "#ECF3FF" : "#FFFFFF",
        }}
      >
        <Typography
          component={"span"}
          className="text-base font-normal"
          sx={{
            color:
              profile.unseen_conversation_count > 0 ? "#3884F7" : "#323232",
          }}
        >
          {profile.chatroom.member.name}
        </Typography>
        <Typography
          component={"span"}
          className="text-sm font-light"
          sx={{
            color:
              profile.unseen_conversation_count > 0 ? "#3884F7" : "#323232",
          }}
        >
          {profile.unseen_conversation_count > 0 ? (
            <>{profile.unseen_conversation_count} new messages</>
          ) : null}
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
      className="bg-white flex justify-between p-[18px] border border-solid border-[#EEEEEE] cursor-pointer"
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
    <Box className="flex justify-between px-3.5 py-[18px] border-t-0 text-center border-b">
      <Typography component={"span"} className="text-base font-normal">
        {groupTitle}
      </Typography>

      <Button variant="outlined">JOIN</Button>
    </Box>
  );
}

export default CurrentDms;
