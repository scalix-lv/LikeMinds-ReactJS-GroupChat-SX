import { onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { myClient, UserContext } from "../..";
import { RouteContext } from "../../Main";
import SearchBarContainer from "../SearchBar/SearchBar";
import { getChatroomConversations, loadHomeFeed } from "./ChatArea";

import CurrentDms from "./searchbar/CurrentDms";
import SearchBarDirectMessages from "./searchbar/SearchBarDirectMessages";

function DirectMessagesMain() {
  const userContext = useContext(UserContext);
  const routeContext = useContext(RouteContext);
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
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  function resetContext() {
    setIsConversationSelected(false);
    setConversationObject({});
    setDocumentAttachments([]);
    setMediaAttachments([]);
    setAudioAttachments([]);
    setMessageText("");
  }
  useEffect(() => {
    console.log(routeContext.isNavigationBoxOpen);
  }, [routeContext.isNavigationBoxOpen]);
  return (
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
        resetContext,
        showLoadingBar,
        setShowLoadingBar,
        showSnackBar,
        setShowSnackBar,
        snackBarMessage,
        setSnackBarMessage,
      }}
    >
      <div className="flex overflow-hidden customHeight flex-1">
        <div
          className={`flex-[.32] bg-white border-r-[1px] border-[#eeeeee] pt-[20px] overflow-auto feed-panel 
            ${
              routeContext.isNavigationBoxOpen
                ? "sm:max-md:flex-[.85] z:max-sm:flex-1"
                : "z:max-md:hidden"
            }`}
        >
          <SearchBarDirectMessages />
          {/* <SearchBarContainer/> */}
          <CurrentDms />
        </div>
        <div
          className={`flex-[.68] bg-[#FFFBF2] relative pt-[42px]"
            ${
              routeContext.isNavigationBoxOpen
                ? "sm:max-md:absolute sm:max-md:z-[-1] z:max-sm:hidden"
                : "z:max-md:flex-[1]"
            }`}
        >
          <Outlet />
        </div>
      </div>
    </DmContext.Provider>
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
  resetContext: () => {},
  showLoadingBar: Boolean,
  setShowLoadingBar: () => {},
  showSnackBar: Boolean,
  setShowSnackBar: () => {},
  snackBarMessage: "",
  setSnackBarMessage: () => {},
});
