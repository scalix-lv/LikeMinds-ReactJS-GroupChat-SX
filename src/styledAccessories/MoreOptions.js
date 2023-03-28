import React, { useContext, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Snackbar } from "@mui/material";
import {
  getChatRoomDetails,
  getConversationsForGroup,
  leaveChatRoom,
  leaveSecretChatroom,
  log,
} from "../sdkFunctions";
import { GroupContext } from "../Main";
import { myClient, UserContext } from "..";
import leaveIcon from "../assets/svg/leave.svg";
import { useNavigate } from "react-router-dom";
import { ChatRoomContext } from "../components/Groups/Groups";
import { DmContext } from "../components/direct-messages/DirectMessagesMain";
import { directMessageInfoPath, directMessagePath } from "../routes";

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
  async function muteNotifications(id) {
    try {
      let call = await myClient.muteNotification({
        chatroom_id: groupContext.activeGroup.chatroom.id,
        value: id == 6 ? true : false,
      });
      closeMenu();
      let refreshCall = await getChatRoomDetails(
        myClient,
        groupContext.activeGroup.chatroom.id
      );
      groupContext.activeGroup(refreshCall.data);
    } catch (error) {
      log(error);
    }
  }

  let navigate = useNavigate();
  function leaveGroup() {
    if (!!groupContext.activeGroup.chatroom.is_secret) {
      leaveSecretChatroom(
        groupContext.activeGroup.chatroom.id,
        userContext.currentUser.id
      )
        .then((r) => {
          chatroomContext.refreshChatroomContext();
        })
        .catch((r) => {});

      navigate("/groups/");
    } else {
      leaveChatRoom(
        groupContext.activeGroup.chatroom.id,
        userContext.currentUser.id
      )
        .then((r) => {
          chatroomContext.refreshChatroomContext();
        })
        .catch((r) => {});

      navigate("/groups/");
    }
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
      {groupContext.activeGroup.chatroom_actions.map((item) => {
        if (item.id === 2) {
          return null;
        }
        return (
          <MenuItem
            key={item.id}
            onClick={() => {
              if (item.id === 6 || item.id === 8) {
                muteNotifications(item.id);
              } else if (item.id === 15) {
                leaveGroup();
              }
            }}
            sx={{
              fontSize: "14px",
              color: "#323232",
            }}
          >
            {/* <img src={leaveIcon} alt="leave" className="mr-2" /> */}
            {item.title}
          </MenuItem>
        );
      })}
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

async function getChatroomConversations(chatroomId, pageNo, dmContext) {
  if (chatroomId == null) {
    return;
  }
  // // console.log(chatroomId);
  let optionObject = {
    chatroomID: chatroomId,
    page: pageNo,
  };
  let response = await getConversationsForGroup(optionObject);
  if (!response.error) {
    let conversations = response.data;
    let conversationToBeSetArray = [];
    let newConversationArray = [];
    let lastDate = "";
    for (let convo of conversations) {
      if (convo.date === lastDate) {
        conversationToBeSetArray.push(convo);
        lastDate = convo.date;
      } else {
        if (conversationToBeSetArray.length != 0) {
          newConversationArray.push(conversationToBeSetArray);
          conversationToBeSetArray = [];
          conversationToBeSetArray.push(convo);
          lastDate = convo.date;
        } else {
          conversationToBeSetArray.push(convo);
          lastDate = convo.date;
        }
      }
    }
    newConversationArray.push(conversationToBeSetArray);
    dmContext.setCurrentChatroomConversations(newConversationArray);
  } else {
    // // console.log(response.errorMessage);
  }
}
export function MoreOptionsDM() {
  const [open, setOpen] = useState(false);
  const dmContext = useContext(DmContext);
  const userContext = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
        dmContext.setCurrentChatroom({});
        navigate(directMessagePath);
      })
      .catch((r) => {
        log(r);
      });
  }

  async function muteNotifications(id) {
    try {
      let call = await myClient.muteNotification({
        chatroom_id: dmContext.currentChatroom.id,
        value: id == 6 ? true : false,
      });

      closeMenu();
      let refreshCall = await getChatRoomDetails(
        myClient,
        dmContext.currentChatroom.id
      );
      dmContext.setCurrentChatroom(refreshCall.data.chatroom);
      dmContext.setCurrentProfile(refreshCall.data);
      setShowSnackBar(true);
      setSnackbarMessage("Notifications " + (id == 6 ? "muted" : "unmuted"));
    } catch (error) {
      // // console.log(error);
    }
  }
  async function block(id) {
    let call = await myClient.blockCR({
      chatroom_id: dmContext.currentChatroom.id,
      status: id === 27 ? 0 : 1,
    });
    closeMenu();
    let callRefresh = await getChatroomConversations(
      dmContext.currentChatroom.id,
      1000,
      dmContext
    );

    let callChatroomRefresh = await getChatRoomDetails(
      myClient,
      dmContext.currentChatroom.id
    );
    dmContext.setCurrentChatroom(callChatroomRefresh.data.chatroom);
    dmContext.setCurrentProfile(callChatroomRefresh.data);
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
      {dmContext.currentProfile.chatroom_actions.map((option, optionIndex) => {
        return (
          <MenuItem
            key={option.id}
            onClick={() => {
              if (option.id === 6 || option.id === 8) {
                muteNotifications(option.id);
              } else if (option.id == 27) {
                block(option.id);
              } else {
                navigate(directMessageInfoPath, {
                  state: {
                    memberId:
                      userContext.currentUser.id ===
                      dmContext.currentChatroom.member.id
                        ? dmContext.currentChatroom.chatroom_with_user.id
                        : dmContext.currentChatroom.member.id,
                    communityId: userContext.community.id,
                  },
                });
              }
            }}
            sx={{
              fontSize: "14px",
              color: "#323232",
            }}
          >
            {/* <img src={leaveIcon} alt="leave" className="mr-2" /> */}
            {option.title}
          </MenuItem>
        );
      })}
    </Menu>
  );
  return (
    <span
      style={{
        display:
          dmContext.currentChatroom.chat_request_state == 0 ? "none" : "inline",
      }}
    >
      <Snackbar
        open={showSnackBar}
        onClose={() => {
          setShowSnackBar(false);
        }}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
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
