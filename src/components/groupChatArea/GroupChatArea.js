import { Box, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import { myClient, UserContext } from "../..";
import { config, getConversationsForGroup } from "../../sdkFunctions";
import RegularBox, { DateSpecifier } from "../channelGroups/RegularBox";
import { GroupContext } from "../../Main";
import Input from "../InputComponent/Input";
import Tittle from "./tittle/Tittle";
// import { getDatabase } from "firebase/database";
import { onValue, ref as REF } from "firebase/database";
// import { initializeApp } from "firebase/app";
import { ChatRoomContext } from "../Groups/Groups";
import MessageBlock from "../channelGroups/MessageBlock";
// Exported Styled Box

export const StyledBox = styled(Box)({
  backgroundColor: "#f6f6ff",
  minHeight: "100vh",
  borderTop: "1px solid #EEEEEE",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const getChatroomConversationArray = async (
  chatroomId,
  pageNo,
  conversationContext
) => {
  // let pageToCall = Math.floor(conversationContext.conversationsArray.length/50) + 1?
  let optionObject = {
    chatroomID: chatroomId,
    page: pageNo,
  };

  let response = await getConversationsForGroup(optionObject);

  if (!response.error) {
    let conversations = response.data;

    sessionStorage.setItem("lastConvoId", conversations[0].id);
    // for (let convo of conversations) {
    //   if (convo.date === lastDate) {
    //     conversationToBeSetArray.push(convo);
    //     lastDate = convo.date;
    //   } else {
    //     if (conversationToBeSetArray.length != 0) {
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
    conversationContext.setConversationArray(conversations);
  } else {
    // console.log(response.errorMessage);
  }
};
export const ConversationContext = React.createContext({
  conversationsArray: [],
  setConversationArray: () => {},
  refreshConversationArray: () => {},
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
    const el = document.getElementById("chate");
    if (el != null) {
      if (conversationContext.conversationsArray.length <= 50) {
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
  useEffect(() => {
    updateHeight();
  }, []);
  useEffect(() => {
    // scroll();
    let convoArrLength = conversationContext.conversationsArray.length;
    let lastConvoArrLength =
      conversationContext.conversationsArray[convoArrLength - 1]?.length;
    if (conversationContext.conversationsArray.length === 0) {
      return;
    }
    if (
      conversationContext?.conversationsArray[convoArrLength - 1][
        lastConvoArrLength - 1
      ]?.member?.id == userContext.currentUser.id
    ) {
      updateHeight();
    }
  }, [conversationContext.conversationsArray]);

  const fnPagination = async (chatroomId, pageNo) => {
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

      let newConversationArray = [];

      sessionStorage.setItem("lastConvoId", conversations[0].id);
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
      newConversationArray = [
        ...conversations,
        ...conversationContext.conversationsArray,
      ];
      conversationContext.setConversationArray(newConversationArray);
    } else {
      // console.log(response.errorMessage);
    }
  };
  useEffect(() => {
    if (groupContext.activeGroup.chatroom?.id)
      getChatroomConversationArray(
        groupContext.activeGroup.chatroom?.id,
        100,
        conversationContext
      );
  }, [groupContext.activeGroup]);

  useEffect(() => {
    const query = REF(
      db,
      `/collabcards/${groupContext.activeGroup.chatroom?.id}`
    );
    return onValue(query, (snapshot) => {
      // const data = snapshot.val();
      // console.log(snapshot.val());
      if (
        snapshot.exists() &&
        groupContext.activeGroup.chatroom !== undefined
      ) {
        // console.log(snapshot.val());
        updateHeight();
        getChatroomConversationArray(
          groupContext.activeGroup.chatroom.id,
          100,
          conversationContext
        );
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
        // console.log(snapshot.val());
        chatRoomContext.refreshChatroomContext();
      }
    });
  }, []);

  useEffect(() => {
    updateHeight();
  }, [conversationContext.conversationsArray]);
  return (
    <div>
      {groupContext.showLoadingBar == false ? (
        <>
          {groupContext.activeGroup.chatroom?.id ? (
            <Tittle
              title={groupContext.activeGroup.chatroom.header}
              memberCount={groupContext.activeGroup.participant_count}
            />
          ) : null}
          <div
            id="chate"
            className="relative overflow-x-hidden overflow-auto"
            style={{ height: "calc(100vh - 270px)" }}
            ref={scrollTop}
            onScroll={(e) => {
              let current = scrollTop.current.scrollTop;
              if (current < 200 && current % 150 == 0) {
                fnPagination(groupContext.activeGroup?.chatroom?.id, 50);
              }
            }}
          >
            {groupContext.activeGroup.chatroom?.id !== undefined ? (
              <>
                {conversationContext.conversationsArray.map(
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

                <div
                  style={{
                    flexGrow: 0.4,
                  }}
                />
                <div ref={ref}></div>
                <div className="fixed bottom-0 w-[62.1%]">
                  {groupContext.activeGroup.chatroom.member_can_message ? (
                    <Input updateHeight={updateHeight} />
                  ) : (
                    <span className="flex justify-center items-center text-[#999] py-4">
                      Only Community Managers can send messages.
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex justify-center items-center text-[#999]">
                Select a chat room to start messaging
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="h-full flex justify-center items-center text-[#999] min-h-[80vh]">
          <CircularProgress />
        </div>
      )}
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
