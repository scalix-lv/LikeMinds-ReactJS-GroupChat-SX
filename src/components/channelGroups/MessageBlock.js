import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserContext, userObj } from "../..";
import MessageBoxDM from "../ChatConversationsArea/MessageBoxDM";
import MessageBox from "./MessageBox";

function MessageBlock({ conversationObject, userId }) {
  const [convoDetails, setConvoDetails] = useState(conversationObject);
  const userContext = useContext(UserContext);
  const currentUser = userContext.currentUser.id;
  const location = useLocation();
  console.log(location);

  return (
    <Box
      className="flex py-2 px-0 h-full overflow-auto"
      sx={{
        flexDirection: userId === currentUser ? "row-reverse" : "row",
      }}
    >
      {location.pathname.split("/")[1] == "direct-messages" ? (
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
