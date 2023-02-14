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

  // Scroll to bottom
  const updateHeight = () => {
    const el = document.getElementById("dmChat");
    el.scrollTop = el.scrollHeight;
  };

  const paginateChatroomConversations = async (chatroomId, pageNo) => {
    let optionObject = {
      chatroomID: chatroomId,
      page: pageNo,
      conversation_id: sessionStorage.getItem("dmLastConvo"),
      scroll_direction: 0,
    };
    // console.log(optionObject);
    let response = await getConversationsForGroup(optionObject);
    if (!response.error) {
      let conversations = response.data;
      if (conversations.length < 50) {
        setHasMore(false);
      }
      let conversationToBeSetArray = [];
      let oldConversationsArray = [...dmContext.currentChatroomConversations];
      let newConversationArray = [];
      let lastDate = "";
      sessionStorage.setItem("dmLastConvo", conversations[0].id);
      // for (let convo of conversations) {
      //   if (convo.date === lastDate) {
      //     conversationToBeSetArray.push(convo);
      //     lastDate = convo.date;
      //   } else {
      //     if (conversationToBeSetArray.length !== 0) {
      //       newConversationArray.push(conversationToBeSetArray);
      //       conversationToBeSetArray = [];
      //       conversationToBeSetArray.push(convo);
      //       lastDate = convo.date;
      //     } else {
      //       conversationToBeSetArray.push(convo);
      //       lastDate = convo.date;
      //     }
      //   }
      // }
      // // console.log(conversationToBeSetArray);
      // newConversationArray = [conversationToBeSetArray];
      // for (let arr of oldConversationsArray) {
      //   newConversationArray.push(arr);
      // }
      // console.log(newConversationArray);

      newConversationArray = [
        ...conversations,
        ...dmContext.currentChatroomConversations,
      ];
      console.log(newConversationArray);
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
      // let conversationToBeSetArray = [];
      // let newConversationArray = [];
      // let lastDate = "";
      // for (let convo of conversations) {
      //   if (convo.date === lastDate) {
      //     conversationToBeSetArray.push(convo);
      //     lastDate = convo.date;
      //   } else {
      //     if (conversationToBeSetArray.length !== 0) {
      //       newConversationArray.push(conversationToBeSetArray);
      //       conversationToBeSetArray = [];
      //       conversationToBeSetArray.push(convo);
      //       lastDate = convo.date;
      //     } else {
      //       conversationToBeSetArray.push(convo);
      //       lastDate = convo.date;
      //     }
      //   }
      // }
      // newConversationArray.push(conversationToBeSetArray);

      dmContext.setCurrentChatroomConversations(conversations);
    } else {
      // console.log(response.errorMessage);
    }
  };

  useEffect(() => {
    if (Object.keys(dmContext.currentChatroom).length) {
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
            {/* <InfiniteScroll
              dataLength={dmContext.currentChatroomConversations.length}
              hasMore={true}
              inverse={true}
              next={() =>
                paginateChatroomConversations(dmContext.currentChatroom.id, 50)
              }
            > */}
            <div
              id="chat"
              className="relative overflow-x-hidden overflow-auto"
              style={{ height: "calc(100vh - 270px)" }}
              ref={scrollTop}
              onScroll={(e) => {
                let currentHeight = scrollTop.current.scrollHeight;

                let current = scrollTop.current.scrollTop;

                if (current < 200 && current % 150 == 0) {
                  // console.log("calling paginate");
                  paginateChatroomConversations(
                    dmContext.currentChatroom.id,
                    50
                  )
                    .then((res) => {
                      let h = scrollTop.current.scrollHeight;

                      scrollTop.current.scrollTop = h - currentHeight;
                      console.log(currentHeight);
                      console.log(current);
                      console.log(h - currentHeight);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
              }}
            >
              {/* {dmContext.currentChatroomConversations.map((convoArr, index) => {
                return (
                  <RegularBox
                    convoArray={convoArr}
                    key={convoArr[0]?.date + index}
                  />
                );
              })} */}
              {dmContext.currentChatroomConversations.map(
                (convo, index, convoArr) => {
                  let lastConvoDate;
                  if (index === 0) {
                    lastConvoDate = "";
                  } else {
                    lastConvoDate = convoArr[index - 1].date;
                  }
                  return (
                    <div className="ml-[28px] mr-[114px] pt-5" key={convo.id}>
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
            {/* </InfiniteScroll> */}
            {dmContext.currentChatroom.chat_request_state == 0 ? (
              <></>
            ) : dmContext.currentChatroom.chat_request_state !== 2 ? (
              <div className="fixed bottom-0 w-[62.1%]">
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
