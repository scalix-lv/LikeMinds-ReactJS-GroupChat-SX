import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import { myClient, UserContext } from "../..";
import { config, getConversationsForGroup } from "../../sdkFunctions";
import RegularBox from "../channelGroups/RegularBox";
import { GroupContext } from "../../Main";
import Input from "../InputComponent/Input";
import Tittle from "./tittle/Tittle";
// import { getDatabase } from "firebase/database";
import { onValue, ref as REF } from "firebase/database";
// import { initializeApp } from "firebase/app";
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
  const userContext = useContext(UserContext);
  let db = myClient.fbInstance();
  const ref = useRef(null);
  const scrollTop = useRef(null);

  const [shouldLoadMoreConversations, setShouldLoadMoreConversations] =
    useState(true);

  // Scroll to bottom
  const updateHeight = () => {
    const el = document.getElementById("chat");
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    // scroll();
    updateHeight();
  }, []);

  const fn = async (chatroomId, pageNo) => {
    // let pageToCall = Math.floor(conversationContext.conversationsArray.length/50) + 1?
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
      sessionStorage.setItem("lastConvoId", conversations[0].id);
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
      conversationContext.setConversationArray(newConversationArray);
    } else {
      console.log(response.errorMessage);
    }
  };
  const fnPagination = async (chatroomId, pageNo) => {
    // let pageToCall = Math.floor(conversationContext.conversationsArray.length/50) + 1?
    let optionObject = {
      chatroomID: chatroomId,
      page: 50,
      scroll_direction: 0,
      conversation_id: sessionStorage.getItem("lastConvoId"),
    };

    let response = await getConversationsForGroup(optionObject);

    if (!response.error) {
      let conversations = response.data;
      if (conversations.length < 50) {
        setShouldLoadMoreConversations(false);
      }
      let conversationToBeSetArray = [];
      let newConversationArray = [];
      let lastDate = "";
      sessionStorage.setItem("lastConvoId", conversations[0].id);
      for (let convo of conversations) {
        if (convo.date === lastDate) {
          conversationToBeSetArray.push(convo);
          lastDate = convo.date;
        } else {
          if (conversationToBeSetArray.length !== 0) {
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
      newConversationArray = [
        ...newConversationArray,
        ...conversationContext.conversationsArray,
      ];
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
    const query = REF(
      db,
      `/collabcards/${groupContext.activeGroup.chatroom?.id}`
    );
    return onValue(query, (snapshot) => {
      // const data = snapshot.val();

      if (
        snapshot.exists() &&
        groupContext.activeGroup.chatroom !== undefined
      ) {
        chatRoomContext.refreshChatroomContext();
      }
    });
  }, [groupContext.activeGroup]);

  useEffect(() => {
    const query = REF(db, `users/${userContext.currentUser.id}`);
    return onValue(query, (snapshot) => {
      // const data = snapshot.val();
      if (
        snapshot.exists() &&
        groupContext.activeGroup.chatroom !== undefined
      ) {
        chatRoomContext.refreshChatroomContext();
      }
    });
  }, []);

  return (
    <div>
      {groupContext.activeGroup.chatroom?.id ? (
        <Tittle
          title={groupContext.activeGroup.chatroom.header}
          memberCount={groupContext.activeGroup.participant_count}
        />
      ) : null}
      <div
        id="chat"
        className="relative overflow-x-hidden overflow-auto"
        style={{ height: "calc(100vh - 270px)" }}
        ref={scrollTop}
        onScroll={(e) => {
          let current = scrollTop.current.scrollTop;
          if (current < 200 && current % 150 == 0) {
            fnPagination(groupContext.activeGroup.chatroom.id, 50)
              .then((res) => {
                let h = scrollTop.current.scrollHeight;
                scrollTop.current.scrollTop = h / 2;
              })
              .catch((e) => console.log(e));
          }
        }}
      >
        {groupContext.activeGroup.chatroom?.id !== undefined ? (
          <>
            {conversationContext.conversationsArray.map((convoArr, index) => {
              return (
                <RegularBox
                  convoArray={convoArr}
                  key={convoArr[0].date + index}
                />
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
