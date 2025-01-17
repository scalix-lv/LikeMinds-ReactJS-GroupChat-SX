/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { UserContext } from '../../contexts/userContext';
import { getChatRoomDetails, joinChatRoom, leaveChatRoom, leaveSecretChatroom } from '../../../sdkFunctions';
import NotFoundLogo from '../../../assets/Icon.png';
import { groupMainPath, groupPath } from '../../../routes';
import { GeneralContext } from '../../contexts/generalContext';
import routeVariable from '../../../enums/routeVariables';
import { Loader } from '../../../../../modules/common/loader/Loader';
import NoDataPage from '../../../../../modules/common/noDataPage/NoDataPage';
import { myClient } from '../../..';
import DmMemberTile from '../feed-tiles/DmAllMemberTiles';

const MatchTileHead = ({ matchObject, title, leaveChatroomContextRefresh }: any) => (
  <div>
    <div
      className="text-base px-4 py-5   mt-3                     
                      h-14 w-[100%] border-b border-b-solid border-b-[#EEEEEE]
                      flex items-center
                      "
    >
      <span
        className="text-xl font-sans text-center font-semibold
                          leading-6 text-[#323232] h-6
                          "
      >
        {title}
      </span>
    </div>
    {matchObject?.map((searchItem: any, searchIndex: any) => (
      <MatchTileFields
        title={searchItem?.chatroom?.header}
        key={searchItem?.chatroom?.title + searchIndex}
        match={searchItem}
        showJoinButton={title === 'Other Groups'}
        leaveChatroomContextRefresh={leaveChatroomContextRefresh}
      />
    ))}
  </div>
);

const MatchFoundContainer = ({ matchArray, title, leaveChatroomContextRefresh }: any) => {
  if (matchArray.length > 0) {
    return (
      <MatchTileHead matchObject={matchArray} title={title} leaveChatroomContextRefresh={leaveChatroomContextRefresh} />
    );
  }
  return null;
};

const MatchTileFields = ({ title, match, showJoinButton, leaveChatroomContextRefresh }: any) => {
  const generalContext = useContext(GeneralContext);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();
  const id: any = params[routeVariable.id];
  const mode: any = params[routeVariable.mode];
  const operation: any = params[routeVariable.operation];
  async function joinGroup() {
    try {
      const call = await joinChatRoom(match.chatroom.id, userContext.currentUser.id);
      if (!call.error) {
        navigate(`${groupMainPath}/${match.chatroom.id}`);
      }
    } catch (error) {
      // // // console.log(error);
    }
  }
  async function leaveGroup() {
    try {
      const call = match.chatroom.is_secret
        ? await leaveSecretChatroom(match.chatroom.id, userContext.currentUser?.user_unique_id)
        : await leaveChatRoom(match.chatroom.id, userContext.currentUser?.user_unique_id);
      if (leaveChatroomContextRefresh) leaveChatroomContextRefresh();
    } catch (error) {
      // // // console.log(error);
    }
  }

  return (
    <div
      className="flex items-center
                        px-4 py-5 bg-white
                        h-[54px] border-b border-b-solid border-b-[#EEEEEE]
                        cursor-pointer
                        justify-between"
      onClick={() => {
        navigate(`${groupMainPath}/${match.chatroom.id}`);
      }}
    >
      <span className="leading-[19px] font-normal text-center font-normal text-[#323232]">{title}</span>
      {showJoinButton ? (
        <Button
          sx={{ color: '#3884F7', textTransform: 'none' }}
          className=""
          variant="outlined"
          onClick={() => {
            joinGroup();
          }}
        >
          Join
        </Button>
      ) : (
        <Button
          sx={{ color: '#3884F7', textTransform: 'none' }}
          className=""
          variant="outlined"
          onClick={() => {
            leaveGroup();
          }}
        >
          Leave
        </Button>
      )}
    </div>
  );
};

const NothingFound = ({ shouldShowLoading }: any) => (
  <div className="flex justify-center items-center flex-col px-14 py-7 w-[100%] rounded-[10px] border ">
    {shouldShowLoading ? (
      <Loader height="10rem" width="10rem" />
    ) : (
      <NoDataPage multiLine line1="Oops!" line2="There are no result found related to this search" />
    )}
  </div>
);

const SearchBarContainer = ({ searchResults, shouldShowLoading, leaveChatroomContextRefresh, mode }: any) => {
  const [searchArray, setSearchArray] = useState<any>([]);
  const [shouldShowSearchScreen, setShouldShowSearchScreen] = useState(false);
  useEffect(() => {
    if (searchResults?.length > 0) {
      setSearchArray(searchResults);
    }
  });
  useEffect(() => {
    if (searchResults?.length > 0) {
      for (const obj of searchResults) {
        if (obj[Object.keys(obj)[0]].length > 0) {
          if (!shouldShowSearchScreen) {
            setShouldShowSearchScreen(true);
          }
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          return () => {};
        }
      }
    }
    if (setShouldShowSearchScreen) {
      setShouldShowSearchScreen(false);
    }
  });

  return (
    <div className="max-h-[500px] w-[100%] rounded-[10px] bg-white overflow-auto">
      {shouldShowSearchScreen ? (
        <>
          {mode === 'groups'
            ? searchArray.map((item: any, _itemIndex: any) => {
                const title = Object.keys(item)[0];
                return (
                  <MatchFoundContainer
                    matchArray={item[title]}
                    key={title}
                    title={title}
                    leaveChatroomContextRefresh={leaveChatroomContextRefresh}
                  />
                );
              })
            : searchArray?.length &&
              searchArray?.[0]?.['All Members']?.map((group: any) => {
                return <DmMemberTile key={group.id} profile={group} />;
              })}
        </>
      ) : (
        <NothingFound shouldShowLoading={shouldShowLoading} />
      )}
      {/* <NothingFound/> */}
    </div>
  );
};

export default SearchBarContainer;

// A context array for getting seacrh fields

export const SearchContext = React.createContext({ contextArray: [] });
