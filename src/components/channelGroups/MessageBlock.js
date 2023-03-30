import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UserContext, userObj } from "../..";
import { RouteContext } from "../../Main";
import { directMessagePath } from "../../routes";
import { log } from "../../sdkFunctions";
import MessageBoxDM from "../ChatConversationsArea/MessageBoxDM";
import MessageBox from "./MessageBox";

function MessageBlock({ conversationObject, userId }) {
  const routeContext = useContext(RouteContext);
  const userContext = useContext(UserContext);
  const [convoDetails, setConvoDetails] = useState(conversationObject);
  const currentUser = userContext.currentUser.id;
  let { pathname } = useLocation();
  pathname = pathname.split("/")[1];
  // log(pathname);
  const { step } = useParams();

  // // console.log(step);

  return (
    <Box
      className="flex py-2 px-0 h-full overflow-auto"
      sx={{
        flexDirection: userId === currentUser ? "row-reverse" : "row",
      }}
    >
      {pathname === "direct-messages" ? (
        <MessageBoxDM
          userId={userId}
          username={convoDetails.member.name}
          messageString={convoDetails.answer}
          time={convoDetails.created_at}
          attachments={
            convoDetails.attachments !== undefined
              ? convoDetails.attachments
              : null
          }
          replyConversationObject={convoDetails?.reply_conversation_object}
          convoId={conversationObject.id}
          conversationReactions={conversationObject.reactions}
          conversationObject={conversationObject}
        />
      ) : (
        <MessageBox
          userId={userId}
          username={convoDetails.member.name}
          messageString={convoDetails.answer}
          time={convoDetails.created_at}
          attachments={
            convoDetails.attachments !== undefined
              ? convoDetails.attachments
              : null
          }
          replyConversationObject={convoDetails?.reply_conversation_object}
          convoId={conversationObject.id}
          conversationReactions={conversationObject.reactions}
          conversationObject={conversationObject}
        />
      )}
    </Box>
  );
}

export default MessageBlock;
