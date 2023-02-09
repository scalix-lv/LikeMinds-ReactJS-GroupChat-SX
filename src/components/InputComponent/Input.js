import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import SendIcon from "./../../assets/svg/send.svg";
import styled from "@emotion/styled";
import smiley from "./../../assets/svg/smile.svg";
import camera from "./../../assets/svg/camera.svg";
import mic from "./../../assets/svg/mic.svg";
import paperclip from "./../../assets/svg/paperclip.svg";
import { GroupContext } from "../../Main";
import pdfIcon from "../../assets/svg/pdf-document.svg";
import { myClient, UserContext } from "../..";
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
import m from "./m";
import MessageBox from "../channelGroups/MessageBox";
import { Close } from "@mui/icons-material";
import "./Input.css";
import { getChatroomConversationArray } from "../groupChatArea/GroupChatArea";
const StyledInputWriteComment = styled(TextField)({
  background: "#F9F9F9",
  borderRadius: "20px",
  ".MuiInputBase-input.MuiFilledInput-input": {
    padding: "16px",
    borderBottom: "none",
    borderRadius: "20px",
  },
});

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

function Input({ updateHeight }) {
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
  const groupContext = useContext(GroupContext);
  const userContext = useContext(UserContext);
  const ref = useRef();
  const conversationContext = useContext(ConversationContext);
  const inputContext = useContext(InputContext);
  const selectedConversationContext = useContext(
    CurrentSelectedConversationContext
  );
  const fn = async (chatroomId, pageNo, setConversationArray) => {
    let optionObject = {
      chatroomID: chatroomId,
      page: pageNo,
    };
    let response = await getConversationsForGroup(optionObject);

    if (!response.error) {
      let conversations = response.data;

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

      setConversationArray(newConversationArray);
    } else {
      // console.log(response.errorMessage);
    }
  };
  let count = 1;
  let handleSendMessage = async () => {
    try {
      let isRepliedConvo = selectedConversationContext.isSelected;
      let { text, setText } = inputContext;
      let filesArray = mergeInputFiles(inputContext);
      let res = null;
      // textValT = textVal.
      let tv = text;
      // console.log("checkpoint " + count++);
      if (tv.length != 0) {
        console.log("1");
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
      } else if (filesArray.length > 0) {
        res = await fnew(true, filesArray.length, tv, setText, isRepliedConvo);
      }

      if (res != null && filesArray.length > 0) {
        let index = 0;
        for (let newFile of filesArray) {
          let config = {
            messageId: res.data.id,
            chatroomId: groupContext.activeGroup.chatroom.id,
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

          await getChatroomConversationArray(
            groupContext.activeGroup.chatroom.id,
            1000,
            conversationContext
          );
          updateHeight();
          // await conversationContext.refreshConversationArray();
        }
      } else {
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
      // console.log("checkpoint " + count++);
      let config = {
        text: tv.toString(),
        created_at: Date.now(),
        has_files: false,
        // attachment_count: false,
        chatroom_id: groupContext.activeGroup.chatroom.id,
      };
      console.log(config);
      if (has_files) {
        config.attachment_count = attachment_count;
        config.has_files = true;
      }
      if (isRepliedConvo) {
        config.replied_conversation_id =
          selectedConversationContext.conversationObject.id;
      }

      let callRes = await myClient.onConversationsCreate(config);

      // let oldConversationArr = conversationContext.conversationsArray;
      // let oldLength = oldConversationArr.length;
      // let newConvoArr = [...oldConversationArr];

      // console.log("3");
      // if (
      //   callRes.conversation.date === oldConversationArr[oldLength - 1][0].date
      // ) {
      //   callRes.conversation.member = userContext.currentUser;
      //   newConvoArr[oldLength - 1].push(callRes.conversation);
      // } else {
      //   callRes.conversation.member = userContext.currentUser;
      //   newConvoArr.push([...callRes.conversation]);
      // }
      // console.log("4");
      // conversationContext.setConversationArray(newConvoArr);

      setTextVal("");
      inputContext.setText("");
      selectedConversationContext.setIsSelected(false);
      selectedConversationContext.setConversationObject(null);
      clearInputFiles(inputContext);

      // await getChatroomConversationArray(
      //   groupContext.activeGroup.chatroom.id,
      //   1000,
      //   conversationContext
      // );

      return { error: false, data: callRes };
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };

  const [openReplyBox, setOpenReplyBox] = useState(false);

  useEffect(() => {
    setOpenReplyBox(true);
  }, [selectedConversationContext.conversationObject]);

  const [memberDetailsArray, setMemberDetailsArray] = useState([]);
  useEffect(() => {
    let memberArr = [];

    if (groupContext.activeGroup.membersDetail?.length > 0) {
      for (let member of groupContext.activeGroup?.membersDetail) {
        memberArr.push({
          id: member.id,
          display: member.name,
          community: groupContext.activeGroup.community.id,
          imageUrl: member.image_url,
        });
      }
    }

    setMemberDetailsArray(memberArr);
  }, [groupContext.activeGroup]);

  let keyObj = {
    enter: false,
    shift: false,
  };

  useEffect(() => {
    inputContext.setTextVal("");
  }, [groupContext.activeGroup]);
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      {/* for adding reply */}
      {selectedConversationContext.isSelected ? (
        <div
          className="w-full justify-between shadow-sm overflow-auto bg-white absolute h-[80px] rounded-[5px]"
          style={{
            display: openReplyBox ? "flex" : "none",
            transform: "translate(0, -105%)",
          }}
        >
          <div className="border-l-4 border-l-green-500 px-2 text-[14px]">
            <p className="mb-3 mt-2 text-green-500">
              {selectedConversationContext.conversationObject?.member.name}
            </p>
            <div>
              {getString(
                selectedConversationContext.conversationObject?.answer
              )}
            </div>
          </div>
          <div>
            <IconButton
              onClick={() => {
                selectedConversationContext.setIsSelected(false);
                selectedConversationContext.setConversationObject(null);
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
          placeholder="Write a Comment..."
          value={inputContext.text}
          onChange={(event) => inputContext.setText(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              keyObj.enter = true;
            }
            if (e.key === "Shift") {
              keyObj.shift = true;
            }
            if (keyObj.enter === true && keyObj.shift === true) {
              let newStr = inputContext.text;
              newStr += " \n ";
              inputContext.setText(newStr);
            } else if (keyObj.enter == true && keyObj.shift == false) {
              e.preventDefault();
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

function InputOptions() {
  const fileContext = useContext(InputContext);
  const optionArr = [
    {
      title: "emojis",
      Icon: smiley,
    },
    {
      title: "audio",
      Icon: mic,
      file: fileContext.audioFiles,
      setFile: fileContext.setAudioFiles,
    },
    {
      title: "camera",
      Icon: camera,
      file: fileContext.mediaFiles,
      setFile: fileContext.setMediaFiles,
    },
    {
      title: "attach",
      Icon: paperclip,
      file: fileContext.docFiles,
      setFile: fileContext.setDocFiles,
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
          onChange={(e) => {
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
  const inputContext = useContext(InputContext);
  return (
    <div>
      <IconButton ref={ref} onClick={handleOpen}>
        <img className="w-[20px] h-[20px]" src={option.Icon} />
      </IconButton>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        <EmojiPicker
          onEmojiClick={(e) => {
            let newText = inputContext.text;
            newText += `${e.emoji}`;
            inputContext.setText(newText);
          }}
        />
      </Menu>
    </div>
  );
}

export default Input;

function ImagePreview() {
  const inputContext = useContext(InputContext);
  const [mediaArray, setMediaArray] = useState([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of inputContext.mediaFiles) {
      if (
        nf.type.split("/")[0] === "image" ||
        nf.type.split("/")[0] === "video"
      ) {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [inputContext.audioFiles, inputContext.mediaFiles, inputContext.docFiles]);
  return (
    <div
      style={{
        display: mediaArray.length > 0 ? "block" : "none",
      }}
    >
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file, fileIndex) => {
          const fileTypeInitial = file.type.split("/")[0];

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
          }
        })}
        <IconButton
          onClick={() => {
            clearInputFiles(inputContext);
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
function AudioPreview() {
  const inputContext = useContext(InputContext);
  const [mediaArray, setMediaArray] = useState([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of inputContext.audioFiles) {
      if (nf.type.split("/")[0] === "audio") {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [inputContext.audioFiles, inputContext.mediaFiles, inputContext.docFiles]);
  return (
    <div
      style={{
        display: mediaArray.length > 0 ? "block" : "none",
      }}
    >
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file, fileIndex) => {
          const fileTypeInitial = file.type.split("/")[0];

          if (fileTypeInitial === "audio") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <audio
                  src={URL.createObjectURL(file)}
                  type="audio/mp3"
                  controls
                />
              </div>
            );
          } else {
            return null;
          }
        })}
        <IconButton
          onClick={() => {
            clearInputFiles(inputContext);
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
function DocPreview() {
  const inputContext = useContext(InputContext);
  const [mediaArray, setMediaArray] = useState([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of inputContext.docFiles) {
      if (nf.type.split("/")[1] === "pdf") {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [inputContext.audioFiles, inputContext.mediaFiles, inputContext.docFiles]);
  return (
    <div
      style={{
        display: mediaArray.length > 0 ? "block" : "none",
      }}
    >
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file, fileIndex) => {
          const fileTypeInitial = file.type.split("/")[1];

          if (fileTypeInitial === "pdf") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={pdfIcon} alt="pdf" className="w-[24px]" />
              </div>
            );
          } else {
            return null;
          }
        })}
        <IconButton
          onClick={() => {
            clearInputFiles(inputContext);
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
