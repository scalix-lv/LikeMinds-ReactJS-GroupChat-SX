import { Box, IconButton, Menu, MenuItem, MenuList, TextField } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
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
import EmojiPicker from 'emoji-picker-react';
import { MentionsInput, Mention } from 'react-mentions'
// import Mentions
import m from "./m"
const StyledInputWriteComment = styled(TextField)({
    background: "#F9F9F9",
    borderRadius: "20px",
    ".MuiInputBase-input.MuiFilledInput-input": {
        padding: "16px",
        borderBottom: "none",
        borderRadius: "20px"
    }
})



export const InputContext = React.createContext({
    audioFiles: [],
    setAudioFiles: () => {
    },
    mediaFiles: [],
    setMediaFiles: () => {
    },
    docFiles: [],
    setDocFiles: () => {
    },
    text: "",
    setText: () => { }
})

function Input() {
    const [audioFiles, setAudioFiles] = useState(null)
    const [mediaFiles, setMediaFiles] = useState(null)
    const [docFiles, setDocFiles] = useState(null)
    const [text, setText] = useState("")
    const data = [
        {
            id: "jack",
            display: "JASCL"
        }
    ]

    return (
        <Box className='py-3 px-6 bg-white '>
            <InputContext.Provider value={{ audioFiles, setAudioFiles, mediaFiles, setDocFiles, docFiles, setMediaFiles, text: text, setText: setText }}>
                <InputSearchField />
                <InputOptions />
            </InputContext.Provider>
        </Box>
    )
}

function InputSearchField() {
    const groupContext = useContext(GroupContext)
    const ref = useRef()
    const conversationContext = useContext(ConversationContext)
    const inputContext = useContext(InputContext)
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
    let handleSendMessage = (event) => {
        let { text, setText } = inputContext
        if (text.length != 0) {
            myClient.onConversationsCreate({
                text: text.toString(),
                created_at: Date.now(),
                has_files: false,
                // attachment_count: false,
                chatroom_id: groupContext.activeGroup.chatroom.id
            }).then(res => console.log(res)).catch(e => console.log(e))
            setText("")
            fn(groupContext.activeGroup.chatroom.id, 100, conversationContext.setConversationArray)
        }
    }
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    useEffect(()=>{
        const textString = inputContext.text
        const inputStrArr = textString.split(" ")
        let l = inputStrArr.length-1
        console.log("hehe")
        if(inputStrArr[l] === "@"){
            setOpen(true)
            setAnchorEl(ref)
        }else{
            setOpen(false)
            setAnchorEl(ref)
        }
    },[inputContext.text])
    return (
        <Box sx={{
            position: "relative"
        }}>
            <div 
            style={{
                display: open ? "block" : "none",
                maxHeight: "240px",
                position: "absolute",
                transform: 'translate(0, -105%)',
                background: 'white',
                overflow: 'auto',
                width: "50%",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                border: '0.5px solid black',
                // borderBottom: "none"
            }}
            >
               {
                groupContext.activeGroup.membersDetail?.map((member, index)=>{
                    return (
                        <div
                        className='border-t text-base py-2 px-4'
                        key={member.id}
                        >
                            {member.name}
                        </div>
                    )
                })
               }

            </div>
            <StyledInputWriteComment
                ref={ref}
                variant='filled'
                placeholder='Write a comment'
                fullWidth
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={handleSendMessage}>
                            <SendIcon className='text-[#3884F7]' />
                        </IconButton>
                    ),
                }}
                
                value={inputContext.text}
                onChange={(event) => {
                    inputContext.setText(event.target.value)
                }}
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage()
                    }
                }}
            />
            
        </Box>
    )
}

function InputOptions() {
    const fileContext = useContext(InputContext)
    const optionArr = [
        {
            title: "emojis",
            Icon: smiley
        },
        {
            title: "audio",
            Icon: mic,
            file: fileContext.audioFiles,
            setFile: fileContext.setAudioFiles
        },
        {
            title: "GIF",
            Icon: giffy
        },
        {
            title: "camera",
            Icon: camera,
            file: fileContext.mediaFiles,
            setFile: fileContext.setMediaFiles
        },
        {
            title: "attach",
            Icon: paperclip,
            file: fileContext.docFiles,
            setFile: fileContext.setDocFiles
        }
    ]
    return (
        <Box className='flex'>
            {
                optionArr.map((option, optionIndex) => {
                    let accept;
                    let fileType;
                    if (option.title === 'audio') {
                        accept = "audio/*"
                        fileType = "audio"
                    } else if (option.title === 'camera') {
                        accept = "audio/*,video/*"
                        fileType = "video"
                    } else if (option.title === "attach") {
                        accept = ".pdf"
                        fileType = "doc"
                    }
                    if (option.title != "GIF" && option.title != "emojis") {
                        return (
                            <OptionButtonBox key={option.title} option={option} accept={accept} />
                        )
                    }
                    else {
                        return (
                            <EmojiButton option={option} />
                        )
                    }
                })
            }
        </Box>
    )
}
function OptionButtonBox({ option, accept, file, setFile }) {
    return (
        <IconButton key={option.title}>
            <label>
                <input type={'file'} style={{ display: 'none' }} value={file} accept={accept} multiple onChange={(e) => {
                    setFile(e.target.value)
                }} />
                <img className='w-[20px] h-[20px]' src={option.Icon} />
            </label>
        </IconButton>
    )
}

function EmojiButton({ option }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const ref = useRef(null)
    const handleOpen = () => {
        setAnchorEl(ref.current)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const inputContext = useContext(InputContext)
    return (
        <div>
            <IconButton key={option.title} ref={ref} onClick={handleOpen}>
                <img className='w-[20px] h-[20px]' src={option.Icon} />
            </IconButton>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                <EmojiPicker onEmojiClick={(e) => {
                    console.log(e)
                    let newText = inputContext.text
                    console.log(newText)
                    newText += ` &# ${e.unified}`
                    console.log(newText)
                    inputContext.setText(newText)
                    console.log(e.emoji)
                }} />
            </Menu>
        </div>
    )
}

function MentionBox({ mentionData }) {
    return (
        <MenuList>
            Hello
        </MenuList>
    )
}
export default Input