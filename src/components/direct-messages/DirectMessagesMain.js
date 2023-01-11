import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../..";

import CurrentDms from "./searchbar/CurrentDms";
import SearchBarDirectMessages from "./searchbar/SearchBarDirectMessages";

function DirectMessagesMain() {
  const userContext = useContext(UserContext);

  const [currentProfile, setCurrentProfile] = useState({});
  const [currentChatroomConversations, setCurrentChatroomConversations] =
    useState([]);
  const [homeFeed, setHomeFeed] = useState([]);
  const [membersFeed, setMembersFeed] = useState([]);
  const [currentChatroom, setCurrentChatroom] = useState({});
  const [messageText, setMessageText] = useState("");
  const [audioAttachments, setAudioAttachments] = useState([]);
  const [mediaAttachments, setMediaAttachments] = useState([]);
  const [documentAttachments, setDocumentAttachments] = useState([]);
  const [isConversationSelected, setIsConversationSelected] = useState(false);
  const [conversationObject, setConversationObject] = useState({});
  const [refreshContext, setRefreshContext] = useState(null);
  return (
    <div>
      <DmContext.Provider
        value={{
          currentProfile,
          setCurrentProfile,
          homeFeed,
          setHomeFeed,
          membersFeed,
          setMembersFeed,
          currentChatroom,
          setCurrentChatroom,
          currentChatroomConversations,
          setCurrentChatroomConversations,
          messageText,
          setMessageText,
          audioAttachments,
          setAudioAttachments,
          mediaAttachments,
          setMediaAttachments,
          documentAttachments,
          setDocumentAttachments,
          isConversationSelected,
          setIsConversationSelected,
          conversationObject,
          setConversationObject,
          refreshContext,
          setRefreshContext,
        }}
      >
        <div className="flex overflow-hidden customHeight flex-1">
          <div className="flex-[.32] bg-white border-r-[1px] border-[#eeeeee] pt-[20px] overflow-auto feed-panel">
            <SearchBarDirectMessages />
            <CurrentDms />
          </div>
          <div className="flex-[.68] bg-[#f9f6ff] relative pt-[42px]">
            <Outlet />
          </div>
        </div>
      </DmContext.Provider>
    </div>
  );
}

export default DirectMessagesMain;

export const DmContext = React.createContext({
  currentProfile: {},
  setCurrentProfile: function () {},
  homeFeed: [],
  setHomeFeed: () => {},
  membersFeed: [],
  setMembersFeed: () => {},
  currentChatroom: {},
  setCurrentChatroom: () => {},
  currentChatroomConversations: [],
  setCurrentChatroomConversations: () => {},
  messageText: String,
  setMessageText: () => {},
  audioAttachments: [],
  setAudioAttachments: () => {},
  mediaAttachments: [],
  setMediaAttachments: () => {},
  documentAttachments: [],
  setDocumentAttachments: () => {},
  isConversationSelected: false,
  setIsConversationSelected: () => {},
  conversationObject: {},
  setConversationObject: () => {},
  refreshContext: () => {},
  setRefreshContext: () => {},
});
