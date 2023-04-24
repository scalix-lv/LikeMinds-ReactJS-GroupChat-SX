import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  directMessageChatPath,
  groupMainPath,
  groupPath,
} from "../../../routes";
import { getChatRoomDetails, log, markRead } from "../../../sdkFunctions";
import { FeedContext } from "../../contexts/feedContext";
import { GeneralContext } from "../../contexts/generalContext";
import { RouteContext } from "../../contexts/routeContext";
import {
  fetchActiveGroupFeeds,
  useFetchFeed,
  fetchAllGroupFeeds,
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
import { onValue, ref } from "firebase/database";

const Feeds: React.FC = () => {
  const [loadMoreHomeFeed, setLoadMoreHomeFeed] = useState<boolean>(true);
  const [loadMoreAllFeed, setLoadMoreAllFeed] = useState<boolean>(true);
  const { mode, id } = useParams();
  const feedContext = useContext(FeedContext);
  const { homeFeed, setHomeFeed, allFeed, setAllFeed } = feedContext;
  const generalContext = useContext(GeneralContext);
  const routeContext = useContext(RouteContext);
  const navigate = useNavigate();
  const leaveChatroomContextRefresh = async () => {
    try {
      let newHomeFeed = [];
      newHomeFeed = homeFeed.filter((group: any) => {
        return group?.chatroom?.id != id;
      });
      let newAllFeed = [];
      newAllFeed = allFeed.map((group: any) => {
        if (group.id == id) {
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
        if (group.id == id) {
          group.follow_status = true;
        }
        return group;
      });
      setHomeFeed!(newHomeFeed);
      setAllFeed!(newAllFeed);
      // navigate(groupMainPath + "/" + id);
    } catch (error) {
      log(error);
    }
  };
  useFetchFeed(
    setLoadMoreHomeFeed,
    setLoadMoreAllFeed,
    loadMoreHomeFeed,
    loadMoreAllFeed
  );
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
            loadMoreHome={loadMoreHomeFeed}
            loadMoreAll={loadMoreAllFeed}
            setShouldLoadMoreHome={setLoadMoreHomeFeed}
            setShouldLoadMoreAll={setLoadMoreAllFeed}
          />
        );
      }
    }
  }

  return (
    <>
      <Searchbar />
      {homeFeed.length > 0 ? getFeed() : null}
    </>
  );
};

export default Feeds;

function GroupFeedContainer({
  loadMoreHome,
  loadMoreAll,
  setShouldLoadMoreHome,
  setShouldLoadMoreAll,
}: any) {
  const { id = "" } = useParams();
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
      const communityId = sessionStorage.getItem("communityId");
      let groupHomeFeedCall: any = await myClient.getHomeFeedData({
        communityId: communityId!,
        page: 1,
      });
      if (homeFeed.length < 10) {
        setHomeFeed!(groupHomeFeedCall.my_chatrooms);
      } else {
        let newHomeFeed = groupHomeFeedCall.my_chatrooms;
        const firstFeedEl: any = homeFeed[0];
        const firstFeedId = firstFeedEl?.chatroom.id;
        let index;
        for (let ind in newHomeFeed) {
          if (newHomeFeed[ind]?.chatroom?.id == firstFeedId) {
            index = ind;
            break;
          }
        }
        let newFeedFirstHalf = newHomeFeed.slice(0, index);
        let oldFeed = homeFeed.map((item: any) => {
          if (newFeedFirstHalf.includes(item.chatroom.id)) {
            return null;
          } else {
            return item;
          }
        });
        let newFeedRestHalf = oldFeed.filter((item) => {
          return item != null;
        });
        newHomeFeed = newFeedFirstHalf.concat(newFeedRestHalf);
        log(newHomeFeed);
        setHomeFeed!(newHomeFeed);
      }
    } catch (error) {
      log(error);
    }
  }
  useEffect(() => {
    let chatroomObject: any = homeFeed[0];
    let id = chatroomObject?.chatroom.id;
    navigate(groupMainPath + "/" + id);
  }, []);
  const fb = myClient.fbInstance();
  useEffect(() => {
    const communityId = sessionStorage.getItem("communityId");
    log(communityId);
    let query = ref(fb, `community/${communityId}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        log(snapshot.val());
        refreshHomeFeed();
      }
    });
  }, []);
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
        {secretChatrooms.map((group: any) => {
          return (
            <GroupInviteTile
              title={group.chatroom.header}
              id={group.chatroom.id}
              response={invitationResponse}
            />
          );
        })}
        {homeFeed.map((group: any, groupIndex) => {
          return (
            <Link
              to={groupMainPath + "/" + group?.chatroom?.id}
              onClick={() => {
                if (id != group.chatroom.id) {
                  generalContext.setChatroomUrl(
                    group?.chatroom?.chatroom_image_url!
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
          );
        })}
        <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
          <span>{"All Members"}</span>
        </div>
        {allFeed.map((group: any) => {
          return (
            <GroupAllFeedTile
              groupTitle={group.header}
              chatroomId={group.id}
              followStatus={group.follow_status}
              key={group.id}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
}

function DirectMessagesFeedContainer({
  loadMoreHome,
  loadMoreAll,
  setShouldLoadMoreHome,
  setShouldLoadMoreAll,
}: any) {
  const { mode, id = "" } = useParams();
  const feedContext = useContext(FeedContext);
  const { homeFeed, setHomeFeed, allFeed, setAllFeed } = feedContext;
  const navigate = useNavigate();
  useEffect(() => {
    let chatroomObject: any = homeFeed[0];
    let id = chatroomObject?.chatroom.id;
    navigate(directMessageChatPath + "/" + id);
  }, []);
  return (
    <>
      <div
        id="home-feed-container"
        className="min-h-[350px] max-h-[400px] overflow-auto border-b border-solid border-[#EEEEEE]"
      >
        <InfiniteScroll
          hasMore={loadMoreHome}
          next={() => {
            fetchActiveHomeFeeds({
              setShouldLoadMore: setShouldLoadMoreHome,
              currentFeedList: homeFeed,
              setFeedList: setHomeFeed,
            });
          }}
          dataLength={homeFeed.length}
          loader={null}
          scrollableTarget="home-feed-container"
        >
          {homeFeed.map((group: any) => {
            return <DmTile key={group.chatroom.id} profile={group} />;
          })}
        </InfiniteScroll>
      </div>
      <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
        <span>{mode === "groups" ? "All Public Groups" : "All Members"}</span>
      </div>
      <div className="max-h-[400px] overflow-auto" id="all-feed-container">
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
            return <DmMemberTile key={group.id} profile={group} />;
          })}
        </InfiniteScroll>
      </div>
    </>
  );
}
