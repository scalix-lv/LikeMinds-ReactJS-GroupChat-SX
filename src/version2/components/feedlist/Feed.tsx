import React, { useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useFetchFeed } from "../../hooks/fetchfeed"

const Feeds: React.FC = () => {
    const [loadMoreHomeFeed, setLoadMoreHomeFeed] = useState<boolean>(true)
    const [loadMoreAllFeed, setLoadMoreAllFeed] = useState<boolean>(true)
    useFetchFeed(setLoadMoreHomeFeed)
    return (
        <div className="flex overflow-hidden customHeight flex-1">
              <div
                className={`flex-[.32] bg-white border-r-[1px] border-[#eeeeee] pt-[20px] overflow-auto feed-panel relative `}
              >
                {/* Search Bar */}
                {/* <SearchbarGroups /> */}

                {/* homefeed */}
                {/* <InfiniteScroll
                hasMore={loadMoreHomeFeed}

                > */}

                {/* </InfiniteScroll> */}
               

                {/* All Public Groups */}
              </div>
              
            </div>
    )
}

export default Feeds