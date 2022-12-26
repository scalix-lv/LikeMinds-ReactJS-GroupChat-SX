import React, { useContext, useEffect, useRef, useState } from "react";
import { DmContext } from "../direct-messages/DirectMessagesMain";
import RegularBox from "../channelGroups/RegularBox";
import Input from "../InputComponent/Input";
import { getConversationsForGroup } from "../../sdkFunctions";
import InputDM from "./InputDM";
function ChatRoomAreaDM() {
  const dmContext = useContext(DmContext);
  const ref = useRef(null);

  // Scroll to bottom
  const updateHeight = () => {
    const el = document.getElementById("chat");
    el.scrollTop = el.scrollHeight;
  };

  // get chatroom conversations
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
      // setConversationArray(newConversationArray);
      dmContext.setCurrentChatroomConversations(newConversationArray);
    } else {
      console.log(response.errorMessage);
    }
  };

  useEffect(() => {
    if (Object.keys(dmContext.currentChatroom).length)
      getChatroomConversations(dmContext.currentChatroom.id, 1000);
  }, [dmContext.currentChatroom]);

  useEffect(() => {
    updateHeight();
  }, [dmContext.currentChatroomConversations]);

  return (
    <div
      id="chat"
      className="relative overflow-x-hidden overflow-auto"
      style={{ height: "calc(100vh - 270px)" }}
    >
      {Object.keys(dmContext.currentChatroom).length > 0 ? (
        <>
          {dmContext.currentChatroomConversations.map((convoArr) => {
            return <RegularBox convoArray={convoArr} key={convoArr[0].date} />;
          })}
          <div
            style={{
              flexGrow: 0.4,
            }}
          />
          <div ref={ref}></div>
          <div className="fixed bottom-0 w-[62.1%]">
            <InputDM updateHeight={updateHeight} />
          </div>
        </>
      ) : (
        <div className="h-full flex justify-center items-center text-[#999]">
          Select a chat room to start messaging
        </div>
      )}
    </div>
  );
}

export default ChatRoomAreaDM;
