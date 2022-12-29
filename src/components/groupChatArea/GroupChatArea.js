import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import { myClient } from "../..";
import { config, getConversationsForGroup } from "../../sdkFunctions";
import RegularBox from "../channelGroups/RegularBox";
import { GroupContext } from "../../Main";
import Input from "../InputComponent/Input";
import Tittle from "./tittle/Tittle";
import { getDatabase } from "firebase/database";
import { onValue, ref as REF } from "firebase/database";
import { initializeApp } from "firebase/app";
import { ChatRoomContext } from "../Groups/Groups";
// Exported Styled Box
export const StyledBox = styled(Box)({
  backgroundColor: "#f6f6ff",
  minHeight: "100vh",
  borderTop: "1px solid #EEEEEE",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const ConversationContext = React.createContext({
  conversationsArray: [],
  setConversationArray: () => {},
});

function GroupChatArea() {
  // const [conversationContext.conversationsArray, conversationContext.setConversationArray] = useState([]);
  const chatRoomContext = useContext(ChatRoomContext);
  const conversationContext = useContext(ConversationContext);
  let groupContext = useContext(GroupContext);

  const [shouldLoadMoreChats, setShouldLoadMoreChats] = useState(true);
  // const [lastMessageId, setLastMessageId] = useState(null);
  let [msgId, setMsgId] = useState(null);
  const app = initializeApp(config);
  const db = getDatabase(app);
  const ref = useRef(null);

  // Scroll to bottom
  const updateHeight = () => {
    const el = document.getElementById("chat");
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    // scroll();
    updateHeight();
  });

  const fn = async (chatroomId, pageNo) => {
    // let pageToCall = Math.floor(conversationContext.conversationsArray.length/50) + 1?
    let optionObject = {
      chatroomID: chatroomId,
    };
    console.log(msgId);
    if (msgId !== null) {
      optionObject.conversation_id = parseInt(msgId);
      optionObject.scroll_direction = 0;
      optionObject.page = 50;
    } else {
      optionObject.page = 100;
    }

    let response = await getConversationsForGroup(optionObject);

    if (!response.error) {
      let conversations = response.data;
      if (conversations.length < 50) {
        setShouldLoadMoreChats(false);
      }
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
      console.log(response.data[0].id);
      setMsgId(response.data[0].id);
      newConversationArray.push(conversationToBeSetArray);
      conversationContext.setConversationArray(newConversationArray);
    } else {
      console.log(response.errorMessage);
    }
  };
  useEffect(() => {
    if (groupContext.activeGroup.chatroom?.id)
      fn(groupContext.activeGroup.chatroom?.id, 100);
  }, [groupContext.activeGroup]);

  useEffect(() => {
    const query = REF(db, "collabcards");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      console.log(groupContext.activeGroup);
      if (
        snapshot.exists() &&
        groupContext.activeGroup.chatroom !== undefined
      ) {
        fn(groupContext.activeGroup.chatroom?.id, 110).then((e) =>
          // chatRoomContext.refreshChatroomContext()
          {
            console.log("ASDFD");
            console.log(msgId);
          }
        );
      }
    });
  }, []);
  useEffect(() => {
    console.warn("here we are");
  }, []);
  useEffect(() => {
    console.log("the last message is" + msgId);
  }, [msgId]);
  return (
    <div>
      <Button
        fullWidth
        onClick={() => {
          console.log(msgId);
        }}
      >
        SEE TO IT
      </Button>
      {groupContext.activeGroup.chatroom?.id ? (
        <Tittle
          headerProps={{
            title: groupContext.activeGroup.chatroom.header,
            memberCount: groupContext.activeGroup.participant_count,
          }}
        />
      ) : null}
      <div
        id="chat"
        className="relative overflow-x-hidden overflow-auto"
        style={{ height: "calc(100vh - 270px)" }}
      >
        {groupContext.activeGroup.chatroom?.id !== undefined ? (
          <>
            {conversationContext.conversationsArray.map((convoArr, index) => {
              return (
                <RegularBox convoArray={convoArr} key={convoArr[0].date} />
              );
            })}
            <div
              style={{
                flexGrow: 0.4,
              }}
            />
            <div ref={ref}></div>
            <div className="fixed bottom-0 w-[62.1%]">
              <Input />
            </div>
          </>
        ) : (
          <div className="h-full flex justify-center items-center text-[#999]">
            Select a chat room to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export const CurrentSelectedConversationContext = React.createContext({
  isSelected: false,
  setIsSelected: () => {},
  conversationObject: {},
  setConversationObject: () => {},
});

export default GroupChatArea;
