import { Box, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import { myClient, UserContext } from "../..";
import {
  config,
  getConversationsForGroup,
  log,
  markRead,
} from "../../sdkFunctions";
import RegularBox, { DateSpecifier } from "../channelGroups/RegularBox";
import { GroupContext } from "../../Main";
import Input from "../InputComponent/Input";
import Tittle from "./tittle/Tittle";
// import { getDatabase } from "firebase/database";
import { onValue, ref as REF } from "firebase/database";
// import { initializeApp } from "firebase/app";
import { ChatRoomContext } from "../Groups/Groups";
import MessageBlock from "../channelGroups/MessageBlock";
import { useParams } from "react-router-dom";
import AcceptTheirInviteFirst from "../direct-messages/AcceptTheirInviteFirst";
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
  const optionObject = {
    chatroomID: chatroomId,
    page: pageNo,
  };

  const response = await getConversationsForGroup(optionObject);

  if (!response.error) {
    const conversations = response.data;

    if (conversations.length == 0) {
      return;
    }
    sessionStorage.setItem("lastConvoId", conversations[0].id);

    conversationContext.setConversationArray(conversations);
  } else {
    log(response.errorMessage);
  }
};
export const ConversationContext = React.createContext({
  conversationsArray: [],
  setConversationArray: () => {},
  refreshConversationArray: () => {},
});

const GroupChatArea = () => {
  const chatRoomContext = useContext(ChatRoomContext);
  const conversationContext = useContext(ConversationContext);
  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const db = myClient.fbInstance();
  const ref = useRef(null);
  const scrollTop = useRef(null);
  const { status } = useParams();
  const [shouldLoadMoreConversations, setShouldLoadMoreConversations] =
    useState(true);
  const [showLoader, setShowLoader] = useState(false);
  // Scroll to bottom
  const updateHeight = () => {
    const el = document.getElementById("chate");
    if (el != null) {
      if (conversationContext.conversationsArray.length <= 55) {
        el.scrollTop = el.scrollHeight;
        sessionStorage.setItem("currentContainerSize", el.scrollHeight);
      } else {
        const newScrollHeight = el.scrollHeight;
        const oldHeight = sessionStorage.getItem("currentContainerSize");
        const newHeightToSet = newScrollHeight - parseInt(oldHeight);
        el.scrollTop = newHeightToSet;
        sessionStorage.setItem("currentContainerSize", el.scrollHeight);
      }
    }
  };

  useEffect(() => {
    updateHeight();
  }, []);

  useEffect(() => {
    const convoArrLength = conversationContext.conversationsArray.length;
    const lastConvoArrLength =
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
    const optionObject = {
      chatroomID: chatroomId,
      page: 50,
      scroll_direction: 0,
      conversation_id: sessionStorage.getItem("lastConvoId"),
    };
    const response = await getConversationsForGroup(optionObject);
    if (!response.error) {
      const conversations = response.data;
      if (conversations.length == 0) {
        setShouldLoadMoreConversations(false);
        return;
      }
      let newConversationArray = [];
      sessionStorage.setItem("lastConvoId", conversations[0].id);
      newConversationArray = [
        ...conversations,
        ...conversationContext.conversationsArray,
      ];
      conversationContext.setConversationArray(newConversationArray);
    } else {
      log(response.errorMessage);
    }
  };
  useEffect(() => {
    if (groupContext.activeGroup.chatroom?.id)
      getChatroomConversationArray(
        groupContext.activeGroup.chatroom?.id,
        100,
        conversationContext
      ).then(() => {
        setShowLoader(false);
      });
  }, [groupContext.activeGroup]);

  useEffect(() => {
    const query = REF(db, `/collabcards/${status}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        updateHeight();
        getChatroomConversationArray(status, 100, conversationContext);
        // chatRoomContext.refreshChatroomContext();
      }
    });
  }, [status]);

  useEffect(() => {
    // const query = REF(db, `users/${userContext.currentUser.id}`);
    const query = REF(db, `/community/${userContext.community.id}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        chatRoomContext.refreshChatroomContext();
      }
    });
  }, []);

  useEffect(() => {
    updateHeight();
  }, [conversationContext.conversationsArray]);

  useEffect(() => {
    setShowLoader(true);
    setShouldLoadMoreConversations(true);
  }, [status]);
  return (
    <div>
      {groupContext.showLoadingBar == false && showLoader == false ? (
        !!groupContext.activeGroup.chatroom.is_secret &&
        !groupContext.activeGroup.chatroom.secret_chatroom_participants?.includes(
          userContext.currentUser.id
        ) ? (
          <>
            <AcceptTheirInviteFirst
              title={groupContext.activeGroup.chatroom.header}
            />
          </>
        ) : (
          <>
            {groupContext.activeGroup.chatroom?.id ? (
              <Tittle
                title={groupContext.activeGroup.chatroom.header}
                memberCount={groupContext.activeGroup.participant_count}
              />
            ) : null}

            {conversationContext.conversationsArray?.length > 0 ? (
              <div
                id="chate"
                className="relative overflow-x-hidden overflow-auto"
                style={{ height: "calc(100vh - 270px)" }}
                ref={scrollTop}
                onScroll={(e) => {
                  if (!shouldLoadMoreConversations) {
                    return;
                  }
                  const current = scrollTop.current.scrollTop;
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
                          <div
                            className="ml-[28px] mr-[114px] pt-5 z:max-md:mr-[28px] z:max-sm:ml-2  z:max-sm:mr-0"
                            key={convo.id}
                          >
                            {convo.date != lastConvoDate ? (
                              <DateSpecifier dateString={convo.date} />
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
                    <div className="fixed bottom-0 w-[62.1%] sm:max-md:w-[90%] z:max-sm:w-[85%]">
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
            ) : null}
          </>
        )
      ) : (
        <div className="h-full flex justify-center items-center text-[#999] min-h-[80vh]">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export const CurrentSelectedConversationContext = React.createContext({
  isSelected: false,
  setIsSelected: () => {},
  conversationObject: {},
  setConversationObject: () => {},
});

export default GroupChatArea;
