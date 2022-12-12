import {
  Box,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { userObj } from "../..";
import {
  addReaction,
  getString,
  getUserLink,
  getUsername,
} from "../../sdkFunctions";
import { Link } from "react-router-dom";
import { myClient } from "../..";
import ReportConversationDialogBox from "../reportConversation/ReportConversationDialogBox";
import emojiIcon from "../../assets/emojioption.png";
import EmojiPicker from "emoji-picker-react";
import { GroupContext } from "../Groups/Groups";
import { groupPersonalInfoPath } from "./../../routes";
import { CurrentSelectedConversationContext } from "../groupChatArea/GroupChatArea";
function MessageBox({
  username,
  messageString,
  time,
  userId,
  attachments,
  convoId,
  conversationReactions,
  conversationObject,
}) {
  return (
    <div>
      <Box className="flex">
        <StringBox
          username={username}
          messageString={messageString}
          time={time}
          userId={userId}
          attachments={attachments}
        />
        <MoreOptions convoId={convoId} convoObject={conversationObject} />
      </Box>
      <div>
        {conversationReactions.map((reactionObject, reactionObjectIndex) => {
          return <ReactionIndicator reaction={reactionObject.reaction} />;
        })}
      </div>
    </div>
  );
}

function ReactionIndicator({ reaction }) {
  return <span className="text-normal mx-1">{reaction}</span>;
}

function StringBox({ username, messageString, time, userId, attachments }) {
  const ref = useRef(null);
  const groupContext = useContext(GroupContext);
  return (
    <div
      className="flex flex-col py-[16px] px-[20px] min-w-[282px] max-w-[350px] border-[#eeeeee] rounded-[10px] break-all"
      style={{
        background: userId === userObj.id ? "#ECF3FF" : "#FFFFFF",
      }}
    >
      <div className="flex w-full justify-between mb-1 clear-both">
        <div className="text-[12px] leading-[14px] text-[#323232] font-[700]">
          <Link
            to={groupPersonalInfoPath}
            state={{
              communityId: groupContext.activeGroup.community.id,
              memberId: userId,
            }}
          >
            {userId === userObj.id ? "You" : username}
          </Link>
        </div>
        <div className="text-[10px] leading-[12px] text-[#323232] font-[300]">
          {time}
        </div>
      </div>

      <div className="flex w-full flex-col">
        {attachments != null
          ? attachments
              .filter((item, itemIndex) => {
                return item.type === "image";
              })
              .map((item, itemIndex) => {
                return (
                  <img src={item.url} alt="" className="max-w-[280px] h-full" />
                );
              })
          : null}
        {attachments != null
          ? attachments
              .filter((item, itemIndex) => {
                return item.type === "audio";
              })
              .map((item, itemIndex) => {
                return (
                  <audio controls src={item.url} className="w-[230]">
                    {" "}
                    <a href={item.url}>Download audio</a>
                  </audio>
                );
              })
          : null}

        {attachments != null
          ? attachments
              .filter((item, itemIndex) => {
                return item.type === "pdf";
              })
              .map((item, itemIndex) => {
                return (
                  <a href={item.url} target="_blank">
                    {item.name}
                  </a>
                );
              })
          : null}

        {attachments != null
          ? attachments
              .filter((item, itemIndex) => {
                return item.type === "video";
              })
              .map((item, itemIndex) => {
                return (
                  <video controls className="w-[200] h-max-[200px]">
                    <source src={item.url} type="video/mp4" />
                    <source src={item.url} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                );
              })
          : null}

        <Typography component={"p"} fontWeight={300} fontSize={14}>
          {
            <Link to={"/" + getUserLink(messageString)}>
              <span className="text-green-500 text-[12px] font-semibold">
                {getUsername(messageString)}
              </span>
            </Link>
          }

          {
            <span
              ref={ref}
              children={() => {
                let newDomNode = document.createElement("span");
                let str = getString(messageString);
                newDomNode.innerHTML = str;
                return [newDomNode];
              }}
            >
              {getString(messageString)}
            </span>
          }
        </Typography>
      </div>
    </div>
  );
}

function TimeBox({ time }) {
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 300,
        color: "#323232",
      }}
    >
      {time}
    </span>
  );
}

function MoreOptions({ convoId, userId, convoObject }) {
  const [anchor, setAnchor] = useState(null);
  const [shouldShow, setShouldShowBlock] = useState(false);
  let open = Boolean(anchor);
  const [anchorEl, setAnchorEl] = useState(null);
  const ref2 = useRef(null);
  const handleOpen = () => {
    setAnchorEl(ref.current);
  };
  const handleCloseEmoji = () => {
    setAnchorEl(null);
  };
  const ref = useRef(null);
  const groupContext = useContext(GroupContext);
  useState(() => {
    const handleCloseFunction = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAnchor(null);
      }
    };
    document.addEventListener("click", handleCloseFunction);
    return () => {
      document.removeEventListener("click", handleCloseFunction);
    };
  });
  async function onClickhandlerReport(id, reason, convoid) {
    try {
      const deleteCall = await myClient.pushReport({
        tag_id: id,
        reason: reason,
        conversation_id: convoid,
      });
      setShouldShowBlock(!shouldShow);
      console.log(deleteCall);
    } catch (error) {
      console.log(error);
    }
  }
  const selectedConversationContext = useContext(
    CurrentSelectedConversationContext
  );
  const options = [
    {
      title: "Reply",
      clickFunction: (e) => {
        selectedConversationContext.setIsSelected(true);
        console.log(selectedConversationContext);
        console.log(convoObject);
        selectedConversationContext.setConversationObject(convoObject);
      },
    },
    {
      title: "Reply Privately",
      clickFunction: null,
    },
    {
      title: "Report",
      clickFunction: () => {
        setShouldShowBlock(!shouldShow);
      },
    },
  ];

  return (
    <Box className="flex items-center">
      <IconButton ref={ref2} onClick={handleOpen}>
        <img src={emojiIcon} alt="emo" width={"20px"} height="20px" />
      </IconButton>
      <IconButton
        ref={ref}
        onClick={(e) => {
          setAnchor(e.currentTarget);
        }}
        className="my-auto"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchor}>
        {options.map((option, optionIndex) => {
          return (
            <MenuItem key={option.title} onClick={option.clickFunction}>
              {option.title}
            </MenuItem>
          );
        })}
      </Menu>
      <Dialog
        open={shouldShow}
        onClose={() => {
          setShouldShowBlock(false);
        }}
      >
        <ReportConversationDialogBox
          convoId={convoId}
          shouldShow={shouldShow}
          onClick={onClickhandlerReport}
          closeBox={() => {
            setShouldShowBlock(false);
          }}
        />
      </Dialog>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseEmoji}
      >
        <EmojiPicker
          onEmojiClick={(e) => {
            addReaction(e.emoji, convoId, groupContext.activeGroup.id)
              .then((r) => console.log(r))
              .catch((e) => console.log(e));
            handleCloseEmoji();
          }}
        />
      </Menu>
    </Box>
  );
}

export default MessageBox;
