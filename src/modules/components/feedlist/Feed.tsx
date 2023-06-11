/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import {
  directMessageChatPath,
  groupMainPath,
  groupPath,
} from "../../../routes";
import { dmChatFeed, getChatRoomDetails, log } from "../../../sdkFunctions";
import { FeedContext } from "../../contexts/feedContext";
import { GeneralContext } from "../../contexts/generalContext";
import { RouteContext } from "../../contexts/routeContext";
import {
  useFetchFeed,
  fetchActiveHomeFeeds,
  loadGroupFeed,
  invitationResponse,
  fetchAllDMFeeds,
} from "../../hooks/fetchfeed";
import GroupAllFeedTile from "../feed-tiles/groupAllFeedTile";
import { GroupHomeTile } from "../feed-tiles/groupHomeTile";
import DmTile from "../feed-tiles/dmHomefeedTile";
import DmMemberTile from "../feed-tiles/DmAllMemberTiles";
import Searchbar from "../feed-search-bar";
import GroupInviteTile from "../feed-tiles/invitationTiles";
import { myClient } from "../../..";
import SkeletonFeed from "../feed-skeleton";
import routeVariable from "../../../enums/routeVariables";
import { UserContext } from "../../contexts/userContext";

const Feeds: React.FC = () => {
  const [loadMoreHomeFeed, setLoadMoreHomeFeed] = useState<boolean>(true);
  const [loadMoreAllFeed, setLoadMoreAllFeed] = useState<boolean>(true);
  const [loadDmMoreHomeFeed, setLoadDmMoreHomeFeed] = useState<boolean>(true);
  const [loadDmMoreAllFeed, setLoadDmMoreAllFeed] = useState<boolean>(true);
  const params = useParams();
  const id: any = params[routeVariable.id];
  const mode: any = params[routeVariable.mode];
  const operation: any = params[routeVariable.operation];
  useEffect(() => {
    log(id);
    log(mode);
    log(operation);
  });
  const feedContext = useContext(FeedContext);
  const { homeFeed, setHomeFeed, allFeed, setAllFeed, dmHomeFeed } =
    feedContext;
  const generalContext = useContext(GeneralContext);
  const navigate = useNavigate();
  const leaveChatroomContextRefresh = async () => {
    try {
      let newHomeFeed = [];
      newHomeFeed = homeFeed.filter((group: any) => group?.chatroom?.id !== id);
      let newAllFeed = [];
      newAllFeed = allFeed.map((group: any) => {
        if (group.id === id) {
          group.follow_status = false;
        }
        return group;
      });
      setHomeFeed!(newHomeFeed);
      setAllFeed!(newAllFeed);
      navigate(groupPath);
    } catch (error) {
      log(error);
    }
  };
  const joinChatroomContextRefresh = async (e: any) => {
    try {
      const id = e.detail;
      const feedcall: any = await getChatRoomDetails(myClient, id);
      generalContext.setCurrentProfile(feedcall.data);
      generalContext.setCurrentChatroom(feedcall.data.chatroom);
      let newHomeFeed = [...homeFeed];
      newHomeFeed = [feedcall.data].concat(newHomeFeed);
      let newAllFeed = [];
      newAllFeed = allFeed.map((group: any) => {
        if (group.id === id) {
          group.follow_status = true;
        }
        return group;
      });
      setHomeFeed!(newHomeFeed);
      setAllFeed!(newAllFeed);
    } catch (error) {
      log(error);
    }
  };
  useFetchFeed(
    setLoadMoreHomeFeed,
    setLoadMoreAllFeed,
    loadMoreHomeFeed,
    loadMoreAllFeed,
    setLoadDmMoreHomeFeed,
    setLoadDmMoreAllFeed,
    loadDmMoreHomeFeed,
    loadDmMoreAllFeed
  );
  // useEffect(() => {
  //   return () => {
  //     setLoadDmMoreAllFeed(true);
  //     setLoadMoreAllFeed(true);
  //     setLoadDmMoreHomeFeed(true);
  //     setLoadMoreHomeFeed(true);
  //   };
  // }, [mode]);
  useEffect(() => {
    document.addEventListener("leaveEvent", leaveChatroomContextRefresh);
    document.addEventListener("joinEvent", joinChatroomContextRefresh);
    return () => {
      document.removeEventListener("leaveEvent", leaveChatroomContextRefresh);
      document.removeEventListener("joinEvent", joinChatroomContextRefresh);
    };
  });

  function getFeed() {
    switch (mode) {
      case "groups": {
        return (
          <GroupFeedContainer
            loadMoreHome={loadMoreHomeFeed}
            loadMoreAll={loadMoreAllFeed}
            setShouldLoadMoreHome={setLoadMoreHomeFeed}
            setShouldLoadMoreAll={setLoadMoreAllFeed}
          />
        );
      }

      case "direct-messages": {
        return (
          <DirectMessagesFeedContainer
            loadMoreHome={loadDmMoreHomeFeed}
            loadMoreAll={loadDmMoreAllFeed}
            setShouldLoadMoreHome={setLoadDmMoreHomeFeed}
            setShouldLoadMoreAll={setLoadDmMoreAllFeed}
          />
        );
      }
      default:
        return null;
    }
  }

  return (
    <>
      <Searchbar />
      {getFeed()}
    </>
  );
};

export default Feeds;

const GroupFeedContainer = ({
  loadMoreHome,
  loadMoreAll,
  setShouldLoadMoreHome,
  setShouldLoadMoreAll,
}: any) => {
  const params = useParams();
  const id: any = params[routeVariable.id];
  const mode: any = params[routeVariable.mode];
  const operation: any = params[routeVariable.operation];
  const feedContext = useContext(FeedContext);
  const generalContext = useContext(GeneralContext);
  const routeContext = useContext(RouteContext);
  const {
    secretChatrooms,
    setSecretChatrooms,
    homeFeed,
    setHomeFeed,
    allFeed,
    setAllFeed,
  } = feedContext;
  const navigate = useNavigate();

  async function refreshHomeFeed() {
    try {
      const groupHomeFeedCall: any = await myClient.getHomeFeed({ page: 1 });
      if (homeFeed.length < 10) {
        setHomeFeed!(groupHomeFeedCall.my_chatrooms);
      } else {
        let newHomeFeed = groupHomeFeedCall.my_chatrooms;
        const firstFeedEl: any = homeFeed[0];
        const firstFeedId = firstFeedEl?.chatroom.id;
        let index;
        for (const ind in newHomeFeed) {
          if (newHomeFeed[ind]?.chatroom?.id === firstFeedId) {
            index = ind;
            break;
          }
        }
        const newFeedFirstHalf = newHomeFeed.slice(0, index);
        const newFeedFirstHalfIDs = newFeedFirstHalf.map(
          (item: any) => item.chatroom.id
        );
        const oldFeed = homeFeed.map((item: any) => {
          if (newFeedFirstHalfIDs.includes(item.chatroom.id)) {
            return null;
          }
          return item;
        });
        const newFeedRestHalf = oldFeed.filter((item) => item != null);
        newHomeFeed = newFeedFirstHalf.concat(newFeedRestHalf);
        setHomeFeed!(newHomeFeed);
        document.dispatchEvent(new CustomEvent("feedLoaded", { detail: true }));
      }
    } catch (error) {
      log(error);
    }
  }
  function localRefreshHomeFeed(e: any) {
    const topFeed: any = [];
    let newHomeFeed = homeFeed.filter((item: any) => {
      if (item.chatroom.id == e.detail) {
        topFeed.push(item);
      }
      return item.chatroom.id != e.detail;
    });
    newHomeFeed = topFeed.concat(newHomeFeed);
    setHomeFeed!(newHomeFeed);
  }
  function localRefreshInviteList(id: any) {
    const newSecretChatrooms: any = secretChatrooms.filter((chatroom: any) => {
      log(chatroom);
      log(id);
      log("new one");
      if (chatroom?.chatroom?.id !== id) {
        return true;
      }
    });
    setSecretChatrooms!(newSecretChatrooms);
  }

  useEffect(() => {
    if (mode == "groups" && id == undefined) {
      const chatroomObject: any = homeFeed[0];
      const chatroomId = chatroomObject?.chatroom?.id;
      if (chatroomId == undefined) {
        return;
      }
      navigate(`${groupMainPath}/${chatroomId}`);
    }
  }, [homeFeed]);
  const fb = myClient.fbInstance();
  useEffect(() => {
    if (id === undefined) {
      return;
    }
    const communityId = sessionStorage.getItem("communityId");
    const query = ref(fb, `community/${communityId}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        log("the firebase val is");
        log(snapshot.val());
        const chatroomId = snapshot.val().chatroom_id;
        if (chatroomId != id) refreshHomeFeed();
      }
    });
  }, [id]);
  useEffect(() => {
    feedContext.setDmAllFeed!([]);
    feedContext.setDmHomeFeed!([]);
  }, [mode]);
  useEffect(() => {
    return () => {
      setShouldLoadMoreAll(true);
      setShouldLoadMoreHome(true);
    };
  }, [mode]);
  useEffect(() => {
    document.addEventListener("sentMessage", localRefreshHomeFeed);
    return () => {
      document.removeEventListener("sentMessage", localRefreshHomeFeed);
    };
  });
  return (
    <div
      id="home-feed-container"
      className="max-h-[100%] overflow-auto border-b border-solid border-[#EEEEEE]"
    >
      <InfiniteScroll
        hasMore={loadMoreHome || loadMoreAll}
        next={() => {
          loadGroupFeed(
            setSecretChatrooms,
            homeFeed,
            setHomeFeed,
            allFeed,
            setAllFeed,
            loadMoreHome,
            setShouldLoadMoreHome,
            loadMoreAll,
            setShouldLoadMoreAll
          );
        }}
        dataLength={homeFeed.length + secretChatrooms.length + allFeed.length}
        loader={null}
        scrollableTarget="home-feed-container"
      >
        {allFeed.length === 0 ? (
          <SkeletonFeed />
        ) : (
          <>
            <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
              <span>Joined Groups</span>
            </div>
            {secretChatrooms.map((group: any) => (
              <GroupInviteTile
                title={group.chatroom.header}
                id={group.chatroom.id}
                response={invitationResponse}
                refreshHomeFeed={refreshHomeFeed}
                localRefreshInviteList={localRefreshInviteList}
              />
            ))}
            {homeFeed.map((group: any, groupIndex) => (
              <Link
                to={`${groupMainPath}/${group?.chatroom?.id}`}
                onClick={() => {
                  if (id != group.chatroom.id) {
                    generalContext.setChatroomUrl(
                      group?.chatroom?.chatroom_image_url
                    );
                    generalContext.setShowLoadingBar(true);
                  }
                  routeContext.setIsNavigationBoxOpen(
                    !routeContext.isNavigationBoxOpen
                  );
                }}
                key={group.chatroom.id + groupIndex + group.chatroom.header}
              >
                <GroupHomeTile
                  key={group.chatroom.id + groupIndex}
                  groupTitle={group.chatroom.header}
                  chatroomId={group.chatroom.id}
                  isSecret={group.chatroom.is_secret}
                  unseenConversationCount={group.unseen_conversation_count}
                />
              </Link>
            ))}
            <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
              <span>All Public Groups</span>
            </div>
            {allFeed.map((group: any) => (
              <GroupAllFeedTile
                groupTitle={group.header}
                chatroomId={group.id}
                followStatus={group.follow_status}
                key={group.id}
                isSecret={group.is_secret}
              />
            ))}
          </>
        )}
      </InfiniteScroll>
    </div>
  );
};

const DirectMessagesFeedContainer = ({
  loadMoreHome,
  loadMoreAll,
  setShouldLoadMoreHome,
  setShouldLoadMoreAll,
}: any) => {
  const params = useParams();
  const id: any = params[routeVariable.id];
  const mode: any = params[routeVariable.mode];
  const feedContext = useContext(FeedContext);
  const userContext = useContext(UserContext);
  const { dmHomeFeed, setDmHomeFeed, dmAllFeed, setDmAllFeed } = feedContext;
  const navigate = useNavigate();
  const db = myClient.fbInstance();
  const allFeed = dmAllFeed;
  const setAllFeed = setDmAllFeed;
  async function refreshHomeFeed() {
    try {
      const communityId = sessionStorage.getItem("communityId");
      const call: any = await dmChatFeed(communityId!, 1);
      const chatrooms = call.data.dm_chatrooms;
      if (dmHomeFeed.length < 10) {
        setDmHomeFeed!(chatrooms);
      } else {
        let newHomeFeed = chatrooms;
        const firstFeedEl: any = dmHomeFeed[0];
        const firstFeedId = firstFeedEl?.chatroom.id;
        let index;
        for (const ind in newHomeFeed) {
          if (newHomeFeed[ind]?.chatroom?.id == firstFeedId) {
            index = ind;
            break;
          }
        }
        const newFeedFirstHalf = newHomeFeed.slice(0, index);
        const newFeedFirstHalfIDs = newFeedFirstHalf.map(
          (item: any) => item.chatroom.id
        );
        const oldFeed = dmHomeFeed.map((item: any) => {
          if (newFeedFirstHalfIDs.includes(item.chatroom.id)) {
            return null;
          }
          return item;
        });
        const newFeedRestHalf = oldFeed.filter((item) => item != null);
        newHomeFeed = newFeedFirstHalf.concat(newFeedRestHalf);
        setDmHomeFeed!(newHomeFeed);
      }
    } catch (error) {
      log(error);
    }
  }
  useEffect(() => {
    if (mode == "direct-messages" && id == "") {
      const chatroomObject: any = dmHomeFeed[0];
      const chatroomIds = chatroomObject?.chatroom?.id;
      if (chatroomIds == undefined) {
        return;
      }
      navigate(`${directMessageChatPath}/${chatroomIds}`);
    }
  }, [dmHomeFeed]);
  useEffect(() => {
    const query = ref(db, "collabcards");
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        refreshHomeFeed();
        // }
      }
    });
  }, [id]);
  useEffect(() => {
    feedContext.setAllFeed!([]);
    feedContext.setHomeFeed!([]);
  }, [mode]);
  return (
    <>
      <div
        id="home-feed-container"
        className="max-h-[400px] overflow-auto border-b border-solid border-[#EEEEEE]"
      >
        <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
          <span>Direct Messages</span>
        </div>
        {dmHomeFeed.length > 0 ? (
          <InfiniteScroll
            hasMore={loadMoreHome}
            next={() => {
              fetchActiveHomeFeeds({
                setShouldLoadMore: setShouldLoadMoreHome,
                currentFeedList: dmHomeFeed,
                setFeedList: setDmHomeFeed,
              });
            }}
            dataLength={dmHomeFeed.length}
            loader={null}
            scrollableTarget="home-feed-container"
          >
            {dmHomeFeed.map((group: any) => (
              <DmTile key={group.chatroom.id} profile={group} />
            ))}
          </InfiniteScroll>
        ) : (
          <SkeletonFeed />
        )}
      </div>
      <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
        <span>{mode === "groups" ? "All Public Groups" : "All Members"}</span>
      </div>
      <div className="max-h-[100%] overflow-auto" id="all-feed-container">
        {dmAllFeed.length > 0 ? (
          <InfiniteScroll
            loader={null}
            dataLength={allFeed.length}
            hasMore={loadMoreAll}
            scrollableTarget="all-feed-container"
            next={() => {
              fetchAllDMFeeds({
                setShouldLoadMore: setShouldLoadMoreAll,
                currentFeedList: allFeed,
                setFeedList: setAllFeed,
              });
            }}
          >
            {allFeed.map((group: any) => {
              if (group?.id === userContext?.currentUser?.id) {
                return null;
              }
              return <DmMemberTile key={group.id} profile={group} />;
            })}
          </InfiniteScroll>
        ) : (
          <SkeletonFeed />
        )}
      </div>
    </>
  );
};
