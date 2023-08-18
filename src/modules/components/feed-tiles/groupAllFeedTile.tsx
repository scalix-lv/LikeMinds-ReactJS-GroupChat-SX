import { Button, Typography } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupMainPath, groupPath } from '../../../routes';
import { getChatRoomDetails, joinChatRoom, leaveChatRoom, leaveSecretChatroom } from '../../../sdkFunctions';
import { FeedContext } from '../../contexts/feedContext';
import { GeneralContext } from '../../contexts/generalContext';
import { RouteContext } from '../../contexts/routeContext';
import { UserContext } from '../../contexts/userContext';
import ForumManager from '../../../../../modules/community/managers/ForumManager';
import { myClient } from '../../..';

type GroupAllFeedTileProps = {
  groupTitle: any;
  chatroomId: any;
  followStatus: any;
  isSecret: any;
  refreshHomeFeed: any;
  setAllFeed: any;
  allFeed: any;
};

const GroupAllFeedTile = ({
  groupTitle,
  chatroomId,
  followStatus,
  isSecret,
  refreshHomeFeed,
  setAllFeed,
  allFeed
}: GroupAllFeedTileProps) => {
  const feedContext = useContext(FeedContext);
  const userContext = useContext(UserContext);
  const routeContext = useContext(RouteContext);
  const generalContext = useContext(GeneralContext);
  const forumManager = new ForumManager();
  const navigate = useNavigate();
  async function joinGroup() {
    try {
      const call = await joinChatRoom(chatroomId, userContext.currentUser.id);
      if (!call.error)
        forumManager.updateUserForumInfo({
          group: { name: groupTitle, id: chatroomId },
          follow: true,
          communityIds: [userContext?.currentUser?.user_unique_id]
        });
      // chatroomContext.refreshChatroomContext();
      const joinEvent = new CustomEvent('joinEvent', { detail: chatroomId });
      document.dispatchEvent(joinEvent);
      if (!call.error) {
        navigate(`${groupMainPath}/${chatroomId}`);
      }
    } catch (error) {
      // // // console.log(error);
    }
  }
  async function leaveGroup() {
    try {
      const call = isSecret
        ? await leaveSecretChatroom(chatroomId, userContext.currentUser?.user_unique_id)
        : await leaveChatRoom(chatroomId, userContext.currentUser?.user_unique_id);

      const updatedChatroomDetails: any = await getChatRoomDetails(myClient, chatroomId);
      if (updatedChatroomDetails?.data?.data?.chatroom) {
        const updatedFeed = allFeed?.map((group: any) =>
          group?.id === chatroomId ? updatedChatroomDetails?.data?.data?.chatroom : group
        );
        setAllFeed(updatedFeed);
      }
      if (!call.error) {
        navigate(`${groupPath}`);
        refreshHomeFeed();
      }
    } catch (error) {
      // // // console.log(error);
    }
  }

  return (
    <div
      className="flex justify-between leading-5 py-4 px-5 border-[#EEEEEE] border-t-[1px]"
      onClick={() => {
        routeContext.setIsNavigationBoxOpen(!routeContext.isNavigationBoxOpen);
      }}
    >
      <Typography sx={{ marginTop: '6px' }} component="span" className="text-base font-normal">
        {groupTitle}
        {isSecret === true ? (
          <span className="bg-[#FFEFC6] rounded-[4px] px-[6px] py-[5px] text-[#F6BD2A] line-height-[12px] text-[10px] font-medium m-1">
            Private
          </span>
        ) : null}
      </Typography>
      {!followStatus ? (
        <Button
          sx={{ color: '#3884F7', textTransform: 'none' }}
          variant="outlined"
          className="rounded-[5px]"
          onClick={joinGroup}
        >
          Join
        </Button>
      ) : (
        <Button
          sx={{ color: '#3884F7', textTransform: 'none' }}
          variant="outlined"
          className="rounded-[5px]"
          onClick={leaveGroup}
        >
          Leave
        </Button>
      )}
    </div>
  );
};
export default GroupAllFeedTile;
