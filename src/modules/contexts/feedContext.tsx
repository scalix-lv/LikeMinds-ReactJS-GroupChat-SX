import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { log } from "../../sdkFunctions";

type childrenType = {
  children: any;
};

const FeedContextProvider: React.FC<childrenType> = ({
  children,
}: childrenType) => {
  const [homeFeed, setHomeFeed] = useState<Array<any>>([]);
  const [allFeed, setAllFeed] = useState<Array<any>>([]);
  const [secretChatrooms, setSecretChatrooms] = useState<Array<any>>([]);
  const [modeCounter, setModeCounter] = useState(0);
  const { mode } = useParams();
  useEffect(() => {
    setHomeFeed([]);
    setAllFeed([]);
    setSecretChatrooms([]);
    setModeCounter(0);
  }, [mode]);
  useEffect(() => {
    if (modeCounter == 0) {
      if (
        homeFeed.length == 0 &&
        allFeed.length == 0 &&
        secretChatrooms.length == 0
      ) {
        setModeCounter(1);
      }
    }
  });
  return (
    <FeedContext.Provider
      value={{
        homeFeed,
        allFeed,
        secretChatrooms,
        setHomeFeed,
        setAllFeed,
        setSecretChatrooms,
      }}
    >
      {modeCounter == 1 ? children : null}
    </FeedContext.Provider>
  );
};

type feedContext = {
  homeFeed: Array<{}>;
  allFeed: Array<{}>;
  secretChatrooms: Array<{}>;
  setHomeFeed: React.Dispatch<Array<{}>> | null;
  setAllFeed: React.Dispatch<Array<{}>> | null;
  setSecretChatrooms: React.Dispatch<Array<{}>> | null;
};

export const FeedContext = React.createContext<feedContext>({
  homeFeed: [],
  allFeed: [],
  secretChatrooms: [],
  setHomeFeed: null,
  setAllFeed: null,
  setSecretChatrooms: null,
});

export default FeedContextProvider;
