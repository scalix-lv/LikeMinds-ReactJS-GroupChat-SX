import { Box, IconButton, Menu, MenuList } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import SendIcon from "./../../assets/svg/send.svg";
import smiley from "./../../assets/svg/smile.svg";
import camera from "./../../assets/svg/camera.svg";
import mic from "./../../assets/svg/mic.svg";
import paperclip from "./../../assets/svg/paperclip.svg";
import { GroupContext } from "../../Main";
import { myClient, UserContext } from "../..";
import pdfIcon from "../../assets/svg/pdf-document.svg";
import {
  ConversationContext,
  CurrentSelectedConversationContext,
} from "../groupChatArea/GroupChatArea";
import {
  clearInputFiles,
  dmAction,
  getChatRoomDetails,
  getConversationsForGroup,
  getString,
  getUsername,
  mergeInputFiles,
  requestDM,
} from "../../sdkFunctions";
import EmojiPicker from "emoji-picker-react";
import { MentionsInput, Mention } from "react-mentions";
// import Mentions

import { Close } from "@mui/icons-material";
import "./Input.css";
import { DmContext } from "../direct-messages/DirectMessagesMain";

function InputDM({ updateHeight }) {
  const ref = useRef();
  return (
    <Box className="pt-[20px] pb-[5px] px-[40px] bg-white ">
      <InputSearchField updateHeight={updateHeight} inputRef={ref} />
      <InputOptions inputRef={ref} />
    </Box>
  );
}

function InputSearchField({ updateHeight, inputRef }) {
  const dmContext = useContext(DmContext);
  const userContext = useContext(UserContext);
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      // // console.log("here");
      dmContext.setMessageText("");
    }
  }, [dmContext.currentChatroom]);
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

    if (!response.error) {
      let conversations = response.data;
      sessionStorage.setItem("dmLastConvo", conversations[0].id);

      // for (let convo of conversations) {
      //   if (convo.date === lastDate) {
      //     conversationToBeSetArray.push(convo);
      //     lastDate = convo.date;
      //   } else {
      //     if (conversationToBeSetArray.length !== 0) {
      //       newConversationArray.push(conversationToBeSetArray);
      //       conversationToBeSetArray = [];
      //       conversationToBeSetArray.push(convo);
      //       lastDate = convo.date;
      //     } else {
      //       conversationToBeSetArray.push(convo);
      //       lastDate = convo.date;
      //     }
      //   }
      // }
      // newConversationArray.push(conversationToBeSetArray);

      setConversationArray(conversations);
    } else {
      // // console.log(response.errorMessage);
    }
  };
  let handleSendMessage = async () => {
    try {
      // // console.log(dmContext.currentChatroom.chat_request_state);
      // let dmContext =
      if (
        dmContext.currentChatroom.chat_request_state === null &&
        dmContext.currentChatroom.member.state != 1 &&
        dmContext.currentChatroom.chatroom_with_user.state != 1
      ) {
        // // console.log("sending request");
        let textMessage = dmContext.messageText;
        dmContext.setMessageText("");
        let call = await dmAction(0, dmContext.currentChatroom.id, textMessage);
        // // console.log(call);
        let chatroomCall = await getChatRoomDetails(
          myClient,
          dmContext.currentChatroom.id
        );
        dmContext.setCurrentChatroom(chatroomCall.data.chatroom);
        dmContext.setCurrentProfile(chatroomCall.data);
        return;
      }
      // // console.log("Inside This Block");
      let isRepliedConvo = dmContext.isConversationSelected;
      // // console.log("Inside This Block2");
      let { messageText, setMessageText } = dmContext;
      // // console.log("Inside This Block3");
      let [text, setText] = [messageText, setMessageText];
      // // console.log("Inside This Block4");
      let inputContext = {
        mediaFiles: dmContext.mediaAttachments,
        audioFiles: dmContext.audioAttachments,
        docFiles: dmContext.documentAttachments,
      };
      // // console.log("Inside This Block5");
      let filesArray = mergeInputFiles(inputContext);
      // // console.log("Inside This Block6");
      let res = null;
      // // console.log("Inside This Block7");
      let tv = text;
      // // console.log("Inside This Block8");
      if (tv.length != 0) {
        if (!filesArray.length) {
          // // console.log("1");
          res = await fnew(false, 0, tv, setText, isRepliedConvo);
        } else {
          // // console.log("2");
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
        // // console.log("3");
        res = await fnew(true, filesArray.length, tv, setText, isRepliedConvo);
        updateHeight();
      }
      ref.current.removeAttribute("disabled");
      // // console.log("HERE IS IT");

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

          let fileUploadRes = await myClient.uploadMedia(config);
          // // console.log("after upload");
          // // console.log(fileUploadRes);
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

          await getChatroomConversations(
            dmContext.currentChatroom.id,
            100,
            dmContext.setCurrentChatroomConversations
          );
          // // console.log(inputRef);
          updateHeight();
          if (inputRef.current) {
            inputRef.current.value = null;
          }
        }
      } else {
        updateHeight();
        return {
          error: false,
          data: res,
        };
      }

      updateHeight();
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
      dmContext.setMessageText("");
      //   selectedConversationContext.setIsSelected(false);
      dmContext.setIsConversationSelected(false);
      //   selectedConversationContext.setConversationObject(null);
      dmContext.setConversationObject(null);
      dmContext.setAudioAttachments([]);
      dmContext.setMediaAttachments([]);
      dmContext.setDocumentAttachments([]);
      // // console.log(dmContext.currentChatroom.id);
      await getChatroomConversations(
        dmContext.currentChatroom.id,
        100,
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
      <DocPreview />
      <AudioPreview />
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
          placeholder={
            dmContext.currentChatroom?.chat_request_state === 0
              ? userContext.currentUser.id.toString() ===
                dmContext.currentChatroom?.chat_requested_by
                ? "Show Connection request pending. Messaging would be enabled once your request is approved."
                : "Approve and Reject"
              : "Write a Comment..."
          }
          value={dmContext.messageText ? dmContext.messageText : ""}
          onChange={(event) => dmContext.setMessageText(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              keyObj.enter = true;
            }
            if (e.key === "Shift") {
              keyObj.shift = true;
            }
            if (keyObj.enter === true && keyObj.shift === true) {
              let newStr = dmContext.messageText;
              newStr += " \n ";
              dmContext.setMessageText(newStr);
            } else if (keyObj.enter == true && keyObj.shift == false) {
              e.preventDefault();
              ref.current.setAttribute("disabled", true);
              handleSendMessage();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              keyObj.enter = false;
            }
            if (e.key === "Shift") {
              keyObj.shift = false;
            }
          }}
          disabled={
            dmContext.currentChatroom?.chat_request_state === 0 ? true : false
          }
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

function InputOptions({ inputRef }) {
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
              inputRef={inputRef}
            />
          );
        } else {
          return <EmojiButton option={option} key={option.title} />;
        }
      })}
    </Box>
  );
}
function OptionButtonBox({ option, accept, file, setFile, inputRef }) {
  return (
    <IconButton>
      <label>
        <input
          type={"file"}
          style={{ display: "none" }}
          multiple
          accept={accept}
          onChange={(e) => {
            // // console.log(e.target.files);
            setFile(e.target.files);
          }}
          ref={inputRef}
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
    let newArr = [];
    for (let nf of dmContext.mediaAttachments) {
      // console.log(nf);
      if (
        nf.type.split("/")[0] === "image" ||
        nf.type.split("/")[0] === "video"
      ) {
        // console.log(nf);
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
          // // console.log(fileTypeInitial);
          if (fileTypeInitial === "image") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={URL.createObjectURL(file)} alt="preview" />
              </div>
            );
          } else if (fileTypeInitial === "video") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <video
                  src={URL.createObjectURL(file)}
                  type="video/mp4"
                  controls
                />
              </div>
            );
          } else if (fileTypeInitial === "audio") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                Hello
                <audio src={URL.createObjectURL} type="audio/mp3" control />
              </div>
            );
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
function AudioPreview() {
  const [previewUrl, setPreviewUrl] = useState("");
  //   const inputContext = useContext(InputContext);
  const dmContext = useContext(DmContext);
  const [mediaArray, setMediaArray] = useState([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of dmContext.audioAttachments) {
      // console.log(nf);
      if (nf.type.split("/")[0] === "audio") {
        // console.log(nf);
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
          // // console.log(fileTypeInitial);
          if (fileTypeInitial === "image") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={URL.createObjectURL(file)} alt="preview" />
              </div>
            );
          } else if (fileTypeInitial === "video") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <video
                  src={URL.createObjectURL(file)}
                  type="video/mp4"
                  controls
                />
              </div>
            );
          } else if (fileTypeInitial === "audio") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <audio
                  src={URL.createObjectURL(file)}
                  type="audio/mp3"
                  controls
                />
              </div>
            );
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
function DocPreview() {
  const [previewUrl, setPreviewUrl] = useState("");
  //   const inputContext = useContext(InputContext);
  const dmContext = useContext(DmContext);
  const [mediaArray, setMediaArray] = useState([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of dmContext.documentAttachments) {
      // console.log(nf);
      if (nf.type.split("/")[1] === "pdf") {
        // console.log(nf);
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
          const fileTypeInitial = file.type.split("/")[1];
          // // console.log(fileTypeInitial);
          if (fileTypeInitial === "pdf") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={pdfIcon} alt="pdf" className="w-[24px]" />
              </div>
            );
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
