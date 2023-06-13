import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  checkDMStatus,
  getConversationsForGroup,
  log,
  markRead,
} from "../../../sdkFunctions";
import ChatroomContext from "../../contexts/chatroomContext";
import Input from "../input-box";
import { DateSpecifier } from "../message-boxes-components";
import MessageBlock from "../message-boxes-components/MessageBlock";
import { useFirebaseChatConversations } from "../../hooks/firebase";
import BufferStack from "../buffer-stack";
import { GeneralContext } from "../../contexts/generalContext";
import { UserContext } from "../../contexts/userContext";
import LetThemAcceptInvite, {
  AcceptTheirInviteFirst,
} from "../direct-messages-trans-state";
import routeVariable from "../../../enums/routeVariables";
import { messageStrings } from "../../../enums/strings";
const ChatContainer: React.FC = () => {
  const params = useParams();
  const id: any = params[routeVariable.id];
  const chatroomContext = useContext(ChatroomContext);
  const [loadMoreConversations, setLoadMoreConversations] = useState(true);
  const [bufferMessage, setBufferMessage] = useState(null);
  const scrollTop = useRef<HTMLDivElement>(null);
  const generalContext = useContext(GeneralContext);
  const userContext = useContext(UserContext);
  const [pageNo, setPageNo] = useState(1);
  // Update height
  const updateHeight = () => {
    const el = document.getElementById("chat");
    if (el != null) {
      if (pageNo === 1) {
        el.scrollTop = el.scrollHeight;
        sessionStorage.setItem(
          "currentContainerSize",
          el.scrollHeight.toString()
        );
      } else {
        const newScrollHeight = el.scrollHeight;
        const oldHeight = sessionStorage.getItem("currentContainerSize");
        const newHeightToSet = newScrollHeight - parseInt(oldHeight!, 10);
        el.scrollTop = newHeightToSet;
        sessionStorage.setItem(
          "currentContainerSize",
          el.scrollHeight.toString()
        );
      }
    }
  };

  const setNewHeight = () => {
    const el = document.getElementById("chat");
    if (el != null) {
      el.scrollTop = el.scrollHeight;
      sessionStorage.setItem(
        "currentContainerSize",
        el.scrollHeight.toString()
      );
    }
  };

  // get chatroom conversations
  const getChatroomConversations = async (chatroomId: string, pageNo: any) => {
    try {
      const optionObject = {
        chatroomID: chatroomId,
        paginateBy: pageNo,
      };
      const response: any = await getConversationsForGroup(optionObject);
      if (!response.error) {
        const conversations = response.data;
        sessionStorage.setItem("dmLastConvo", conversations[0].id);
        chatroomContext.setConversationList(conversations);
      } else {
        log(response.errorMessage);
      }
    } catch (e) {
      log(e);
    }
  };

  // paginate chatroom conversation
  const paginateChatroomConversations = async (
    chatroomId: any,
    pageNo: any
  ) => {
    const optionObject = {
      chatroomID: chatroomId,
      paginateBy: pageNo,
      conversationID: sessionStorage.getItem("dmLastConvo"),
      scrollDirection: 0,
    };
    const response: any = await getConversationsForGroup(optionObject);
    if (!response.error) {
      const conversations = response.data;
      if (conversations.length < 50) {
        setLoadMoreConversations(false);
      } else {
        setLoadMoreConversations(true);
      }
      let newConversationArray: any = [];
      sessionStorage.setItem("dmLastConvo", conversations[0]?.id);

      newConversationArray = [
        ...conversations,
        ...chatroomContext.conversationList,
      ];
      chatroomContext.setConversationList(newConversationArray);
      return true;
    }
    log(response.errorMessage);
    return false;
  };
  useEffect(() => {
    async function loadChatAndMarkReadChatroom() {
      try {
        await getChatroomConversations(id, 100);
        await markRead(id);
        const call: any = await checkDMStatus(id);
        if (call?.data?.showDM) {
          chatroomContext.setShowReplyPrivately(true);
          const cta: string = call?.data?.cta;
          const showListParams = cta.split("show_list=")[1];
          chatroomContext.setReplyPrivatelyMode(parseInt(showListParams, 10));
        }
      } catch (error) {
        log(error);
      }
    }
    loadChatAndMarkReadChatroom().then(() => {
      setNewHeight();
      setPageNo(1);
    });
  }, [id, generalContext.currentChatroom]);

  useEffect(() => {
    generalContext.setShowLoadingBar(false);
  }, [chatroomContext?.conversationList]);
  useEffect(() => {
    document.addEventListener("updateHeightOnPagination", updateHeight);
    return () => {
      document.removeEventListener("updateHeightOnPagination", updateHeight);
    };
  });
  useEffect(() => {
    document.addEventListener("setNewHeight", setNewHeight);
    return () => {
      document.removeEventListener("setNewHeight", setNewHeight);
    };
  });

  useEffect(() => {
    function reloadChatroom() {
      getChatroomConversations(id, 100);
    }
    document.addEventListener("addedByStateOne", reloadChatroom);
    return () => {
      document.removeEventListener("addedByStateOne", reloadChatroom);
    };
  }, [id]);

  // firebase listener
  useFirebaseChatConversations(getChatroomConversations, setBufferMessage);

  if (generalContext?.currentChatroom?.chat_request_state === 0) {
    if (
      userContext.currentUser?.id ===
      generalContext.currentChatroom.chat_requested_by[0]?.id
    ) {
      return (
        <LetThemAcceptInvite
          title={
            userContext.currentUser.id ===
            generalContext.currentChatroom.member.id
              ? generalContext.currentChatroom.chatroom_with_user.name
              : generalContext.currentChatroom.member.name
          }
        />
      );
    }
    return (
      <AcceptTheirInviteFirst
        title={
          userContext.currentUser.id ===
          generalContext.currentChatroom.member.id
            ? generalContext.currentChatroom.chatroom_with_user.name
            : generalContext.currentChatroom.member.name
        }
      />
    );
  }
  return (
    <>
      <div
        id="chat"
        className="relative overflow-x-hidden overflow-auto flex-[1]
        "
        ref={scrollTop}
        onScroll={() => {
          if (!loadMoreConversations) {
            return;
          }
          const node = scrollTop.current!;
          const current = node.scrollTop;
          if (current < 200 && current % 150 === 0) {
            paginateChatroomConversations(id, 50)
              .then(() => setPageNo((p) => p + 1))
              .then(() => {
                document.dispatchEvent(
                  new CustomEvent("updateHeightOnPagination")
                );
              });
          }
        }}
      >
        {chatroomContext.conversationList.map(
          (convo: any, index: any, convoArr: any) => {
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
                {convo.date !== lastConvoDate ? (
                  <DateSpecifier
                    dateString={convo.date}
                    // key={convo.id + index}
                  />
                ) : null}
                <MessageBlock
                  userId={convo.member.id}
                  conversationObject={convo}
                  index={index}
                />
              </div>
            );
          }
        )}
        {bufferMessage ? (
          <BufferStack
            bufferMessage={bufferMessage}
            updateHeight={updateHeight}
          />
        ) : null}
      </div>
      {userContext.currentUser?.memberRights[4]?.is_selected ? (
        generalContext?.currentChatroom?.member_can_message === false ? (
          <p className="text-center">
            {messageStrings.chatroomResponseOnlyCMCanRespond}
          </p>
        ) : (
          <Input
            disableInputBox={
              generalContext.currentChatroom.chat_request_state === 2
            }
            setBufferMessage={setBufferMessage}
          />
        )
      ) : generalContext?.currentChatroom?.member_can_message === false ? (
        <p className="text-center">
          {messageStrings.chatroomResponseOnlyCMCanRespond}
        </p>
      ) : (
        <p className="text-center">
          {messageStrings.chatroomResponseNotAllowed}
        </p>
      )}
    </>
  );
};
export default ChatContainer;
