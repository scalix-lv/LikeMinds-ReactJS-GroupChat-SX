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
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import MicIcon from "@mui/icons-material/Mic";
import GifIcon from "@mui/icons-material/Gif";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import styled from "@emotion/styled";
import smiley from "./../../assets/svg/smile.svg";
import camera from "./../../assets/svg/camera.svg";
import giffy from "./../../assets/svg/giffy.svg";
import mic from "./../../assets/svg/mic.svg";
import paperclip from "./../../assets/svg/paperclip.svg";
import { GroupContext } from "../Groups/Groups";
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
import m from "./m";
import MessageBox from "../channelGroups/MessageBox";
import { Close } from "@mui/icons-material";
import "./Input.css";
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

function Input() {
  const [audioFiles, setAudioFiles] = useState("");
  const [mediaFiles, setMediaFiles] = useState("");
  const [docFiles, setDocFiles] = useState("");
  const [text, setText] = useState("");
  const [textVal, setTextVal] = useState("");

  return (
    <Box className="py-3 px-6 bg-white ">
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
        <InputSearchField />
        <InputOptions />
      </InputContext.Provider>
    </Box>
  );
}

function InputSearchField() {
  const groupContext = useContext(GroupContext);
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
    // console.log(response)
  };
  let handleSendMessage = async () => {
    try {
      let isRepliedConvo = selectedConversationContext.isSelected;
      let { text, setText } = inputContext;
      let filesArray = mergeInputFiles(inputContext);
      let res = null;
      // textValT = textVal.
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
      } else if (filesArray.length > 0) {
        res = await fnew(true, filesArray.length, tv, setText, isRepliedConvo);
      }
      console.log(filesArray);

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
      let config = {
        text: tv.toString(),
        created_at: Date.now(),
        has_files: false,
        // attachment_count: false,
        chatroom_id: groupContext.activeGroup.chatroom.id,
      };
      if (has_files) {
        config.attachment_count = attachment_count;
        config.has_files = true;
      }
      if (isRepliedConvo) {
        config.replied_conversation_id =
          selectedConversationContext.conversationObject.id;
      }
      let callRes = await myClient.onConversationsCreate(config);

      setTextVal("");
      inputContext.setText("");
      selectedConversationContext.setIsSelected(false);
      selectedConversationContext.setConversationObject(null);
      clearInputFiles(inputContext);
      fn(
        groupContext.activeGroup.chatroom.id,
        100,
        conversationContext.setConversationArray
      );
      return { error: false, data: callRes };
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    const textString = inputContext.text;
    const inputStrArr = textString.split(" ");
    let l = inputStrArr.length - 1;
    console.log("hehe");
    if (inputStrArr[l] === "@") {
      setOpen(true);
      setAnchorEl(ref);
    } else {
      setOpen(false);
      setAnchorEl(ref);
    }
  }, [inputContext.text]);
  const [openReplyBox, setOpenReplyBox] = useState(false);
  useEffect(() => {
    console.log(inputContext);
  }, [inputContext.text, inputContext.textVal]);

  useEffect(() => {
    setOpenReplyBox(true);
  }, [selectedConversationContext.conversationObject]);

  const [memberDetailsArray, setMemberDetailsArray] = useState([]);
  useEffect(() => {
    console.log(groupContext);
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
    console.log(memberArr);
    setMemberDetailsArray(memberArr);
  }, [groupContext.activeGroup]);

  // async function savePost(e) {
  //   e.preventDefault();

  //   let newContent = content;

  //   newContent = newContent.split("@@@__").join('<a href="/user/');
  //   newContent = newContent.split("^^^__").join(`">@`);
  //   newContent = newContent.split("@@@^^^").join("</a>");

  //   newContent = newContent.split("$$$__").join('<a href="/tag/');
  //   newContent = newContent.split("~~~__").join(`">#`);
  //   newContent = newContent.split("$$$~~~").join("</a>");
  //   if (newContent !== "") {
  //     let body = newContent.trim();
  //     //Call to your DataBase like backendModule.savePost(body,  along_with_other_params);
  //     tagNames.map(async (tag) => {
  //       try {
  //         await APIservice.post("/tag", {
  //           name: tag,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     });
  //     console.log(body);
  //     try {
  //       await APIservice.post("/post", {
  //         title,
  //         content: body,
  //         createdAt: new Date().getTime(),
  //       });
  //       history.push("/");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // }
  let newD = [
    {
      id: "hel",
      display: "peo",
    },
    {
      id: "hela",
      display: "peos",
    },
    {
      id: "hels",
      display: "peow",
    },
  ];
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
      {/* for tagging */}
      {/* <div
        className="max-h-[240px] absolute shadow-sm bg-white w-[250px] p-2 rounded-[10px] overflow-auto"
        style={{
          display: open ? "block" : "none",
          transform: "translate(0, -105%)",
        }}
      >
        {groupContext.activeGroup.membersDetail?.map((member, index) => {
          return (
            <div
              className="border-b border-[#eee] text-[14px] py-3 px-5 cursor-pointer hover:bg-[#eee]"
              key={member.id}
              onClick={() => {
                inputContext.setTextVal(
                  inputContext.textVal +
                    "<<" +
                    member.name +
                    `|route://member_profile/${member.id}?member_id=${member.id}&community_id=${groupContext}>>`
                );
                inputContext.setText(
                  inputContext.text.substring(0, inputContext.text.length - 1) +
                    member.name
                );
              }}
            >
              {member.name}
            </div>
          );
        })}
      </div> */}
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
      {<ImagePreview />}
      <div className="relative">
        <IconButton
          onClick={handleSendMessage}
          className="absolute right-[8.6%] top-[9.5%] "
          sx={{
            position: "absolute",
            top: "9.5%",
            bottom: "9.5%",
            right: "2%",
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
          placeholder="Write a Comment"
          value={inputContext.text}
          onChange={(event) => inputContext.setText(event.target.value)}
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
              let newStr = inputContext.text;
              newStr += " \n ";
              inputContext.setText(newStr);
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
                    <img
                      src={suggestion.image_url.length}
                      alt="profile_image"
                      style={{
                        borderRadius: "50%",
                        height: "20px",
                        width: "20px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "20px",
                        width: "20px",
                        borderRadius: "50%",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {suggestion.display.split(" ")[0]}
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {suggestion.display.split(" ")[1]}
                      </span>
                    </div>
                  )}
                  <span
                    style={{
                      color: "green",
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
      {/* <StyledInputWriteComment
        ref={ref}
        variant="filled"
        placeholder="Write a comment"
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSendMessage}>
              <SendIcon className="text-[#3884F7]" />
            </IconButton>
          ),
        }}
        value={inputContext.text}
        onChange={(event) => {
          let newVal = event.target.value;
          let newValTexte = inputContext.textVal;
          newValTexte += newVal.substring(newVal.length - 1);
          inputContext.setText(newVal);
          inputContext.setTextVal(newValTexte);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      /> */}
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

function MentionBox({ mentionData }) {
  return <MenuList>Hello</MenuList>;
}
export default Input;

function ImagePreview() {
  const [previewUrl, setPreviewUrl] = useState("");
  const inputContext = useContext(InputContext);
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
    for (let nf of inputContext.mediaFiles) {
      if (nf.type.split("/")[0] === "image") {
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
            clearInputFiles(inputContext);
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
