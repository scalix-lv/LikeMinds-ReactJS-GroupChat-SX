/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { myClient } from "../../..";
import { mergeInputFiles, sendDmRequest } from "../../../sdkFunctions";
// import { chatroomContextType } from "../../contexts/chatroomContext";
import { InputFieldContextType } from "../../contexts/inputFieldContext";
import { chatroomContextType } from "../../contexts/chatroomContext";
import {
  LAST_CONVERSATION_ID_BACKWARD,
  LAST_CONVERSATION_ID_FORWARD,
} from "../../../enums/localStorageConstants";

type ConversationCreateData = {
  chatroom_id: any;
  created_at: any;
  has_files: boolean;
  text: any;
  attachment_count?: any;
  replied_conversation_id?: string | number;
};

type UploadConfigType = {
  conversation_id: number;
  files_count: number;
  index: number | string;
  meta?: any;
  name: string;
  thumbnail_url?: string;
  type: string;
  url: string;
};
const sendMessage = async (
  chat_request_state: any,
  state: any,
  chatroomContext: chatroomContextType,
  chatroom_id: number,
  inputFieldContext: InputFieldContextType,
  setBufferMessage: any,
  setEnableInputBox: any,
  mode: any
) => {
  try {
    if (chat_request_state === null && mode === "direct-messages") {
      await sendDmRequest(chatroom_id, inputFieldContext.messageText, state);
      document.dispatchEvent(
        new CustomEvent("joinEvent", { detail: chatroom_id })
      );
      if (state === 1) {
        document.dispatchEvent(new CustomEvent("addedByStateOne"));
        inputFieldContext.setMessageText("");
      }
      return;
    }
    setEnableInputBox(true);
    sessionStorage.removeItem(LAST_CONVERSATION_ID_FORWARD);
    sessionStorage.removeItem(LAST_CONVERSATION_ID_BACKWARD);
    const {
      conversationList,
      setConversationList,
      selectedConversation,
      setSelectedConversation,
      isSelectedConversation,
      setIsSelectedConversation,
    } = chatroomContext;
    const {
      messageText,
      setMessageText,
      audioAttachments,
      setAudioAttachments,
      mediaAttachments,
      setMediaAttachments,
      documentAttachments,
      setDocumentAttachments,
    } = inputFieldContext;
    const message = messageText;
    const mediaContext = {
      mediaAttachments: [...mediaAttachments],
      audioAttachments: [...audioAttachments],
      documentAttachments: [...documentAttachments],
    };
    const filesArray = mergeInputFiles(mediaContext);

    setMessageText("");
    setAudioAttachments([]);
    setMediaAttachments([]);
    setDocumentAttachments([]);

    if (messageText.trim() === "" && filesArray.length === 0) {
      return;
    }
    const config: any = {
      text: message,
      createdAt: Date.now(),
      chatroomId: parseInt(chatroom_id.toString()),
      hasFiles: false,
    };
    if (filesArray.length) {
      config.hasFiles = true;
      config.attachmentCount = filesArray.length;
    }
    if (isSelectedConversation) {
      config.repliedConversationId = selectedConversation?.id;
      setSelectedConversation({});
      setIsSelectedConversation(false);
    }

    const createConversationCall = await myClient.postConversation(config);

    document.dispatchEvent(
      new CustomEvent("sentMessage", { detail: chatroom_id })
    );
    // log(createConversationCall);
    localHandleConversation(
      createConversationCall?.data?.conversation,
      filesArray,
      setBufferMessage
    );
    // render local changes here

    // above this point

    if (filesArray.length) {
      let index = 0;
      for (const newFile of filesArray) {
        const uploadConfig = {
          messageId: parseInt(createConversationCall.id, 10),
          chatroomId: chatroom_id,
          file: newFile,
        };
        let fileType = "";
        if (filesArray[0].type.split("/")[1] === "pdf") {
          fileType = "pdf";
        } else if (filesArray[0].type.split("/")[0] === "audio") {
          fileType = "audio";
        } else if (filesArray[0].type.split("/")[0] === "video") {
          fileType = "video";
        } else {
          fileType = "image";
        }
        index++;
        // log(newFile);
        await myClient.uploadMedia(uploadConfig).then((fileResponse: any) => {
          const onUploadConfig = {
            conversationId: parseInt(createConversationCall?.data?.id, 10),
            filesCount: 1,
            index,
            meta: { size: newFile.size },
            name: newFile.name,
            type: fileType,
            url: fileResponse.Location,
          };
          myClient.putMultimedia(onUploadConfig);
        });
      }
    }
  } catch (error) {
    // log(error);
  }
};

export { sendMessage };

async function localHandleConversation(
  conversation: any,
  media: any,
  setBufferMessage: any
) {
  // // log(media);
  let count = 1;
  if (conversation?.has_files) {
    for (const file of media) {
      const attachmentTemplate = {
        url: URL.createObjectURL(file),
        index: count++,
        type: file.type.split("/")[0],
        name: file.name,
        meta: { size: file.size },
      };
      conversation?.attachments?.push(attachmentTemplate);
    }
  }
  setBufferMessage(conversation);
}
