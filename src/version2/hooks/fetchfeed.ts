import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { myClient } from "../..";
import { log } from "../../sdkFunctions";
import { FeedContext } from "../components/feedContext";

type feedArrayContent = {
    header: string,
    list: Array<{}>
}

export function useFetchFeed(shouldLoadMore: React.Dispatch<boolean>){
    const {mode, operation='', id=''} = useParams();
    const feedContext = useContext(FeedContext)
    useEffect(()=>{
        async function fetchFeed() {
            try {
                switch(mode){
                    case "groups": {
                        fetchActiveGroupFeeds({
                            setFeedList: feedContext.setHomeFeed,
                            currentFeedList: feedContext.homeFeed,
                            setShouldLoadMore: shouldLoadMore
                        })
                    }
                    case "dms": {
            
                    }
                    
                }
            } catch (error) {
                
            }
        }

        fetchFeed()
   
    },[mode])
    
}


//fetches the current feed with secret chatrooms and returns and 
type fetchActiveFeedType = {
    setShouldLoadMore: React.Dispatch<boolean> | any,
    setFeedList: React.Dispatch<Array<{}>> | any,
    currentFeedList: Array<{}>
}

async function fetchActiveGroupFeeds({
    setShouldLoadMore, setFeedList, currentFeedList
}: fetchActiveFeedType){
    try {
        const currentChatroomLength = currentFeedList.length
        const pageNo = Math.floor(currentChatroomLength/10) + 1
        const call = await myClient.getHomeFeedData({
            communityId: parseInt(sessionStorage.getItem("communityId")!),
            page: pageNo
        })
        const chatrooms = call.my_chatrooms;
        if(chatrooms.length<10){
            setShouldLoadMore(false)
        }
        let newChatrooms = currentFeedList.concat(chatrooms)
        setFeedList(newChatrooms)
        return true
    } catch (error) {
        log(`error under function fetchActiveGroupFeed: ${
            error
        } `)
        return false
    }
}



//fetches all available feeds with secret chatrooms and returns and 
type fetchAllFeedType = {
    setShouldLoadMore: React.Dispatch<boolean>,
    setFeedList: React.Dispatch<Array<{}>>,
    currentFeedList: Array<{}>
}

async function fetchAllGroupFeeds({
     setShouldLoadMore, setFeedList, currentFeedList
}: fetchAllFeedType){
    try {
        const currentChatroomLength = currentFeedList.length
        const pageNo = Math.floor(currentChatroomLength/10) + 1
        const call = await myClient.fetchFeedData({
            community_id: parseInt(sessionStorage.getItem("communityId")!),
            page: pageNo,
            order_type: 0
        })
        const chatrooms = call.my_chatrooms;
        if(chatrooms.length<10){
            setShouldLoadMore(false)
        }
        let newChatrooms = currentFeedList.concat(chatrooms)
        setFeedList(newChatrooms)
        return true
    } catch (error) {
        log(`error under function fetchAllGroupFeed: ${
            error
        } `)
        return false
    }
}