import { Box, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect } from "react";
import ChatRoomAreaDM from "../ChatConversationsArea/ChatRoomAreaDM";

import TittleDm from "./TitleDM";
import { dmChatFeed, getConversationsForGroup } from "../../sdkFunctions";

import { onValue, ref } from "firebase/database";
import { myClient, UserContext } from "../..";
import { DmContext } from "./DirectMessagesMain";
// Exported Styled Box
export const StyledBox = styled(Box)({
  backgroundColor: "#f6f6ff",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});
export async function getChatroomConversations(chatroomId, pageNo, dmContext) {
  if (chatroomId == null) {
    return;
  }
  // console.log(chatroomId);
  let optionObject = {
    chatroomID: chatroomId,
    page: pageNo,
  };
  let response = await getConversationsForGroup(optionObject);
  if (!response.error) {
    let conversations = response.data;
    // sessionStorage.setItem("dmLastConvo", conversations[0].id);

    dmContext.setCurrentChatroomConversations(conversations);
  } else {
    // console.log(response.errorMessage);
  }
}
export async function loadHomeFeed(pageNo, dmContext, userContext) {
  try {
    let feedCall = await dmChatFeed(userContext.community.id, pageNo);
    let newFeedArray = feedCall.data.dm_chatrooms;
    dmContext.setHomeFeed(newFeedArray);
  } catch (error) {
    // console.log(error);
  }
}
function ChatArea() {
  const userContext = useContext(UserContext);
  const dmContext = useContext(DmContext);

  // useEffect(() => {
  //   let chatroomId = dmContext.currentChatroom.id;
  //   getChatroomConversations(chatroomId, 1000, dmContext);
  // }, [dmContext.currentChatroom]);

  return (
    <div>
      {
        dmContext.currentChatroom?.id != undefined &&
        dmContext.showLoadingBar == false ? (
          <StyledBox>
            {Object.keys(dmContext.currentChatroom).length > 0 ? (
              <TittleDm
                title={
                  userContext.currentUser.id ===
                  dmContext.currentChatroom.member.id
                    ? dmContext.currentChatroom.chatroom_with_user.name
                    : dmContext.currentChatroom.member.name
                }
              />
            ) : null}
            <ChatRoomAreaDM />
          </StyledBox>
        ) : dmContext.showLoadingBar === true ? (
          <StyledBox>
            <div className="flex justify-center items-center min-h-[80vh]">
              <CircularProgress />
            </div>
          </StyledBox>
        ) : (
          <div className="flex justify-center items-center min-h-[80vh]">
            Select a chatroom to start messaging
          </div>
        )
        // <div className="flex justify-center items-center min-h-screen h-full">

        // </div>
      }
    </div>
  );
}

export default ChatArea;
