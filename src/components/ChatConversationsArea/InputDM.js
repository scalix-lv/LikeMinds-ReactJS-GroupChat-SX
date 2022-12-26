import { Box, IconButton, Menu, MenuList } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import SendIcon from "./../../assets/svg/send.svg";
import smiley from "./../../assets/svg/smile.svg";
import camera from "./../../assets/svg/camera.svg";
import mic from "./../../assets/svg/mic.svg";
import paperclip from "./../../assets/svg/paperclip.svg";
import { GroupContext } from "../../Main";
import { myClient } from "../..";
import {
  ConversationContext,
  CurrentSelectedConversationContext,
} from "../groupChatArea/GroupChatArea";
import {
  clearInputFiles,
  getConversationsForGroup,
  getString,
  getUsername,
  mergeInputFiles,
} from "../../sdkFunctions";
import EmojiPicker from "emoji-picker-react";
import { MentionsInput, Mention } from "react-mentions";
// import Mentions

import { Close } from "@mui/icons-material";
import "./Input.css";
import { DmContext } from "../direct-messages/DirectMessagesMain";

export const InputContext = React.createContext({
  audioFiles: [],
  setAudioFiles: () => {},
  mediaFiles: [],
  setMediaFiles: () => {},
  docFiles: [],
  setDocFiles: () => {},
  text: "",
  setText: () => {},
  textVal: "",
  setTextVal: () => {},
});

function InputDM({ updateHeight }) {
  const [audioFiles, setAudioFiles] = useState("");
  const [mediaFiles, setMediaFiles] = useState("");
  const [docFiles, setDocFiles] = useState("");
  const [text, setText] = useState("");
  const [textVal, setTextVal] = useState("");

  return (
    <Box className="pt-[20px] pb-[5px] px-[40px] bg-white ">
      <InputContext.Provider
        value={{
          audioFiles,
          setAudioFiles,
          mediaFiles,
          setDocFiles,
          docFiles,
          setMediaFiles,
          text: text,
          setText: setText,
          textVal: textVal,
          setTextVal: setTextVal,
        }}
      >
        <InputSearchField updateHeight={updateHeight} />
        <InputOptions />
      </InputContext.Provider>
    </Box>
  );
}

function InputSearchField({ updateHeight }) {
  const dmContext = useContext(DmContext);
  const ref = useRef();

  const getChatroomConversations = async (
    chatroomId,
    pageNo,
    setConversationArray
  ) => {
    let optionObject = {
      chatroomID: chatroomId,
      page: pageNo,
    };
    let response = await getConversationsForGroup(optionObject);
    console.log(response);
    if (!response.error) {
      let conversations = response.data;
      console.log(conversations);
      let conversationToBeSetArray = [];
      let newConversationArray = [];
      let lastDate = "";
      for (let convo of conversations) {
        if (convo.date === lastDate) {
          conversationToBeSetArray.push(convo);
          lastDate = convo.date;
        } else {
          if (conversationToBeSetArray.length !== 0) {
            newConversationArray.push(conversationToBeSetArray);
            conversationToBeSetArray = [];
            conversationToBeSetArray.push(convo);
            lastDate = convo.date;
          } else {
            conversationToBeSetArray.push(convo);
            lastDate = convo.date;
          }
        }
      }
      newConversationArray.push(conversationToBeSetArray);
      console.log(newConversationArray);
      setConversationArray(newConversationArray);
    } else {
      console.log(response.errorMessage);
    }
  };
  let handleSendMessage = async () => {
    try {
      let isRepliedConvo = dmContext.isConversationSelected;
      //   let { text, setText } = inputContext;
      let { messageText, setMessageText } = dmContext;
      let [text, setText] = [messageText, setMessageText];
      let inputContext = {
        mediaFiles: dmContext.mediaAttachments,
        audioFiles: dmContext.audioAttachments,
        docFiles: dmContext.documentAttachments,
      };
      let filesArray = mergeInputFiles(inputContext);
      let res = null;
      let tv = text;
      if (tv.length != 0) {
        if (!filesArray.length) {
          res = await fnew(false, 0, tv, setText, isRepliedConvo);
        } else {
          res = await fnew(
            true,
            filesArray.length,
            tv,
            setText,
            isRepliedConvo
          );
        }
        updateHeight();
      } else if (filesArray.length > 0) {
        res = await fnew(true, filesArray.length, tv, setText, isRepliedConvo);
      }
      console.log(filesArray);
      updateHeight();
      if (res != null && filesArray.length > 0) {
        let index = 0;
        for (let newFile of filesArray) {
          let config = {
            messageId: res.data.id,
            chatroomId: dmContext.currentChatroom.id,
            file: newFile,
            // index?: number,
          };

          let fileType;

          if (filesArray[0].type.split("/")[1] === "pdf") {
            fileType = "pdf";
          } else if (filesArray[0].type.split("/")[0] === "audio") {
            fileType = "audio";
          } else if (filesArray[0].type.split("/")[0] === "video") {
            fileType = "video";
          } else {
            fileType = "image";
          }
          console.log(newFile.size);
          let fileUploadRes = await myClient.uploadMedia(config);
          console.log(fileUploadRes);
          let onUploadCall = await myClient.onUploadFile({
            conversation_id: res.data.id,
            files_count: 1,
            index: index++,
            meta: {
              size: newFile.size,
            },
            name: newFile.name,
            type: fileType,
            url: fileUploadRes.Location,
          });
          console.log(onUploadCall);
          updateHeight();
        }
      } else {
        updateHeight();
        return {
          error: false,
          data: res,
        };
      }
    } catch (error) {
      return {
        error: true,
        errorMessage: error,
      };
    }
  };
  let fnew = async (
    has_files,
    attachment_count,
    tv,
    setTextVal,
    isRepliedConvo
  ) => {
    try {
      let config = {
        text: tv.toString(),
        created_at: Date.now(),
        has_files: false,
        // attachment_count: false,
        chatroom_id: dmContext.currentChatroom.id,
      };
      if (has_files) {
        config.attachment_count = attachment_count;
        config.has_files = true;
      }
      if (isRepliedConvo) {
        config.replied_conversation_id = dmContext.conversationObject.id;
      }
      let callRes = await myClient.onConversationsCreate(config);

      setTextVal("");
      //   inputContext.setText("");
      dmContext.setMessageText();
      //   selectedConversationContext.setIsSelected(false);
      dmContext.setIsConversationSelected(false);
      //   selectedConversationContext.setConversationObject(null);
      dmContext.setConversationObject(null);
      dmContext.setAudioAttachments([]);
      dmContext.setMediaAttachments([]);
      dmContext.setDocumentAttachments([]);
      getChatroomConversations(
        dmContext.currentChatroom.id,
        1000,
        dmContext.setCurrentChatroomConversations
      );
      updateHeight();
      return { error: false, data: callRes };
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openReplyBox, setOpenReplyBox] = useState(false);

  useEffect(() => {
    setOpenReplyBox(true);
  }, [dmContext.conversationObject]);

  const [memberDetailsArray, setMemberDetailsArray] = useState([]);
  //   useEffect(() => {
  //     // console.log(groupContext);
  //     let memberArr = [];

  //     if (groupContext.activeGroup.membersDetail?.length > 0) {
  //       for (let member of groupContext.activeGroup?.membersDetail) {
  //         memberArr.push({
  //           id: member.id,
  //           display: member.name,
  //           community: groupContext.activeGroup.community.id,
  //           imageUrl: member.image_url,
  //         });
  //       }
  //     }
  //     console.log(memberArr);
  //     setMemberDetailsArray(memberArr);
  //   }, [groupContext.activeGroup]);

  let keyObj = {
    enter: false,
    shift: false,
  };
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      {/* for adding reply */}
      {dmContext.isConversationSelected ? (
        <div
          className="w-full justify-between shadow-sm overflow-auto bg-white absolute h-[80px] rounded-[5px]"
          style={{
            display: openReplyBox ? "flex" : "none",
            transform: "translate(0, -105%)",
          }}
        >
          <div className="border-l-4 border-l-green-500 px-2 text-[14px]">
            <p className="mb-3 mt-2 text-green-500">
              {dmContext.conversationObject?.member.name}
            </p>
            <div>{getString(dmContext.conversationObject?.answer)}</div>
          </div>
          <div>
            <IconButton
              onClick={() => {
                dmContext.setIsConversationSelected(false);
                dmContext.setConversationObject(null);
              }}
            >
              <Close />
            </IconButton>
          </div>
        </div>
      ) : null}

      {/* for preview Image */}
      {<ImagePreview />}
      <div className="relative">
        <IconButton
          onClick={handleSendMessage}
          className="absolute right-[8.6%] top-[9.5%] "
          sx={{
            position: "absolute",
            top: "9.5%",
            bottom: "9.5%",
            right: "1%",
            zIndex: 1,
          }}
        >
          {/* <SendIcon className="text-[#3884F7]" /> */}
          <img src={SendIcon} alt="send" />
        </IconButton>
        <MentionsInput
          className="mentions"
          inputRef={ref}
          spellCheck="false"
          placeholder="Write a Comment..."
          value={dmContext.messageText ? dmContext.messageText : ""}
          onChange={(event) => dmContext.setMessageText(event.target.value)}
          onKeyDown={(e) => {
            // console.log("down");
            if (e.key === "Enter") {
              keyObj.enter = true;
            }
            if (e.key === "Shift") {
              keyObj.shift = true;
            }
            if (keyObj.enter === true && keyObj.shift === true) {
              console.log("here");
              let newStr = dmContext.messageText;
              newStr += " \n ";
              dmContext.setMessageText(newStr);
            } else if (keyObj.enter == true && keyObj.shift == false) {
              console.log("hello");
              e.preventDefault();
              handleSendMessage();
            }
          }}
          onKeyUp={(e) => {
            // console.log("up");
            if (e.key === "Enter") {
              keyObj.enter = false;
            }
            if (e.key === "Shift") {
              keyObj.shift = false;
            }
          }}
        >
          <Mention
            trigger="@"
            data={memberDetailsArray}
            markup="<<__display__|route://member_profile/__id__?member_id=__id__&community_id=__community__>>"
            style={{
              backgroundColor: "#daf4fa",
            }}
            // onAdd={(id) => setActorIds((actorIds) => [...actorIds, id])}
            appendSpaceOnAdd={true}
            renderSuggestion={(
              suggestion,
              search,
              highlightedDisplay,
              index,
              focused
            ) => {
              console.log([
                suggestion,
                search,
                highlightedDisplay,
                index,
                focused,
              ]);
              return (
                <div className={`user ${focused ? "focused" : ""}`}>
                  {suggestion.imageUrl.length > 0 ? (
                    <div className="imgBlock">
                      <img src={suggestion.imageUrl} alt="profile_image" />
                    </div>
                  ) : (
                    <div className="imgBlock">
                      <span>{suggestion.display[0]}</span>
                    </div>
                  )}
                  <span
                    style={{
                      color: "#323232",
                    }}
                  >
                    {suggestion.display}
                  </span>
                </div>
              );
            }}
          />
        </MentionsInput>
      </div>
    </Box>
  );
}

function InputOptions() {
  const dmContext = useContext(DmContext);
  const optionArr = [
    {
      title: "emojis",
      Icon: smiley,
    },
    {
      title: "audio",
      Icon: mic,
      file: dmContext.audioAttachments,
      setFile: dmContext.setAudioAttachments,
    },
    {
      title: "camera",
      Icon: camera,
      file: dmContext.mediaAttachments,
      setFile: dmContext.setMediaAttachments,
    },
    {
      title: "attach",
      Icon: paperclip,
      file: dmContext.documentAttachments,
      setFile: dmContext.setDocumentAttachments,
    },
  ];
  return (
    <Box className="flex">
      {optionArr.map((option, optionIndex) => {
        let accept;
        let fileType;
        if (option.title === "audio") {
          accept = "audio/*";
          fileType = "audio";
        } else if (option.title === "camera") {
          accept = "image/*,video/*";
          fileType = "video";
        } else if (option.title === "attach") {
          accept = ".pdf";
          fileType = "doc";
        }
        if (option.title != "GIF" && option.title != "emojis") {
          return (
            <OptionButtonBox
              key={option.title}
              option={option}
              accept={accept}
              setFile={option.setFile}
              file={option.file}
            />
          );
        } else {
          return <EmojiButton option={option} key={option.title} />;
        }
      })}
    </Box>
  );
}
function OptionButtonBox({ option, accept, file, setFile }) {
  return (
    <IconButton>
      <label>
        <input
          type={"file"}
          style={{ display: "none" }}
          multiple
          accept={accept}
          onClick={() => {
            console.log("clicking");
          }}
          onChange={(e) => {
            console.log("yo");
            console.log(e.target.files);
            setFile(e.target.files);
          }}
        />
        <img className="w-[20px] h-[20px]" src={option.Icon} />
      </label>
    </IconButton>
  );
}

function EmojiButton({ option }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef(null);
  const handleOpen = () => {
    setAnchorEl(ref.current);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dmContext = useContext(DmContext);
  return (
    <div>
      <IconButton ref={ref} onClick={handleOpen}>
        <img className="w-[20px] h-[20px]" src={option.Icon} />
      </IconButton>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        <EmojiPicker
          onEmojiClick={(e) => {
            let newText = dmContext.messageText;
            newText += `${e.emoji}`;
            dmContext.setMessageText(newText);
          }}
        />
      </Menu>
    </div>
  );
}

function MentionBox({ mentionData }) {
  return <MenuList>Hello</MenuList>;
}
export default InputDM;

function ImagePreview() {
  const [previewUrl, setPreviewUrl] = useState("");
  //   const inputContext = useContext(InputContext);
  const dmContext = useContext(DmContext);
  const [mediaArray, setMediaArray] = useState([]);
  useEffect(() => {
    // let {audioFiles, docFiles, mediaFiles} = inputContext
    // let newArr = mergeInputFiles(inputContext);
    let newArr = [];
    // if (newArr.length > 0) {
    //   // setPreviewUrl(URL.createObjectURL(newArr[0]));
    //   setMediaArray(newArr)
    // } else {
    //   setPreviewUrl("");
    // }
    for (let nf of dmContext.mediaAttachments) {
      if (nf.type.split("/")[0] === "image") {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [
    dmContext.mediaAttachments,
    dmContext.audioAttachments,
    dmContext.documentAttachments,
  ]);
  return (
    <div
      style={{
        display: mediaArray.length > 0 ? "block" : "none",
      }}
    >
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file, fileIndex) => {
          const fileTypeInitial = file.type.split("/")[0];
          console.log(fileTypeInitial);
          if (fileTypeInitial === "image") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={URL.createObjectURL(file)} alt="preview" />
              </div>
            );
          } else {
            return null;
          }
        })}
        <IconButton
          onClick={() => {
            dmContext.setAudioAttachments([]);
            dmContext.setMediaAttachments([]);
            dmContext.setDocumentAttachments([]);
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
