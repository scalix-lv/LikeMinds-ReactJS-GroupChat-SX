import { Box, Button, Typography } from "@mui/material";
import React, { useContext } from "react";
import { myClient, UserContext } from "../..";
import { dmAction, getChatRoomDetails } from "../../sdkFunctions";
import acceptLogo from "./../../assets/acceptInvite.png";
import { DmContext } from "./DirectMessagesMain";
import TittleDm from "./TitleDM";

function AcceptTheirInviteFirst({ title }) {
  const dmContext = useContext(DmContext);
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
      console.log(error);
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
      console.log(error);
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

        <div className="grow" />
      </Box>
    </div>
  );
}

export default AcceptTheirInviteFirst;
