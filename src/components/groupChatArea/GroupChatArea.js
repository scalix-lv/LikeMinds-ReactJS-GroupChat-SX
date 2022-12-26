import { Box } from "@mui/material";
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
  const [conversationsArray, setConversationArray] = useState([]);

  let groupContext = useContext(GroupContext);
  const app = initializeApp(config);
  const db = getDatabase(app);
  const ref = useRef(null);
  const scroll = () => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(() => {
    const fn = async () => {
      try {
        const chatRoomResponse = await myClient.getChatroom();
      } catch (error) {
        console.log(error);
      }
    };

    // fn()
  });
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
      setConversationArray(newConversationArray);
    } else {
      console.log(response.errorMessage);
    }
  };
  useEffect(() => {
    if (groupContext.activeGroup.chatroom?.id)
      fn(groupContext.activeGroup.chatroom?.id, 1000);
  }, [groupContext.activeGroup]);

  const [isSelected, setIsSelected] = useState(false);
  const [conversationObject, setConversationObject] = useState({});

  useEffect(() => {
    const query = REF(db, "collabcards");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (
        snapshot.exists() &&
        groupContext.activeGroup.chatroom !== undefined
      ) {
        fn(groupContext.activeGroup.chatroom?.id, 500);
      }
    });
  }, []);
  return (
    <ConversationContext.Provider
      value={{
        conversationsArray: conversationsArray,
        setConversationArray: setConversationArray,
      }}
    >
      <CurrentSelectedConversationContext.Provider
        value={{
          conversationObject,
          setConversationObject,
          setIsSelected,
          isSelected,
        }}
      >
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
              {conversationsArray.map((convoArr, index) => {
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
      </CurrentSelectedConversationContext.Provider>
    </ConversationContext.Provider>
  );
}

export const CurrentSelectedConversationContext = React.createContext({
  isSelected: false,
  setIsSelected: () => {},
  conversationObject: {},
  setConversationObject: () => {},
});

export default GroupChatArea;
