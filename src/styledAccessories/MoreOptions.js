import React, { useContext, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { leaveChatRoom } from "../sdkFunctions";
import { GroupContext } from "../components/Groups/Groups";
import { UserContext } from "..";
function MoreOptions() {
  const [open, setOpen] = useState(false);
  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);
  function closeMenu() {
    console.log("close");
    setOpen(false);
    setAnchor(null);
  }

  function leaveGroup() {
    console.log("clicking");
    leaveChatRoom(
      groupContext.activeGroup.chatroom.id,
      userContext.currentUser.id,
      groupContext.refreshContextUi
    );
  }

  const MenuBox = (
    <Menu
      anchorEl={anchor}
      onClose={() => {
        closeMenu();
      }}
      open={open}
    >
      <MenuItem>INVITE MEMBER</MenuItem>
      <MenuItem onClick={leaveGroup}>LEAVE GROUP</MenuItem>
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
        {MenuBox}
      </IconButton>
      <Menu
        anchorEl={anchor}
        onClose={() => {
          closeMenu();
        }}
        open={open}
      >
        <MenuItem>INVITE MEMBER</MenuItem>
        <MenuItem onClick={leaveGroup}>LEAVE GROUP</MenuItem>
      </Menu>
    </span>
  );
}

export default MoreOptions;
