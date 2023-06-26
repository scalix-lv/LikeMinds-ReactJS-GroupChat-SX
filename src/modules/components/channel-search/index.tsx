import { IconButton } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { myClient } from "../../..";
import searchConversationsInsideChatroom from "../../../sdkFunctions/searchFunctions";
import routeVariable from "../../../enums/routeVariables";
import { useParams } from "react-router";
import ProfileTile from "./profile-tile";
import { log } from "../../../sdkFunctions";
import { ref } from "@firebase/database";
import InfiniteScroll from "react-infinite-scroll-component";
import { GeneralContext } from "../../contexts/generalContext";
// import { log } from "console";
// log

const ChannelSearch = ({ setOpenSearch }: any) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchState, setSearchState] = useState(0);
  const [searchArray, setSearchArray] = useState<any>([]);
  const [loadMoreConversations, setLoadMoreConversations] = useState(true);
  const params = useParams();
  const id = params[routeVariable.id];

  const searchInputBoxRef = useRef<HTMLDivElement>(null);

  const generalContext = useContext(GeneralContext);
  function setSearchString(e: any) {
    setSearchKey(e.target.value);
  }
  async function searchFunction() {
    try {
      const pageNo = Math.floor(searchArray?.length / 20) + 1;
      console.log("the page is");
      console.log(searchArray);
      const pageSize = 20;
      const call = await searchConversationsInsideChatroom(
        id!.toString(),
        searchKey,
        (() => {
          if (searchState === 1) {
            return true;
          } else {
            return false;
          }
        })(),
        pageNo,
        pageSize
      );
      const response: any = call?.data?.conversations;
      log("the profiles after the search are");
      log(response);
      if (response.length < 20 && searchState === 1) {
        setSearchState(2);
      } else if (response.length < 20 && searchState === 2) {
        setLoadMoreConversations(false);
      }
      setSearchArray([...searchArray, ...response]);
    } catch (error) {
      log(error);
    }
  }

  // useEffect(() => {
  //   log("hello");
  //   function searchClickHandler(e: any) {
  //     log("here inside");
  //     if (
  //       searchInputBoxRef.current &&
  //       !searchInputBoxRef.current.contains(e.target)
  //     ) {
  //       setOpenSearch(false);
  //       log("you clicked");
  //       log(e);
  //     }
  //   }
  //   document.addEventListener("click", searchClickHandler);
  //   return () => {
  //     document.removeEventListener("click", searchClickHandler);
  //   };
  // }, [searchInputBoxRef]);

  useEffect(() => {
    const searchChatroomTimeOut = setTimeout(() => {
      searchFunction();
    }, 500);
    return () => {
      clearTimeout(searchChatroomTimeOut);
    };
  }, [searchKey]);

  // for rendering the profiles
  function renderProfiles() {
    try {
      return searchArray?.map((profile: any) => {
        return (
          <div className="my-2" key={profile?.id}>
            <ProfileTile profile={profile} setOpenSearch={setOpenSearch} />
          </div>
        );
      });
    } catch (error) {
      log("error in renderProfiles");
      log(error);
    }
  }
  return (
    <div className="w-full">
      <div
        className="w-full mx-4  border-b border-b-[#adadad] bg-[transparent]"
        ref={searchInputBoxRef}
      >
        <div className="relative flex w-full">
          <IconButton
            sx={{
              position: "absolute",
              margin: "2px 4px",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <input
            type="text"
            value={searchKey}
            onChange={setSearchString}
            placeholder={`Search withing ${generalContext.currentChatroom?.header}`}
            className="w-full py-3 focus:border-0 focus:outline-0 active:border-0 focus:outline-0 px-14 bg-transparent"
          />
        </div>
      </div>
      <div
        className="w-full mx-4 max-h-[400px] overflow-auto"
        id="conversations-holder"
      >
        <InfiniteScroll
          hasMore={loadMoreConversations}
          scrollableTarget="conversations-holder"
          dataLength={(() => {
            if (!!searchArray) {
              return 0;
            } else {
              return searchArray.length;
            }
          })()}
          next={searchFunction}
          loader={null}
        >
          {renderProfiles()}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChannelSearch;
