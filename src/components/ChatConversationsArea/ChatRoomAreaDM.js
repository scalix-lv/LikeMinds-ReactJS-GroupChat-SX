import React, { useContext, useEffect, useRef } from "react";
import { DmContext } from "../direct-messages/DirectMessagesMain";
import RegularBox from "../channelGroups/RegularBox";
import { getConversationsForGroup } from "../../sdkFunctions";
import InputDM from "./InputDM";
import { UserContext } from "../..";
import { Button } from "@mui/material";
import LetThemAcceptInvite from "../direct-messages/LetThemAcceptInvite";
import AcceptTheirInviteFirst from "../direct-messages/AcceptTheirInviteFirst";
function ChatRoomAreaDM() {
  const dmContext = useContext(DmContext);
  const userContext = useContext(UserContext);
  const ref = useRef(null);

  // Scroll to bottom
  const updateHeight = () => {
    const el = document.getElementById("dmChat");
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
      id="dmChat"
      className="relative overflow-x-hidden overflow-auto"
      style={{ height: "calc(100vh - 270px)" }}
    >
      {Object.keys(dmContext.currentChatroom).length > 0 ? (
        dmContext.currentChatroom.chat_request_state === 0 ? (
          userContext.currentUser.id ==
          dmContext.currentChatroom.chat_requested_by[0].id ? (
            <LetThemAcceptInvite
              title={
                userContext.currentUser.id ===
                dmContext.currentChatroom.member.id
                  ? dmContext.currentChatroom.chatroom_with_user.name
                  : dmContext.currentChatroom.member.name
              }
            />
          ) : (
            <AcceptTheirInviteFirst
              title={
                userContext.currentUser.id ===
                dmContext.currentChatroom.member.id
                  ? dmContext.currentChatroom.chatroom_with_user.name
                  : dmContext.currentChatroom.member.name
              }
            />
          )
        ) : (
          <>
            {dmContext.currentChatroomConversations.map((convoArr) => {
              return (
                <RegularBox convoArray={convoArr} key={convoArr[0].date} />
              );
            })}

            <div ref={ref}></div>
            {dmContext.currentChatroom.chat_request_state == 0 ? (
              <>
                {/* {userContext.currentUser.id ==
                dmContext.currentChatroom.chat_requested_by[0].id ? (
                  <div className="flex justify-center items-center fixed bottom-0 w-[62.1%] py-4">
                    Connection request pending. Messaging would be enabled once
                    your request is approved.
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center items-center">
                      <Button variant="filled" className="mx-2">
                        Approve
                      </Button>
                      <Button variant="filled" className="mx-2">
                        Reject
                      </Button>
                    </div>
                  </>
                )} */}
              </>
            ) : dmContext.currentChatroom.chat_request_state !== 2 ? (
              <div className="fixed bottom-0 w-[62.1%]">
                <InputDM updateHeight={updateHeight} />
              </div>
            ) : null}
          </>
        )
      ) : (
        <div className="h-full flex justify-center items-center text-[#999]">
          Select a chat room to start messaging
        </div>
      )}
    </div>
  );
}

export default ChatRoomAreaDM;
