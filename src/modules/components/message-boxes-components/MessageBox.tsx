import {
  Box,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { myClient } from "../../..";
import { UserContext } from "../../contexts/userContext";
import ReportConversationDialogBox from "../reportConversation/ReportConversationDialogBox";
import emojiIcon from "../../../assets/svg/smile.svg";
import moreIcon from "../../../assets/svg/more-vertical.svg";
import pdfIcon from "../../../assets/svg/pdf-document.svg";
import EmojiPicker from "emoji-picker-react";
import parse from "html-react-parser";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  addReaction,
  deleteChatFromDM,
  getChatRoomDetails,
  getConversationsForGroup,
  linkConverter,
  log,
  tagExtracter,
  undoBlock,
} from "../../../sdkFunctions";
import {
  directMessageChatPath,
  directMessageInfoPath,
  directMessagePath,
} from "../../../routes";
import ChatroomContext from "../../contexts/chatroomContext";
import { GeneralContext } from "../../contexts/generalContext";
import ImageAndMedia from "./ImageAndMedia";
import AttachmentsHolder from "./AttachmentsHolder";
import MediaCarousel from "../carousel";

async function getChatroomConversations(
  chatroomId: any,
  pageNo: any,
  chatroomContext: any
) {
  if (chatroomId == null) {
    return;
  }
  let optionObject = {
    chatroomID: chatroomId,
    page: pageNo,
  };
  let response: any = await getConversationsForGroup(optionObject);
  if (!response.error) {
    let conversations = response.data;
    sessionStorage.setItem("dmLastConvo", conversations[0].id);
    chatroomContext.setCurrentChatroomConversations(conversations);
  } else {
    log(response.errorMessage);
  }
}
type messageBoxType = {
  username: any;
  messageString: any;
  time: any;
  userId: any;
  attachments: any;
  convoId: any;
  conversationReactions: any;
  conversationObject: any;
  replyConversationObject: any;
  index: any;
};
function MessageBoxDM({
  username,
  messageString,
  time,
  userId,
  attachments,
  convoId,
  conversationReactions,
  conversationObject,
  replyConversationObject,
  index,
}: messageBoxType) {
  let userContext = useContext(UserContext);
  let generalContext = useContext(GeneralContext);

  let chatroomContext = useContext(ChatroomContext);
  if (conversationObject.state !== 0) {
    return (
      <div className="mx-auto text-center rounded-[4px] text-[14px] w-full font-[300] text-[#323232]">
        {conversationObject.state === 1 ? (
          <>
            <span id="state-1">
              {parse(
                linkConverter(tagExtracter(messageString, userContext, 1))
              )}
            </span>
          </>
        ) : (
          <>
            {parse(linkConverter(tagExtracter(messageString, userContext)))}
            {conversationObject?.state === 19 &&
            generalContext?.currentChatroom?.chat_request_state === 2 ? (
              <>
                <span
                  className="text-[#3884f7] cursor-pointer"
                  onClick={() => {
                    undoBlock(conversationObject.chatroom_id).then((r) => {
                      getChatroomConversations(
                        generalContext.currentChatroom.id,
                        100,
                        chatroomContext
                      ).then(() => {
                        getChatRoomDetails(
                          myClient,
                          generalContext.currentChatroom.id
                        ).then((e: any) => {
                          chatroomContext.setConversationList(e.data.chatroom);
                          // chatroomContext.setCurrentProfile(e.data);
                        });
                      });
                    });
                  }}
                >
                  {" "}
                  Tap to Undo
                </span>
              </>
            ) : null}
          </>
        )}
      </div>
    );
  }
  return (
    <div>
      <Box className="flex mb-4">
        {/* <Snackbar
          open={generalContext.showSnackBar}
          message={generalContext.snackBarMessage}
          autoHideDuration={1000}
          onClose={() => {
            generalContext.setShowSnackBar(false);
            generalContext.setSnackBarMessage("");
          }}
        /> */}
        <StringBox
          username={username}
          messageString={messageString}
          time={time}
          userId={userId}
          attachments={attachments}
          replyConversationObject={replyConversationObject}
          conversationObject={conversationObject}
        />
        <MoreOptions
          convoId={convoId}
          convoObject={conversationObject}
          index={index}
        />
      </Box>
      <div>
        {conversationReactions.map(
          (reactionObject: any, reactionObjectIndex: any) => {
            return (
              <ReactionIndicator
                reaction={reactionObject.reaction}
                key={reactionObjectIndex}
              />
            );
          }
        )}
      </div>
    </div>
  );
}

function ReactionIndicator({ reaction }: any) {
  return <span className="text-normal mx-1">{reaction}</span>;
}

export type attType = {
  mediaAttachments: any[];
  audioAttachments: any[];
  docAttachments: any[];
};
function StringBox({
  username,
  messageString,
  time,
  userId,
  attachments,
  replyConversationObject,
  conversationObject,
}: any) {
  const ref = useRef(null);
  const userContext = useContext(UserContext);
  const [displayMediaModal, setDisplayMediaModel] = useState(false);
  const [mediaData, setMediaData] = useState<any>(null);
  const [attachmentObject, setAttachmentObject] = useState<attType>({
    mediaAttachments: [],
    audioAttachments: [],
    docAttachments: [],
  });
  useEffect(() => {
    let att = {
      ...attachmentObject,
    };
    attachments?.forEach((element: any) => {
      const type = element.type.split("/")[0];
      if (type == "image" || type == "video") {
        att.mediaAttachments.push(element);
      } else if (type === "audio") {
        att.audioAttachments.push(element);
      } else if (type === "pdf") {
        att.docAttachments.push(element);
      }
    });
    setAttachmentObject(att);
  }, [attachments]);
  return (
    <div
      className="flex flex-col py-[16px] px-[20px] min-w-[282px] max-w-[350px] border-[#eeeeee] rounded-[10px] break-all z:max-sm:min-w-[242px] z:max-sm:max-w-[282px]"
      style={{
        background:
          userId === userContext.currentUser.id ? "#ECF3FF" : "#FFFFFF",
      }}
    >
      <DialogBoxMediaDisplay
        shouldOpen={displayMediaModal}
        onClose={() => setDisplayMediaModel(false)}
        mediaData={mediaData}
      />
      <div className="flex w-full justify-between mb-1 clear-both">
        <div className="text-[12px] leading-[14px] text-[#323232] font-[700] capitalize">
          <Link
            to={directMessageInfoPath}
            state={{
              communityId: userContext.community.id,
              memberId: userId,
            }}
          >
            {userId === userContext.currentUser.id ? "you" : username}
          </Link>
        </div>
        <div className="text-[10px] leading-[12px] text-[#323232] font-[300]">
          {time}
        </div>
      </div>

      {conversationObject.deleted_by !== undefined ? (
        <span className="text-[14px] w-full font-[300] text-[#323232]">
          This message has been deleted.
        </span>
      ) : (
        <div className="flex w-full flex-col">
          <div className="w-full mb-1 h-full">
            <AttachmentsHolder
              attachmentsObject={attachmentObject}
              setMediaData={setMediaData}
              setMediaDisplayModel={setDisplayMediaModel}
            />
          </div>
          {replyConversationObject != null ? (
            <div className="flex flex-col border-[1px] border-l-[5px] border-[#70A9FF] py-1 px-2 rounded-[5px] mb-1">
              <div className="text-[#70A9FF] font-bold text-[12px]">
                {replyConversationObject?.member?.name}
              </div>

              <div className="text-[#323232] font-[300] text-[12px]">
                {replyConversationObject.attachment_count > 0 ? (
                  <>
                    {replyConversationObject.attachments?.map((item: any) => {
                      if (item.type == "image") {
                        return (
                          <img
                            src={item.url}
                            className="h-[120px] w-[120px]"
                            key={item.url}
                          />
                        );
                      }
                    })}
                  </>
                ) : null}
                {replyConversationObject?.answer}
              </div>
            </div>
          ) : null}

          <div className="text-[14px] w-full font-[300] text-[#323232]">
            <span className="msgCard" ref={ref}>
              {parse(linkConverter(tagExtracter(messageString, userContext)))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeBox({ time }: any) {
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

type moreOptionsType = {
  convoId: any;
  convoObject: any;
  index: any;
};

function MoreOptions({ convoId, convoObject, index }: moreOptionsType) {
  const userContext = useContext(UserContext);
  const chatroomContext = useContext(ChatroomContext);
  const generalContext = useContext(GeneralContext);
  const [anchor, setAnchor] = useState(null);
  const [shouldShow, setShouldShowBlock] = useState(false);
  const navigate = useNavigate();
  const { mode = "" } = useParams();
  let open = Boolean(anchor);
  const [anchorEl, setAnchorEl] = useState(null);
  const ref2 = useRef(null);
  const handleOpen = () => {
    setAnchorEl(ref.current);
  };
  const handleCloseEmoji = () => {
    setAnchorEl(null);
  };
  const ref = useRef<any>(null);
  useState(() => {
    const handleCloseFunction = (e: any) => {
      if (ref?.current && !ref?.current?.contains(e.target)) {
        setAnchor(null);
      }
    };
    document.addEventListener("click", handleCloseFunction);
    return () => {
      document.removeEventListener("click", handleCloseFunction);
    };
  });
  function updateMessageLocally(emoji: any) {
    let newConvoArr = [...chatroomContext.conversationList];
    let reactionTemplate = {
      member: {
        id: userContext?.currentUser?.id,
        image_url: "",
        name: userContext?.currentUser?.name,
      },
      reaction: emoji,
      updated_at: Date.now(),
    };
    let newConvoObject = newConvoArr[index];
    newConvoObject?.reactions.push(reactionTemplate);
    chatroomContext.setConversationList(newConvoArr);
  }
  function deleteMessageLocally() {
    let newConvoArr = [...chatroomContext.conversationList];

    let newConvoObject = newConvoArr[index];
    newConvoObject.deleted_by = userContext?.currentUser?.id;
    chatroomContext.setConversationList(newConvoArr);
  }

  async function onClickhandlerReport(
    id: any,
    reason: any,
    convoid: any,
    reportedMemberId: any
  ) {
    try {
      const deleteCall = await myClient.pushReport({
        tag_id: parseInt(id?.toString()),
        reason: reason,
        conversation_id: convoid,
        reported_Member_id: reportedMemberId,
      });
      setShouldShowBlock(!shouldShow);
    } catch (error) {
      // // console.log(error);
    }
  }

  const options = [
    {
      title: "Reply",
      clickFunction: () => {
        chatroomContext.setIsSelectedConversation(true);
        chatroomContext.setSelectedConversation(convoObject);
      },
    },
    {
      title: "Report",
      clickFunction: () => {
        setShouldShowBlock(!shouldShow);
      },
    },
    {
      title: "Delete",
      clickFunction: () => {
        deleteChatFromDM([convoId])
          .then((r) => {
            deleteMessageLocally();
          })
          .catch((e) => {
            generalContext.setShowSnackBar(true);
            generalContext.setSnackBarMessage(" error occoured");
          });
      },
    },
    {
      title: "Reply Privately",
      clickFunction: async () => {
        try {
          let checkDMLimitCall: any = await myClient.checkDMLimit({
            memberId: convoObject?.member?.id,
          });
          let isReplyParam;
          if (
            userContext.currentUser?.memberState === 1 ||
            convoObject.member.state === 1
          ) {
            isReplyParam = 1;
          } else {
            isReplyParam = 2;
          }

          if (checkDMLimitCall.chatroom_id) {
            navigate(
              directMessageChatPath +
                "/" +
                checkDMLimitCall.chatroom_id +
                "/" +
                isReplyParam
            );
          } else {
            if (!checkDMLimitCall.is_request_dm_limit_exceeded) {
              let createChatroomCall: any = await myClient.createDMChatroom({
                member_id: convoObject?.member?.id,
              });
              navigate(
                directMessageChatPath +
                  "/" +
                  createChatroomCall?.chatroom?.id +
                  "/" +
                  isReplyParam
              );
            } else {
              generalContext.setShowSnackBar(true);
              generalContext.setSnackBarMessage(
                `Limit Exceeded, new request timeout : ${checkDMLimitCall.new_request_dm_timestamp}`
              );
            }
          }
        } catch (error) {
          log(error);
        }
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
        onClick={(e: any) => {
          setAnchor(e.currentTarget);
        }}
        className="my-auto"
      >
        {/* <MoreVertIcon /> */}
        <img src={moreIcon} alt="More vertical icon" />
        {/* <MoreVertIcon /> */}
      </IconButton>
      <Menu
        sx={{
          width: "250px",
        }}
        open={open}
        anchorEl={anchor}
      >
        {options.map((option) => {
          if (
            option.title === "Report" &&
            convoObject.member?.id === userContext.currentUser.id
          ) {
            return null;
          }
          if (
            option.title === "Delete" &&
            convoObject.member?.id !== userContext.currentUser.id
          ) {
            return null;
          }
          if (
            (option.title === "Reply Privately" &&
              generalContext.currentChatroom.type !== 7 &&
              generalContext.currentChatroom.type !== 0 &&
              chatroomContext.showReplyPrivately) ||
            (option.title === "Reply Privately" && mode === "direct-messages")
          ) {
            return null;
          }
          if (option.title === "Reply Privately") {
            if (convoObject.member?.id === userContext.currentUser?.id) {
              return null;
            }
            if (
              chatroomContext.replyPrivatelyMode === 2 &&
              convoObject?.member?.state === 4
            ) {
              return null;
            }
          }
          return (
            <MenuItem
              key={option.title}
              onClick={option.clickFunction}
              sx={{
                padding: "10px 20px",
                color: "#323232",
                borderBottom: "1px solid #eeeeee",
                fontSize: "14px",
              }}
            >
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
          onClick={onClickhandlerReport}
          closeBox={() => {
            setShouldShowBlock(false);
          }}
          reportedMemberId={convoObject.member?.member_id}
        />
      </Dialog>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseEmoji}
      >
        <EmojiPicker
          onEmojiClick={(e) => {
            addReaction(
              e.emoji,
              convoId,
              generalContext.currentChatroom.id
            ).then((r) => {
              updateMessageLocally(e.emoji);
            });

            handleCloseEmoji();
          }}
        />
      </Menu>
    </Box>
  );
}

type dialogBoxType = {
  onClose: any;
  shouldOpen: any;
  mediaData: any;
};

function DialogBoxMediaDisplay({
  onClose,
  shouldOpen,
  mediaData,
}: dialogBoxType) {
  return (
    <Dialog open={shouldOpen} onClose={onClose}>
      <MediaCarousel mediaArray={mediaData?.mediaObj} />
    </Dialog>
  );
}

export default MessageBoxDM;

function ImageConversationView({
  imageArray,
  setMediaData,
  setDisplayMediaModel,
  item,
}: any) {
  function setFunction() {
    setMediaData({ mediaObj: imageArray, type: "image" });
    setDisplayMediaModel(true);
  }
  switch (imageArray.length) {
    case 1:
      return <SingleImageView item={imageArray[0]} setFunction={setFunction} />;
    case 2:
      return null;
  }
}

function SingleImageView({ setFunction, item }: any) {
  return (
    <img
      src={item.url}
      alt=""
      className="m-1 w-full max-h-[230px]"
      key={item.url}
      onClick={() => {
        setFunction();
      }}
    />
  );
}
