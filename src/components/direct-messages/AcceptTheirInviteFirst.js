import { Box, Button, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { myClient, UserContext } from "../..";
import { GroupContext } from "../../Main";
import { dmAction, getChatRoomDetails, log } from "../../sdkFunctions";
import { ChatRoomContext } from "../Groups/Groups";
import acceptLogo from "./../../assets/acceptInvite.png";
import { DmContext } from "./DirectMessagesMain";
import TittleDm from "./TitleDM";

function AcceptTheirInviteFirst({ title }) {
  const dmContext = useContext(DmContext);
  const groupContext = useContext(GroupContext);
  let { pathname } = useLocation();
  const { status } = useParams();
  const chatroomContext = useContext(ChatRoomContext);
  pathname = pathname.split("/")[1];
  async function acceptInvite() {
    try {
      let call = await dmAction(1, dmContext.currentChatroom.id, null);
      let newChatroomObject = await getChatRoomDetails(
        myClient,
        dmContext.currentChatroom.id
      );
      dmContext.setCurrentChatroom(newChatroomObject.data.chatroom);
      dmContext.setCurrentProfile(newChatroomObject.data);
    } catch (error) {
      // // console.log(error);
    }
  }

  async function rejectInvite() {
    try {
      let call = await dmAction(2, dmContext.currentChatroom.id, null);
      let newChatroomObject = await getChatRoomDetails(
        myClient,
        dmContext.currentChatroom.id
      );
      dmContext.setCurrentChatroom(newChatroomObject.data.chatroom);
      dmContext.setCurrentProfile(newChatroomObject.data);
    } catch (error) {
      // // console.log(error);
    }
  }

  return (
    <div className="h-full">
      <Box className="flex justify-center items-center flex-col h-[98%]">
        <div className="grow" />
        <img src={acceptLogo} alt="" />
        <Typography
          fontSize={"24px"}
          fontWeight={700}
          color={"#323232"}
          maxWidth={"400px"}
          textAlign="center"
        >
          Please accept the invite to message {title}
        </Typography>
        {pathname == "direct-messages" ? (
          <div className="flex jusitfy-center">
            {dmContext.currentChatroom.chat_request_state == 0 ? (
              <>
                <Button
                  sx={{
                    background: "#3884F7",
                    color: "white",
                  }}
                  className="bg-[#3884F7] text-white py-4 px-[34px] text-base my-3 hover:text-[#3884F7] hover:bg-[#EBF3FF] mx-2"
                  onClick={acceptInvite}
                >
                  Accept
                </Button>
                <Button
                  sx={{
                    background: "#D65353",
                    color: "white",
                    marginX: "8px",
                  }}
                  className="bg-[#3884F7] text-white py-4 px-[34px] text-base my-3 hover:text-[#3884F7] hover:bg-[#EBF3FF] mx-2"
                  onClick={rejectInvite}
                >
                  Reject
                </Button>
              </>
            ) : dmContext.currentChatroom.chat_request_state == 2 ? (
              <Button
                sx={{
                  background: "#3884F7",
                  color: "white",
                  marginX: "8px",
                }}
                className="bg-[#3884F7] text-white py-4 px-[34px] text-base my-3 hover:text-[#3884F7] hover:bg-[#EBF3FF]"
                onClick={acceptInvite}
              >
                Undo And Accept
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="flex jusitfy-center">
            <Button
              sx={{
                background: "#3884F7",
                color: "white",
                fontSize: "16px",
                fontWeight: 600,
                marginTop: "16px",
              }}
              className="bg-[#3884F7] text-white h-[56px] w-[149px] px-[30px] py-[16px] text-base my-10 hover:text-[#3884F7] hover:bg-[#EBF3FF] mx-2"
              onClick={() => {
                myClient.inviteAction({
                  channel_id: status,
                  invite_status: 1,
                });
                chatroomContext.refreshChatroomContext();
                getChatRoomDetails(myClient, status)
                  .then((res) => {
                    groupContext.setActiveGroup(res.data);
                  })
                  .catch((e) => log(e));
              }}
            >
              Accept
            </Button>
          </div>
        )}
        <div className="grow" />
      </Box>
    </div>
  );
}
export default AcceptTheirInviteFirst;
