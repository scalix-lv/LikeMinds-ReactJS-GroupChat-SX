import React, { useContext, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { leaveChatRoom } from "../sdkFunctions";
import { GroupContext } from "../Main";
import { UserContext } from "..";
import leaveIcon from "../assets/svg/leave.svg";
import { useNavigate } from "react-router-dom";

function MoreOptions() {
  const [open, setOpen] = useState(false);
  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);

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
    );
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

export default MoreOptions;
