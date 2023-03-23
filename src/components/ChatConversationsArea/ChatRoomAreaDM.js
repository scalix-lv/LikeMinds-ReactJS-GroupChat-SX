import React, { useContext, useEffect, useRef, useState } from "react";
import { DmContext } from "../direct-messages/DirectMessagesMain";
import { DateSpecifier } from "../channelGroups/RegularBox";
import { getConversationsForGroup } from "../../sdkFunctions";
import InputDM from "./InputDM";
import { UserContext } from "../..";
import { Button, CircularProgress } from "@mui/material";
import LetThemAcceptInvite from "../direct-messages/LetThemAcceptInvite";
import AcceptTheirInviteFirst from "../direct-messages/AcceptTheirInviteFirst";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageBlock from "../channelGroups/MessageBlock";
function ChatRoomAreaDM() {
  const dmContext = useContext(DmContext);
  const userContext = useContext(UserContext);
  const ref = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const scrollTop = useRef(null);
  const [showLoader, setShowLoader] = useState(false);
  // Scroll to bottom
  const updateHeight = () => {
    const el = document.getElementById("chat");
    if (el != null) {
      if (dmContext.currentChatroomConversations.length <= 50) {
        el.scrollTop = el.scrollHeight;
        sessionStorage.setItem("currentContainerSize", el.scrollHeight);
      } else {
        let newScrollHeight = el.scrollHeight;
        let oldHeight = sessionStorage.getItem("currentContainerSize");
        let newHeightToSet = newScrollHeight - parseInt(oldHeight);
        el.scrollTop = newHeightToSet;
        sessionStorage.setItem("currentContainerSize", el.scrollHeight);
      }
    }
  };

  const paginateChatroomConversations = async (chatroomId, pageNo) => {
    let optionObject = {
      chatroomID: chatroomId,
      page: pageNo,
      conversation_id: sessionStorage.getItem("dmLastConvo"),
      scroll_direction: 0,
    };
    // // console.log(optionObject);
    let response = await getConversationsForGroup(optionObject);
    if (!response.error) {
      let conversations = response.data;
      if (conversations.length < 50) {
        setHasMore(false);
      }
      let newConversationArray = [];
      sessionStorage.setItem("dmLastConvo", conversations[0].id);

      newConversationArray = [
        ...conversations,
        ...dmContext.currentChatroomConversations,
      ];
      // // console.log(newConversationArray);
      dmContext.setCurrentChatroomConversations(newConversationArray);
    } else {
      // console.log(response.errorMessage);
    }
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
      sessionStorage.setItem("dmLastConvo", conversations[0].id);

      dmContext.setCurrentChatroomConversations(conversations);
    } else {
      // // console.log(response.errorMessage);
    }
  };

  useEffect(() => {
    if (!!Object.keys(dmContext.currentChatroom).length) {
      getChatroomConversations(dmContext.currentChatroom.id, 100);
    }
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
      {Object.keys(dmContext.currentChatroom).length > 0 &&
      showLoader == false ? (
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
            <div
              id="chat"
              className="relative overflow-x-hidden overflow-auto"
              style={{ height: "calc(100vh - 270px)" }}
              ref={scrollTop}
              onScroll={(e) => {
                let current = scrollTop.current.scrollTop;
                let currentHeight = scrollTop.current.scrollHeight;
                currentHeight = currentHeight.toString();
                if (current < 200 && current % 150 == 0) {
                  // console.log("calling paginate");
                  paginateChatroomConversations(
                    dmContext.currentChatroom.id,
                    50
                  );
                }
              }}
            >
              {dmContext.currentChatroomConversations.map(
                (convo, index, convoArr) => {
                  let lastConvoDate;
                  if (index === 0) {
                    lastConvoDate = "";
                  } else {
                    lastConvoDate = convoArr[index - 1].date;
                  }
                  return (
                    <div
                      className="ml-[28px] mr-[114px] pt-5 z:max-md:mr-[28px]"
                      key={convo.id}
                    >
                      {convo.date != lastConvoDate ? (
                        <DateSpecifier
                          dateString={convo.date}
                          // key={convo.id + index}
                        />
                      ) : null}
                      <MessageBlock
                        userId={convo.member.id}
                        conversationObject={convo}
                      />
                    </div>
                  );
                }
              )}

              <div ref={ref}></div>
            </div>
            {dmContext.currentChatroom.chat_request_state == 0 ? (
              <></>
            ) : dmContext.currentChatroom.chat_request_state !== 2 ? (
              <div className="fixed bottom-0 w-[62.1%] sm:max-md:w-[90%] z:max-sm:w-[85%]">
                <InputDM updateHeight={updateHeight} />
              </div>
            ) : null}
          </>
        )
      ) : (
        <div className="h-full flex justify-center items-center text-[#999]">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
export default ChatRoomAreaDM;
