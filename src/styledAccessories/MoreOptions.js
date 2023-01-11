import React, { useContext, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { leaveChatRoom } from "../sdkFunctions";
import { GroupContext } from "../Main";
import { UserContext } from "..";
import leaveIcon from "../assets/svg/leave.svg";
import { useNavigate } from "react-router-dom";
import { ChatRoomContext } from "../components/Groups/Groups";
import { DmContext } from "../components/direct-messages/DirectMessagesMain";
import { directMessagePath } from "../routes";

export function MoreOptions() {
  const [open, setOpen] = useState(false);
  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);
  const chatroomContext = useContext(ChatRoomContext);
  function closeMenu() {
    setOpen(false);
    setAnchor(null);
  }

  let navigate = useNavigate();
  function leaveGroup() {
    leaveChatRoom(
      groupContext.activeGroup.chatroom.id,
      userContext.currentUser.id,
      groupContext.refreshContextUi
    )
      .then((r) => {
        // alert("s");
        groupContext.refreshContextUi();
        chatroomContext.refreshChatroomContext();
      })
      .catch((r) => {
        // alert("e");
        console.log(r);
      });

    navigate("/groups/");
  }

  const MenuBox = (
    <Menu
      anchorEl={anchor}
      onClose={() => {
        closeMenu();
      }}
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <MenuItem
        onClick={leaveGroup}
        sx={{
          fontSize: "14px",
          color: "#323232",
        }}
      >
        <img src={leaveIcon} alt="leave" className="mr-2" />
        Leave Channel
      </MenuItem>
    </Menu>
  );
  return (
    <span>
      <IconButton
        onClick={(e) => {
          setAnchor(e.currentTarget);
          setOpen(true);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      {MenuBox}
    </span>
  );
}

export function MoreOptionsDM() {
  const [open, setOpen] = useState(false);
  const dmContext = useContext(DmContext);
  const userContext = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);

  function closeMenu() {
    setOpen(false);
    setAnchor(null);
  }

  let navigate = useNavigate();
  function leaveGroup() {
    leaveChatRoom(
      dmContext.currentChatroom.id,
      userContext.currentUser.id,
      dmContext.refreshContext()
    )
      .then((r) => {
        // alert("s");
        dmContext.setCurrentChatroom({});
        navigate(directMessagePath);
      })
      .catch((r) => {
        // alert("e");
        console.log(r);
      });
  }

  const MenuBox = (
    <Menu
      anchorEl={anchor}
      onClose={() => {
        closeMenu();
      }}
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <MenuItem
        onClick={leaveGroup}
        sx={{
          fontSize: "14px",
          color: "#323232",
        }}
      >
        <img src={leaveIcon} alt="leave" className="mr-2" />
        Leave DM
      </MenuItem>
    </Menu>
  );
  return (
    <span>
      <IconButton
        onClick={(e) => {
          setAnchor(e.currentTarget);
          setOpen(true);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      {MenuBox}
    </span>
  );
}
