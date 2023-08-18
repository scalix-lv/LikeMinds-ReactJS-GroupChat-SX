import { Button, Snackbar } from '@mui/material';
import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { myClient, UserContext } from "../..";
import { myClient } from '../../..';
import { UserContext } from '../../contexts/userContext';
import { RouteContext } from '../../contexts/routeContext';
import { directMessageChatPath, directMessageInfoPath } from '../../../routes';
// import { createDM, getChatRoomDetails, requestDM } from "../../sdkFunctions";
import { createDM, getChatRoomDetails, log, requestDM } from '../../../sdkFunctions';
import { GeneralContext } from '../../contexts/generalContext';
// import { DmContext } from "./DirectMessagesMain";
import CleverTap from '../../../../../analytics/clevertap/CleverTap';
import { CT_EVENTS } from '../../../../../analytics/clevertap/constants';

export async function reqDM(
  profile: any,
  userContext: any,
  dmContext: any,
  setOpenSnackBar: any,
  setSnackBarMessage: any
) {
  try {
    // log(profile);
    const call: any = await requestDM(profile.id, userContext.community.id);
    // let i = 1;

    if (call.data === undefined) {
      alert(call.data.error_message);
      return;
    }
    const callData = call.data;

    if (callData.chatroom_id) {
      let profileData: any = await getChatRoomDetails(myClient, call.data.chatroom_id);
      if (profileData.error) {
        // eslint-disable-next-line no-throw-literal
        throw 'Error';
      }
      profileData = profileData?.data;

      if (profileData.data === undefined) {
        setOpenSnackBar(true);
        setSnackBarMessage('An Error Occoured');
        return;
      }

      // // // console.log(profileData);
      dmContext.setCurrentProfile(profileData.data);
      dmContext.setCurrentChatroom(profileData.data.chatroom);
      return profileData.data.chatroom.id;
    }
    const dmRequestLimit = callData.is_request_dm_limit_exceeded;
    if (!dmRequestLimit) {
      const createDmCall: any = await createDM(profile.id);
      // // // console.log(createDmCall);
      const chatroomDetailsCall: any = await getChatRoomDetails(myClient, createDmCall.data.chatroom.id);
      // // // console.log(chatroomDetailsCall);
      dmContext.setCurrentProfile(chatroomDetailsCall.data);
      dmContext.setCurrentChatroom(chatroomDetailsCall.data.chatroom);
      return chatroomDetailsCall.data.chatroom.id;
    }
    alert(`now message at , ${call.data.new_request_dm_timestamp}`);

    // navigate(directMessageChatPath);
  } catch (error) {
    log(error);
    throw error;
  }
}

const DmMemberTile = ({ profile }: any) => {
  const navigate = useNavigate();
  const dmContext = useContext(GeneralContext);
  const userContext = useContext(UserContext);
  const routeContext = useContext(RouteContext);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const { state } = useLocation();

  if (state?.directMessage && profile?.user_unique_id === state?.communityId) {
    dmContext.setShowLoadingBar(true);
    reqDM(profile, userContext, dmContext, setOpenSnackBar, setSnackBarMessage)
      .then((r) => {
        navigate(`${directMessageInfoPath}/${state?.communityId} `, {
          state: {
            communityId: userContext.community.id,
            memberId: profile.id,
            isFromAllMembers: true,
            chatroomId: r
          }
        });
        dmContext.setShowLoadingBar(false);
      })
      .catch(() => {
        dmContext.setShowLoadingBar(false);
        setOpenSnackBar(true);
        setSnackBarMessage('Error occoured while loading');
      });
  }

  return (
    <div
      className="flex justify-between items-center py-[16px] px-[20px] border-t border-solid border-[#EEEEEE] cursor-pointer"
      style={{
        backgroundColor: dmContext.currentChatroom?.id === profile?.id ? '#ECF3FF' : '#FFFFFF'
      }}
      onClick={() => {
        routeContext.setIsNavigationBoxOpen(!routeContext.isNavigationBoxOpen);
      }}
    >
      <div className="flex flex-col">
        <div className="text-[#323232] text-[16px] capitalize">{profile.name}</div>
        {profile.custom_title ? (
          <div className="text-[12px] text-[#ADADAD]">{profile.custom_title}</div>
        ) : (
          <div className="text-[12px] text-[#ADADAD]">Other</div>
        )}
      </div>

      <div style={{ flexGrow: 1 }} />
      <Button
        variant="contained"
        sx={{
          background: '#3884F7',
          width: '87px',
          height: '34px',
          marginRight: '12px',
          color: 'white',
          ':hover': { background: 'grey' }
        }}
        onClick={() => {
          CleverTap.pushEvents(CT_EVENTS.NETWORK.CHAT.MESSAGE_CLICK);
          dmContext.setShowLoadingBar(true);
          reqDM(profile, userContext, dmContext, setOpenSnackBar, setSnackBarMessage)
            .then((r) => {
              navigate(`${directMessageChatPath}/${r}`);
              dmContext.setShowLoadingBar(false);
            })
            .catch(() => {
              dmContext.setShowLoadingBar(false);
              setOpenSnackBar(true);
              setSnackBarMessage('Error occoured while loading');
            });
        }}
      >
        Message
      </Button>
      <Button
        sx={{
          width: '107px',
          height: '34px',
          paddingX: '3px',
          fontSize: '12px'
        }}
        variant="outlined"
        onClick={() => {
          CleverTap.pushEvents(CT_EVENTS.NETWORK.CHAT.VIEW_PROFILE_CLICK);
          reqDM(profile, userContext, dmContext, setOpenSnackBar, setSnackBarMessage)
            .then((r) => {
              navigate(`${directMessageInfoPath}/${profile?.user_unique_id} `, {
                state: {
                  communityId: userContext.community.id,
                  memberId: profile.id,
                  isFromAllMembers: true,
                  chatroomId: r
                }
              });
              dmContext.setShowLoadingBar(false);
            })
            .catch(() => {
              dmContext.setShowLoadingBar(false);
              setOpenSnackBar(true);
              setSnackBarMessage('Error occoured while loading');
            });
        }}
      >
        View Profile
      </Button>
      {openSnackBar ? (
        <Snackbar
          open={openSnackBar}
          onClose={() => setOpenSnackBar(false)}
          message={snackBarMessage}
          autoHideDuration={3000}
        />
      ) : null}
    </div>
  );
};

export default DmMemberTile;
