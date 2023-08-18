import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useRef, useState, useContext } from 'react';
import filterIcon from '../../../assets/svg/menu.svg';
import searchIcon from '../../../assets/svg/searchBoxIcon.svg';
import { myClient } from '../../..';
import SearchBarContainer from './searchbarContainer';
import { CT_EVENTS } from '../../../../../analytics/clevertap/constants';
import CleverTap from '../../../../../analytics/clevertap/CleverTap';
import { FeedContext } from '../../contexts/feedContext';

const Searchbar = ({ leaveChatroomContextRefresh, mode }: any) => {
  const [searchString, setSearchString] = useState('');
  const [searchResultObject, setSearchResultObject] = useState<any>([]);
  const [showSearchContainer, setShowSearchContainer] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(true);
  const feedContext = useContext(FeedContext);
  const { dmAllFeed }: any = feedContext;
  const ref = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSearchContainer(false);
        setSearchString('');
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  useEffect(() => {
    const searchTimeOut = setTimeout(async () => {
      try {
        if (searchString === '') {
          setSearchResultObject([]);
          return;
        }
        setShouldShowLoading(true);
        if (mode === 'groups') {
          const callFollowed = await myClient.searchChatroom({
            followStatus: true,
            search: searchString,
            pageSize: 200,
            page: 1,
            searchType: 'header'
          });
          const callUnFollowed = await myClient.searchChatroom({
            followStatus: false,
            search: searchString,
            pageSize: 200,
            page: 1,
            searchType: 'header'
          });
          const obj = [];
          obj[0] = { 'Followed Groups': callFollowed?.data?.chatrooms };
          obj[1] = { 'Other Groups': callUnFollowed?.data?.chatrooms };

          setSearchResultObject(obj);
        } else {
          const serchedDm: any = dmAllFeed?.filter((participant: any) => participant?.name?.includes(searchString));
          const obj = [];
          obj[0] = { 'All Members': serchedDm };
          setSearchResultObject(obj);
        }
        setShouldShowLoading(false);

        // // // console.log(obj);
      } catch (error) {
        // // // console.log(error);
      }
    }, 500);

    return () => {
      clearTimeout(searchTimeOut);
    };
  }, [searchString]);

  useEffect(() => {
    // // // console.log(showSearchContainer);
  }, [showSearchContainer]);
  return (
    <div>
      <Box ref={ref} className="p-[20px] pb-6 flex justify-between relative z-10">
        <TextField
          autoComplete="off"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment className="mr-[16px]" position="start">
                <img src={searchIcon} alt="Search Icon" />
              </InputAdornment>
            ),
            endAdornment:
              searchString.length > 1 ? (
                <InputAdornment className="mr-8" position="end">
                  <IconButton onClick={() => setSearchResultObject(false)} />
                </InputAdornment>
              ) : null,
            sx: {
              fontFamily: 'Lato',
              borderRadius: '10px',
              border: '1px solid #EEEEEE'
              // width: "370px",
            },
            className: ' font-[300] text-[14px] h-[48px] w-[100%]'
          }}
          placeholder={mode === 'groups' ? 'Search for groups' : 'Search for Message'}
          value={searchString}
          onChange={(e) => {
            if (location?.pathname?.includes('/community/groups/main/')) {
              CleverTap.pushEvents(CT_EVENTS.NETWORK.GROUP.SEARCH, {
                search: e.target.value
              });
            } else if (location?.pathname?.endsWith('/community/direct-messages')) {
              CleverTap.pushEvents(CT_EVENTS.NETWORK.CHAT.SEARCH, {
                search: e.target.value
              });
            }
            setSearchString(e.target.value);
          }}
          onFocus={() => {
            setShowSearchContainer(true);
          }}
        />
        <div className="ml-2 hidden">
          <img src={filterIcon} alt="filter icon" />
        </div>
      </Box>
      <div
        style={{
          display: showSearchContainer && searchString.length > 0 ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          height: '100%',
          width: '100%',
          position: 'fixed',
          top: '0',
          left: '0',
          zIndex: '9'
        }}
      />
      <div
        style={{
          display: showSearchContainer && searchString.length > 0 ? 'block' : 'none',
          position: 'absolute',
          zIndex: 10,
          width: '100%'
        }}
      >
        <SearchBarContainer
          searchResults={searchResultObject}
          shouldShowLoading={shouldShowLoading}
          leaveChatroomContextRefresh={leaveChatroomContextRefresh}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default Searchbar;
