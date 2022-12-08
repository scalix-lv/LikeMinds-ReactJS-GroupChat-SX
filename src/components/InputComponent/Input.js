import { Box, IconButton, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MicIcon from '@mui/icons-material/Mic';
import GifIcon from '@mui/icons-material/Gif';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import styled from '@emotion/styled';
import smiley from "./../../assets/smile.png"
import camera from "./../../assets/camera.png"
import giffy from "./../../assets/giffy.png"
import mic from "./../../assets/mic.png"
import paperclip from "./../../assets/paperclip.png"
import { GroupContext } from '../Groups/Groups';
import { myClient } from '../..';
import { ConversationContext } from '../groupChatArea/GroupChatArea';
import { getConversationsForGroup } from '../../sdkFunctions';
const StyledInputWriteComment = styled(TextField)({
    background: "#F9F9F9",
    borderRadius: "20px",
    ".MuiInputBase-input.MuiFilledInput-input": {
        padding: "16px",
        borderBottom: "none",
        borderRadius: "20px"
    }
})


function Input() {
    
    return (
        <Box className='py-3 px-6 bg-white '>

            <InputSearchField/>
            <InputOptions/>
        </Box>
    )
}

function InputSearchField() {
    const groupContext = useContext(GroupContext)
    const [val, setVal] = useState("")
    const conversationContext = useContext(ConversationContext)
    const fn = async (chatroomId, pageNo, setConversationArray) => {
        let optionObject = {
          chatroomID: chatroomId,
          page: pageNo
        }
        let response = await getConversationsForGroup(optionObject);
        console.log(response)
        if (!response.error) {
          let conversations = response.data;
          console.log(conversations)
          let conversationToBeSetArray = []
          let newConversationArray = []
          let lastDate = ""
          for (let convo of conversations) {
            if (convo.date == lastDate) {
              conversationToBeSetArray.push(convo)
              lastDate = convo.date
            } else {
              if (conversationToBeSetArray.length != 0) {
                newConversationArray.push(conversationToBeSetArray)
                conversationToBeSetArray = []
                conversationToBeSetArray.push(convo)
                lastDate = convo.date
              } else {
                conversationToBeSetArray.push(convo)
                lastDate = convo.date
              }
            }
          }
          newConversationArray.push(conversationToBeSetArray)
          console.log(newConversationArray)
  
  
          setConversationArray(newConversationArray)
        } else {
          console.log(response.errorMessage)
        }
        // console.log(response)
      }
    return (
        <Box>
            <StyledInputWriteComment
                variant='filled'
                placeholder='Write a comment'
                fullWidth
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={(event)=>{
                            if(val.length != 0){
                                myClient.onConversationsCreate({
                                    text: val.toString(),
                                    created_at: Date.now(),
                                    has_files: false,
                                    // attachment_count: false,
                                    chatroom_id: groupContext.activeGroup.chatroom.id
                                }).then(res=>console.log(res)).catch(e=>console.log(e))
                                setVal("")
                                fn(groupContext.activeGroup.chatroom.id, 100, conversationContext.setConversationArray)
                            }
                        }}>
                            <SendIcon className='text-[#3884F7]'/>
                        </IconButton>
                    ),
                    
                }}
                value={val}
                onChange={(event)=>{
                    setVal(event.target.value)
                }}
                />

        </Box>
    )
}

function InputOptions(){
    const optionArr = [
        {
            title: "emojis",
            Icon: smiley
        },
        {
            title: "audio",
            Icon: mic
        },
        {
            title: "GIF",
            Icon: giffy
        },
        {
            title: "camera",
            Icon:  camera
        },
        {
            title: "attach",
            Icon: paperclip
        }
    ]
    return (
        <Box className='flex'>
            {
                optionArr.map((option, optionIndex)=>{
                    return (
                        <IconButton key={option.title}>
                            <img className='w-[20px] h-[20px]' src={option.Icon}/>
                        </IconButton>
                    )
                })
            }
        </Box>
    )
}
export default Input