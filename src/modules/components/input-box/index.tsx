/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-no-constructed-context-values */
import { Box, IconButton, Menu } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { MentionsInput, Mention } from 'react-mentions';
import { Close } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import SendIcon from '../../../assets/svg/send.svg';
import smiley from '../../../assets/svg/smile.svg';
import camera from '../../../assets/svg/camera.svg';
import mic from '../../../assets/svg/mic.svg';
import paperclip from '../../../assets/svg/paperclip.svg';
import pdfIcon from '../../../assets/svg/pdf-document.svg';
import './Input.css';
import ChatroomContext from '../../contexts/chatroomContext';
import { clearInputFiles } from '../../../sdkFunctions';
import { sendMessage } from './input';
import ReplyBox from './replyContainer';
import { myClient } from '../../..';
import InputFieldContext from '../../contexts/inputFieldContext';
import { INPUT_BOX_DEBOUNCE_TIME } from '../../constants/constants';
import { GeneralContext } from '../../contexts/generalContext';
import routeVariable from '../../../enums/routeVariables';
import CleverTap from '../../../../../analytics/clevertap/CleverTap';
import { CT_EVENTS } from '../../../../../analytics/clevertap/constants';

const Input = ({ setBufferMessage, disableInputBox }: any) => {
  const [messageText, setMessageText] = useState('');
  const [audioAttachments, setAudioAttachments] = useState([]);
  const [mediaAttachments, setMediaAttachments] = useState([]);
  const [documentAttachments, setDocumentAttachments] = useState([]);
  const inputBoxContainerRef = useRef<any>(null);
  return (
    <InputFieldContext.Provider
      value={{
        messageText,
        setMessageText,
        audioAttachments,
        setAudioAttachments,
        mediaAttachments,
        setMediaAttachments,
        documentAttachments,
        setDocumentAttachments
      }}
    >
      <Box
        className="pt-[20px] pb-[5px] px-[40px] bg-white z:max-md:pl-2 "
        // ref={inputBoxContainerRef}
        id="input-container"
      >
        <InputSearchField setBufferMessage={setBufferMessage} disableInputBox={disableInputBox} />
        <InputOptions containerRef={inputBoxContainerRef} disableInputBox={disableInputBox} />
      </Box>
    </InputFieldContext.Provider>
  );
};

const InputSearchField = ({ setBufferMessage, disableInputBox }: any) => {
  const [memberDetailsArray, setMemberDetailsArray] = useState<Array<any>>([]);
  const [enableInputBox, setEnableInputBox] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [loadMoreMembers, setLoadMoreMembers] = useState<any>(true);
  const [debounceBool, setDebounceBool] = useState(true);
  const chatroomContext = useContext(ChatroomContext);
  const inputFieldContext = useContext(InputFieldContext);
  const generalContext = useContext(GeneralContext);
  const { messageText, setMessageText } = inputFieldContext;
  const inputBoxRef = useRef<any>(null);
  const params = useParams();
  const id: any = params[routeVariable.id];
  const mode: any = params[routeVariable.mode];
  const operation: any = params[routeVariable.operation];
  const [chatRequestVariable, setChatRequestVariable] = useState<any>(null);
  const [throttleScroll, setThrottleScroll] = useState(true);
  const timeOut = useRef<any>(null);
  const suggestionsRef = useRef<any>(null);
  const cbRef = useRef<any>(null);
  async function getTaggingMembers(searchString: any, pageNo: any) {
    try {
      const call = await myClient.getTaggingList({
        chatroomId: parseInt(id, 10),
        page: pageNo,
        pageSize: 10,
        searchName: searchString
      });
      // // log(call);
      return call?.data?.community_members;
    } catch (error) {
      // log(error);
    }
  }
  useEffect(() => {
    if (throttleScroll === false) {
      setTimeout(() => {
        setThrottleScroll(true);
      }, 1000);
    }
  });
  useEffect(() => () => {
    if (timeOut.current != null) {
      clearTimeout(timeOut.current);
    }
  });
  useEffect(() => {
    if (enableInputBox) {
      setTimeout(() => {
        setEnableInputBox(false);
      }, INPUT_BOX_DEBOUNCE_TIME);
    }
  });
  useEffect(() => {
    async function getAllMembers() {
      let cont = true;
      let list: any = [];
      let pgNo = 1;
      while (cont) {
        const call = await myClient.allMembers({
          chatroom_id: parseInt(id, 10),
          community_id: parseInt(sessionStorage.getItem('communityId')!, 10),
          page: pgNo
        });
        list = list.concat(call.members);
        pgNo += 1;
        if (call.members.length < 10) {
          cont = false;
        }
      }
      list = list.map((member: any) => ({
        id: member.id,
        display: member.name,
        community: sessionStorage.getItem('communityId'),
        imageUrl: member.image_url
      }));
      setMemberDetailsArray(list);
    }

    // getAllMembers();
  }, [id]);
  useEffect(() => {
    const { currentChatroom } = generalContext;
    if (currentChatroom?.member?.state === 1 || currentChatroom?.chatroom_with_user?.state === 1) {
      setChatRequestVariable(1);
    } else {
      setChatRequestVariable(0);
    }
  }, [generalContext.currentChatroom]);
  useEffect(() => {
    if (inputBoxRef.current) {
      inputBoxRef?.current?.focus();
    }
  });

  const keyObj = {
    enter: false,
    shift: false
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* for adding reply */}
      {chatroomContext.isSelectedConversation ? (
        <ReplyBox
          title={generalContext?.currentChatroom?.header}
          openReplyBox={chatroomContext.isSelectedConversation}
          memberName={chatroomContext.selectedConversation?.member?.name}
          answer={chatroomContext.selectedConversation?.answer}
          setIsSelectedConversation={chatroomContext.setIsSelectedConversation}
          setSelectedConversation={chatroomContext.setSelectedConversation}
          attachments={chatroomContext.selectedConversation.attachments}
        />
      ) : null}

      {/* for preview Image */}
      <DocPreview />
      <AudioPreview />
      <ImagePreview />
      <div className="relative">
        <IconButton
          onClick={() => {
            // console.log(generalContext.currentChatroom);
            sendMessage(
              chatroomContext.isSelectedConversation,
              generalContext?.currentChatroom?.header,
              generalContext.currentChatroom.chat_request_state,
              chatRequestVariable,
              chatroomContext,
              parseInt(id, 10),
              inputFieldContext,
              setBufferMessage,
              setEnableInputBox,
              mode,
              generalContext
            ).then(() => {
              if (!generalContext.currentChatroom?.follow_status) {
              }
            });
          }}
          className="absolute right-[8.6%] top-[9.5%] "
          sx={{
            position: 'absolute',
            top: '9.5%',
            bottom: '9.5%',
            right: '1%',
            zIndex: 1,
            display: enableInputBox || disableInputBox ? 'none' : 'block'
          }}
        >
          {/* <SendIcon className="text-[#3884F7]" /> */}
          <img src={SendIcon} alt="send" />
        </IconButton>
        <MentionsInput
          disabled={enableInputBox || disableInputBox}
          className="mentions"
          spellCheck="false"
          placeholder={enableInputBox || disableInputBox ? 'Input box has been disabled' : 'Write a Comment...'}
          value={messageText}
          customSuggestionsContainer={(children: any) => (
            <div
              className="max-h-[400px] overflow-auto hello_world"
              ref={suggestionsRef}
              onScroll={() => {
                if (!loadMoreMembers || !throttleScroll) {
                  return;
                }
                const current = suggestionsRef?.current?.scrollTop;
                let currentHeight = suggestionsRef?.current?.clientHeight;
                currentHeight = currentHeight.toString();
                if (current >= currentHeight) {
                  setThrottleScroll(false);
                  const pgNo = Math.floor(memberDetailsArray.length / 10) + 1;
                  getTaggingMembers(searchString, pgNo).then((val) => {
                    const arr = val.map((item: any) => {
                      item.display = item.name;
                      return item;
                    });
                    const n = [...memberDetailsArray].concat(arr);
                    setMemberDetailsArray(n);
                    cbRef.current(n);
                  });
                }
              }}
            >
              {children}
            </div>
          )}
          onChange={(event) => setMessageText(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              keyObj.enter = true;
            }
            if (e.key === 'Shift') {
              keyObj.shift = true;
            }
            if (keyObj.enter === true && keyObj.shift === true) {
              let newStr = messageText;
              newStr += ' \n ';
              setMessageText(newStr);
            } else if (keyObj.enter === true && keyObj.shift === false) {
              e.preventDefault();
              sendMessage(
                chatroomContext.isSelectedConversation,
                generalContext?.currentChatroom?.header,
                generalContext.currentChatroom.chat_request_state,
                chatRequestVariable,
                chatroomContext,
                parseInt(id, 10),
                inputFieldContext,
                setBufferMessage,
                setEnableInputBox,
                mode,
                generalContext
              );
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              keyObj.enter = false;
            }
            if (e.key === 'Shift') {
              keyObj.shift = false;
            }
          }}
          inputRef={inputBoxRef}
        >
          <Mention
            trigger="@"
            data={(search, callback) => {
              timeOut.current = setTimeout(() => {
                getTaggingMembers(search, 1).then((val) => {
                  const arr = val?.map((item: any) => {
                    item.display = item.name;
                    item.id = item.sdk_client_info.uuid;
                    return item;
                  });
                  if (arr?.length < 10) {
                    setLoadMoreMembers(false);
                  }
                  cbRef.current = callback;
                  setSearchString(search);
                  setMemberDetailsArray(arr);
                  callback(arr);
                });
              }, 500);
            }}
            markup="<<__display__|route://user_profile/__id__>>"
            style={{ backgroundColor: '#daf4fa' }}
            // onAdd={(id) => setActorIds((actorIds) => [...actorIds, id])}
            appendSpaceOnAdd
            renderSuggestion={(suggestion: any, _search, _highlightedDisplay, _index, focused) => (
              <div className={`user ${focused ? 'focused' : ''}`}>
                {suggestion?.imageUrl?.length > 0 ? (
                  <div className="imgBlock">
                    <img src={suggestion?.imageUrl} alt="profile_image" />
                  </div>
                ) : (
                  <div className="imgBlock">
                    <span>{suggestion?.display[0]}</span>
                  </div>
                )}
                <span style={{ color: '#323232' }}>{suggestion.display}</span>
              </div>
            )}
          />
        </MentionsInput>
      </div>
    </Box>
  );
};

const InputOptions = ({ containerRef, disableInputBox }: any) => {
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments
  } = inputFieldContext;
  const optionArr = [
    {
      title: 'emojis',
      Icon: smiley
    },
    {
      title: 'audio',
      Icon: mic,
      file: audioAttachments,
      setFile: setAudioAttachments
    },
    {
      title: 'camera',
      Icon: camera,
      file: mediaAttachments,
      setFile: setMediaAttachments
    },
    {
      title: 'attach',
      Icon: paperclip,
      file: documentAttachments,
      setFile: setDocumentAttachments
    }
  ];
  if (disableInputBox) {
    return null;
  }
  return (
    <Box className="flex">
      {optionArr.map((option, _optionIndex) => {
        const { title, Icon, file, setFile } = option;
        let accept;
        let fileType;
        if (title === 'audio') {
          accept = 'audio/*';
          fileType = 'audio';
        } else if (title === 'camera') {
          accept = 'image/*,video/*';
          fileType = 'video';
        } else if (title === 'attach') {
          accept = '.pdf';
          fileType = 'doc';
        }
        if (title !== 'GIF' && title !== 'emojis') {
          return <OptionButtonBox key={title} icon={Icon} accept={accept} setFile={setFile} file={file} />;
        }
        return <EmojiButton option={option} key={option.title} containerRef={containerRef} />;
      })}
    </Box>
  );
};
const OptionButtonBox = ({ icon, fileType, accept, setFile, file }: any) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (file.length === 0) {
      if (ref.current != null) {
        ref.current!.value = null;
      }
    }
  });
  return (
    <IconButton>
      <label>
        <input
          ref={ref}
          type="file"
          style={{ display: 'none' }}
          multiple
          accept={accept}
          onChange={(e) => {
            const generalContext = useContext(GeneralContext);
            let props: any = {};
            let isDirectChat = false;
            if (location?.pathname?.includes('/community/direct-messages/')) {
              props['chat_member_name'] = generalContext?.currentChatroom?.member?.name;
              isDirectChat = true;
            } else {
              props['groupName'] = generalContext?.currentChatroom?.header;
            }
            if (fileType == 'doc') {
              if (isDirectChat) {
                CleverTap.pushEvents(CT_EVENTS.NETWORK.CHAT.COMMENT_DOCUMENT_INITIATE, props);
              } else {
                CleverTap.pushEvents(CT_EVENTS.NETWORK.GROUP.JOINIED_GROUP_COMMENT_DOCUMENT_INIATE, props);
              }
            } else if (fileType == 'video') {
              if (isDirectChat) {
                CleverTap.pushEvents(CT_EVENTS.NETWORK.CHAT.COMMENT_IMAGE_INITIATE, props);
              } else {
                CleverTap.pushEvents(CT_EVENTS.NETWORK.GROUP.JOINED_GROUP_COMMENT_IMAGE_INITATE);
              }
            } else if (fileType == 'audio') {
              if (isDirectChat) {
                CleverTap.pushEvents(CT_EVENTS.NETWORK.CHAT.COMMENT_VOICE_INITIATE, props);
              } else {
                CleverTap.pushEvents(CT_EVENTS.NETWORK.GROUP.JOINED_GROUP_COMMENT_VOICE_INITATE);
              }
            }
            setFile(e.target.files);
          }}
        />
        <img className="w-[20px] h-[20px]" src={icon} alt="" />
      </label>
    </IconButton>
  );
};

// const EmojiButton = ({ option, containerRef }: any) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const ref = useRef(null);
//   const handleOpen = () => {
//     setAnchorEl(ref.current);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   const { messageText, setMessageText } = useContext(InputFieldContext);
//   return (
//     <div>
//       <IconButton ref={ref} onClick={handleOpen}>
//         <img className="w-[20px] h-[20px]" src={option.Icon} alt="" />
//       </IconButton>
//       <Menu
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         // anchorPosition={{
//         //   hori
//         // }}
//         sx={{
//           transform: "translate(100%, -20%)",
//         }}
//       >
//         <EmojiPicker
//           onEmojiClick={(e) => {
//             let newText = messageText;
//             newText += `${e.emoji}`;
//             setMessageText(newText);
//           }}
//           previewConfig={{
//             showPreview: false,
//           }}
//         />
//       </Menu>
//     </div>
//   );
// };

const EmojiButton = ({ option }: any) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef(null);
  const handleOpen = () => {
    setAnchorEl(ref.current);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { messageText, setMessageText } = useContext(InputFieldContext);
  return (
    <div>
      <IconButton ref={ref} onClick={handleOpen}>
        <img className="w-[20px] h-[20px]" src={option.Icon} />
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          transform: 'translate(0%, -15%)'
        }}
      >
        <EmojiPicker
          onEmojiClick={(e) => {
            let newText = messageText;
            newText += `${e.emoji}`;
            setMessageText(newText);
          }}
        />
      </Menu>
    </div>
  );
};

export default Input;

const ImagePreview = () => {
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments
  } = inputFieldContext;

  const [mediaArray, setMediaArray] = useState<Array<any>>([]);
  useEffect(() => {
    const newArr: any = [];
    for (const nf of mediaAttachments) {
      if (nf.type.split('/')[0] === 'image' || nf.type.split('/')[0] === 'video') {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [audioAttachments, mediaAttachments, documentAttachments]);
  return (
    <div style={{ display: mediaArray.length > 0 ? 'block' : 'none' }}>
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file: any, fileIndex) => {
          const fileTypeInitial = file.type.split('/')[0];
          if (fileTypeInitial === 'image') {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={URL.createObjectURL(file)} alt="preview" />
              </div>
            );
          }
          if (fileTypeInitial === 'video') {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <video
                  src={URL.createObjectURL(file)}
                  // type="video/mp4"
                  controls
                />
              </div>
            );
          }
          return null;
        })}
        <IconButton
          onClick={() => {
            clearInputFiles({
              setDocFiles: setDocumentAttachments,
              setMediaFiles: setMediaAttachments,
              setAudioFiles: setAudioAttachments
            });
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
};
const AudioPreview = () => {
  const chatroomContext = useContext(ChatroomContext);
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments
  } = inputFieldContext;

  const [mediaArray, setMediaArray] = useState<Array<[]>>([]);
  useEffect(() => {
    const newArr: any = [];
    for (const nf of audioAttachments) {
      if (nf.type.split('/')[0] === 'audio') {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [audioAttachments, mediaAttachments, documentAttachments]);
  return (
    <div style={{ display: mediaArray.length > 0 ? 'block' : 'none' }}>
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file: any, fileIndex) => {
          const fileTypeInitial = file.type.split('/')[0];

          if (fileTypeInitial === 'audio') {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <audio src={URL.createObjectURL(file)} controls />
              </div>
            );
          }
          return null;
        })}
        <IconButton
          onClick={() => {
            clearInputFiles({
              setDocFiles: setDocumentAttachments,
              setMediaFiles: setMediaAttachments,
              setAudioFiles: setAudioAttachments
            });
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
};
const DocPreview = () => {
  const chatroomContext = useContext(ChatroomContext);
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments
  } = inputFieldContext;

  const [mediaArray, setMediaArray] = useState<Array<[]>>([]);
  useEffect(() => {
    const newArr: any = [];
    for (const nf of documentAttachments) {
      if (nf.type.split('/')[1] === 'pdf') {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [audioAttachments, documentAttachments, mediaAttachments]);
  return (
    <div style={{ display: mediaArray.length > 0 ? 'block' : 'none' }}>
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file: any, fileIndex) => {
          const fileTypeInitial = file.type.split('/')[1];

          if (fileTypeInitial === 'pdf') {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={pdfIcon} alt="pdf" className="w-[24px]" />
              </div>
            );
          }
          return null;
        })}
        <IconButton
          onClick={() => {
            clearInputFiles({
              setDocFiles: setDocumentAttachments,
              setMediaFiles: setMediaAttachments,
              setAudioFiles: setAudioAttachments
            });
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
};
