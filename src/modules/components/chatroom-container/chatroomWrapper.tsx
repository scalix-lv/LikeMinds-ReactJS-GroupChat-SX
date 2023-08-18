/* eslint-disable react/jsx-no-constructed-context-values */
import { useContext, useEffect, useState } from 'react';
import ChatContainer from '.';
import ChatroomContext from '../../contexts/chatroomContext';
import { GeneralContext } from '../../contexts/generalContext';
import Tittle from '../chatroom-title';
import SelectChatroom from '../select-chatroom';
import { UserContext } from '../../contexts/userContext';
import GroupInfo from '../chatroom-info';
import routeVariable from '../../../enums/routeVariables';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import UserProfileView from '../../../../../modules/common/userProfileView';
import ChannelSearch from '../channel-search';
import NoDataPage from '../../../../../modules/common/noDataPage/NoDataPage';
import { IconConstant } from '../../../../../constants/IconConstants';
import { getColor } from '../../../../../globalColors/Colors';

const getChatroomComponents = (operation: string) => {
  switch (operation) {
    case '/':
      return <SelectChatroom />;
    case 'main':
      return <ChatContainer />;
    case 'info':
      return <GroupInfo />;
    case 'personal-info':
      return null;
    // case 'invitation': return <InvitationScreen/>
    default: {
      return <SelectChatroom />;
    }
  }
};
const ChatroomWrapper: React.FC = () => {
  const [conversationList, setConversationList] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState({});
  const [isSelectedConversation, setIsSelectedConversation] = useState(false);
  const [showReplyPrivately, setShowReplyPrivately] = useState(false);
  const [replyPrivatelyMode, setReplyPrivatelyMode] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const { state } = useLocation();
  const generalContext = useContext(GeneralContext);
  const userContext = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  const { status } = params;
  const id = params[routeVariable.id];
  const mode = params[routeVariable.mode];
  const operation = params[routeVariable.operation];
  function getChatroomDisplayName() {
    if (mode === 'groups') {
      return generalContext?.currentChatroom?.header;
    }
    const currentUserId = userContext?.currentUser?.id;
    const generalContextUserIds = generalContext?.currentChatroom?.member?.id;
    if (currentUserId === generalContextUserIds) return generalContext?.currentChatroom?.chatroom_with_user?.name;
    return generalContext?.currentChatroom?.member?.name;
  }
  function getChatroomImageUrl() {
    if (generalContext?.chatroomUrl?.length > 0) {
      return generalContext?.chatroomUrl;
    }
    return generalContext?.currentChatroom?.chatroom_image_url;
  }
  function resetChatroomContext() {
    setConversationList([]);
    setSelectedConversation({});
    setIsSelectedConversation(false);
    setShowReplyPrivately(false);
    setReplyPrivatelyMode(null);
    setOpenSearch(false);
    generalContext.setChatroomUrl('');
    generalContext.setCurrentChatroom({});
    generalContext.setCurrentProfile({});
    generalContext.setShowLoadingBar(false);
    generalContext.setSnackBarMessage('');
  }
  useEffect(() => {
    if (operation === 'personal-info') generalContext.setShowLoadingBar(false);
    return () => {
      resetChatroomContext();
    };
  }, [mode, id]);

  return (
    <ChatroomContext.Provider
      value={{
        conversationList,
        setConversationList,
        selectedConversation,
        setSelectedConversation,
        isSelectedConversation,
        setIsSelectedConversation,
        showReplyPrivately,
        setShowReplyPrivately,
        replyPrivatelyMode,
        setReplyPrivatelyMode
      }}
    >
      {!openSearch ? (
        mode !== 'groups' && operation === 'personal-info' ? (
          <Box mt="1rem" ml="2rem">
            <Link
              // className={classes.button}
              style={{
                textTransform: 'none',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.063rem',
                color: getColor('primary', 50),
                fontWeight: '700',
                textDecoration: 'none',
                filter:
                  'invert(61%) sepia(58%) saturate(6436%) hue-rotate(200deg) brightness(99%) contrast(96%) !important',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigate(-1);
              }}
            >
              <img src={IconConstant?.ARROW_LEFT_BLUE_ICON} alt="back button arrow" />
              Back
            </Link>
            <UserProfileView
              userData={{ user_unique_id: status }}
              callBack={() => navigate(`/community/direct-messages/main/${state?.chatroomId}`)}
              callBackButtonText="Message"
            />
          </Box>
        ) : Object?.keys(generalContext?.currentChatroom || {})?.length ? (
          <>
            <Tittle
              title={getChatroomDisplayName()}
              memberCount={mode === 'groups' ? generalContext?.currentProfile?.participant_count : null}
              chatroomUrl={getChatroomImageUrl()}
              openSearch={openSearch}
              setOpenSearch={setOpenSearch}
            />
            {getChatroomComponents(operation!)}
          </>
        ) : (
          <NoDataPage
            multiLine
            line1="Oops!"
            line2={mode !== 'groups' ? 'You have not initiated any chat' : 'You have not joined any Gorup'}
          />
        )
      ) : (
        <>
          <ChannelSearch setOpenSearch={setOpenSearch} />
        </>
      )}
    </ChatroomContext.Provider>
  );
};

export default ChatroomWrapper;
