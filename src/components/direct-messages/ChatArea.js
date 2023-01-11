import { Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect } from "react";
import ChatRoomAreaDM from "../ChatConversationsArea/ChatRoomAreaDM";
import { DmContext } from "./DirectMessagesMain";
import TittleDm from "./TitleDM";
import { dmChatFeed, getConversationsForGroup } from "../../sdkFunctions";

import { onValue, ref } from "firebase/database";
import { myClient, UserContext } from "../..";
// Exported Styled Box
export const StyledBox = styled(Box)({
  backgroundColor: "#f6f6ff",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});
function ChatArea() {
  const dmContext = useContext(DmContext);
  const userContext = useContext(UserContext);
  let db = myClient.fbInstance();

  const getChatroomConversations = async (chatroomId, pageNo) => {
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
      console.log(response.errorMessage);
    }
  };
  async function loadHomeFeed(pageNo) {
    try {
      let feedCall = await dmChatFeed(userContext.community.id, pageNo);
      let newFeedArray = feedCall.data.dm_chatrooms;
      dmContext.setHomeFeed(newFeedArray);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const query = ref(db, "collabcards");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (
        snapshot.exists() &&
        Object.keys(dmContext.currentChatroom).length > 0
      ) {
        getChatroomConversations(dmContext.currentChatroom?.id, 500);
      }
    });
  }, []);

  useEffect(() => {
    const query = ref(db, "collabcards");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (snapshot.exists()) {
        loadHomeFeed(1);
      }
    });
  }, []);

  return (
    <div>
      {dmContext.currentChatroom ? (
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
      ) : (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default ChatArea;
