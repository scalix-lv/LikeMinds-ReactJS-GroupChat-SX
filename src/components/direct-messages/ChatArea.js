import { Box } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect } from "react";
import ChatRoomAreaDM from "../ChatConversationsArea/ChatRoomAreaDM";
import { DmContext } from "./DirectMessagesMain";
import TittleDm from "./TitleDM";
import { config, getConversationsForGroup } from "../../sdkFunctions";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { onValue, ref } from "firebase/database";
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
  const app = initializeApp(config);
  const db = getDatabase(app);

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

  useEffect(() => {
    const query = ref(db, "collabcards");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (snapshot.exists() && Object.keys(dmContext.currentChatroom).length) {
        getChatroomConversations(dmContext.currentChatroom?.id, 500);
      }
    });
  }, []);

  return (
    <div>
      <StyledBox>
        {Object.keys(dmContext.currentChatroom).length > 0 ? (
          <TittleDm title={dmContext.currentChatroom.chatroom_with_user.name} />
        ) : null}
        <ChatRoomAreaDM />
      </StyledBox>
    </div>
  );
}

export default ChatArea;
