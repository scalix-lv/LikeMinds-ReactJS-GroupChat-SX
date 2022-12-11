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
import { ConversationContext, CurrentSelectedConversationContext } from '../groupChatArea/GroupChatArea';
import { clearInputFiles, getConversationsForGroup, getString, getUsername, mergeInputFiles } from '../../sdkFunctions';
import EmojiPicker from 'emoji-picker-react';
import { MentionsInput, Mention } from 'react-mentions'
// import Mentions
import m from "./m"
import MessageBox from '../channelGroups/MessageBox';
import { Close } from '@mui/icons-material';
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
    const [audioFiles, setAudioFiles] = useState("")
    const [mediaFiles, setMediaFiles] = useState("")
    const [docFiles, setDocFiles] = useState("")
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
    const selectedConversationContext = useContext(CurrentSelectedConversationContext)
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
    let handleSendMessage = async () => {
        try {
            let isRepliedConvo = selectedConversationContext.isSelected 
            let { text, setText } = inputContext
            let filesArray = mergeInputFiles(inputContext)
            let res = null
            if (text.length != 0) {

                if (!filesArray.length) {
                    res = await fnew(false, 0, text, setText, isRepliedConvo)
                } else {
                    res = await fnew(true, filesArray.length, text, setText, isRepliedConvo)
                }
            } else if (filesArray.length > 0) {
                res = await fnew(true, filesArray.length, text, setText, isRepliedConvo)

            }
            console.log(filesArray)
            
            if (res != null && filesArray.length > 0) {
                let config = {
                    messageId: res.data.id,
                    chatroomId: groupContext.activeGroup.chatroom.id,
                    file: filesArray[0],
                    // index?: number,
                }
                console.log(config)
                let fileUploadRes = await myClient.uploadMedia(config)
                console.log(fileUploadRes)
                let onUploadCall = await myClient.onUploadFile({
                    conversation_id: res.data.id,
                    files_count: 1,
                    index: "0",
                    meta: {
                        size: filesArray[0]
                    },
                    name: filesArray[0].name,
                    type: filesArray[0].type,
                    url: fileUploadRes.Location
                })
                console.log(onUploadCall)
            } else {
                return {
                    error: false,
                    data: res
                }
            }

        } catch (error) {
            return {
                error: true,
                errorMessage: error
            }
        }
    }
    let fnew = async (has_files, attachment_count, text, setText, isRepliedConvo) => {
        try {
            let config = {
                text: text.toString(),
                created_at: Date.now(),
                has_files: false,
                // attachment_count: false,
                chatroom_id: groupContext.activeGroup.chatroom.id
            }
            if (has_files) {
                config.attachment_count = attachment_count
            }
            if(isRepliedConvo){
                config.replied_conversation_id = selectedConversationContext.conversationObject.id
            }
            let callRes = await myClient.onConversationsCreate(config)

            setText("")
            selectedConversationContext.setIsSelected(false)
            selectedConversationContext.setConversationObject(null)
            clearInputFiles(inputContext)
            fn(groupContext.activeGroup.chatroom.id, 100, conversationContext.setConversationArray)
            return { error: false, data: callRes }
        } catch (error) {
            return { error: true, errorMessage: error }
        }
    }

    // let handleSendMessage = (event) => {
    //     let { text, setText } = inputContext
    //     let filesArray = mergeInputFiles(inputContext)
    //     if (text.length != 0) {
    //         if (!filesArray.length) {
    //             myClient.onConversationsCreate({
    //                 text: text.toString(),
    //                 created_at: Date.now(),
    //                 has_files: false,
    //                 // attachment_count: false,
    //                 chatroom_id: groupContext.activeGroup.chatroom.id
    //             }).then(res => console.log(res)).catch(e => console.log(e))
    //             setText("")
    //             fn(groupContext.activeGroup.chatroom.id, 100, conversationContext.setConversationArray)
    //         } else {
    //             myClient.onConversationsCreate({
    //                 text: text.toString(),
    //                 created_at: Date.now(),
    //                 has_files: true,
    //                 attachment_count: filesArray.length,
    //                 chatroom_id: groupContext.activeGroup.chatroom.id
    //             }).then(res => console.log(res)).catch(e => console.log(e))
    //             setText("")
    //             fn(groupContext.activeGroup.chatroom.id, 100, conversationContext.setConversationArray)
    //         }
    //     } else if (filesArray.length > 0) {
    //         myClient.onConversationsCreate({
    //             text: text.toString(),
    //             created_at: Date.now(),
    //             has_files: true,
    //             attachment_count: filesArray.length,
    //             chatroom_id: groupContext.activeGroup.chatroom.id
    //         }).then(res => console.log(res)).catch(e => console.log(e))
    //         setText("")
    //         fn(groupContext.activeGroup.chatroom.id, 100, conversationContext.setConversationArray)
    //     }
    // }
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    useEffect(() => {
        const textString = inputContext.text
        const inputStrArr = textString.split(" ")
        let l = inputStrArr.length - 1
        console.log("hehe")
        if (inputStrArr[l] === "@") {
            setOpen(true)
            setAnchorEl(ref)
        } else {
            setOpen(false)
            setAnchorEl(ref)
        }
    }, [inputContext.text])
    const [openReplyBox, setOpenReplyBox] = useState(false)

    
    useEffect(() => {
        setOpenReplyBox(true)
    }, [selectedConversationContext.conversationObject])
    return (
        <Box sx={{
            position: "relative"
        }}>
            {/* for tagging */}
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
                    groupContext.activeGroup.membersDetail?.map((member, index) => {
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
            {/* for adding reply */}
            {
                selectedConversationContext.isSelected ? (<div
                    // className='flex'
                    style={{
                        display: openReplyBox ? "flex" : "none",
                        height: "80px",
                        position: "absolute",
                        transform: 'translate(0, -105%)',
                        background: 'white',
                        overflow: 'auto',
                        width: "50%",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        border: '0.5px solid black',
                        justifyContent: 'space-between'
                        // borderBottom: "none"
                    }}
                >

                    <div className='border-l-4 border-l-green-500 px-2'>
                        <p className='mb-3'>
                            {
                                selectedConversationContext.conversationObject?.member.name
                            }
                        </p>
                        <div>
                            {getString(selectedConversationContext.conversationObject?.answer)}
                        </div>
                    </div>
                    <div >
                        <IconButton onClick={()=>{
                            selectedConversationContext.setIsSelected(false)
                            selectedConversationContext.setConversationObject(null)
                        }}>
                            <Close />
                        </IconButton>
                    </div>


                </div>) : null
            }
            {/* for preview Image */}
            {
                <ImagePreview/>
            }
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
                        accept = ".jpeg,.jpg,.png"
                        fileType = "video"
                    } else if (option.title === "attach") {
                        accept = ".pdf"
                        fileType = "doc"
                    }
                    if (option.title != "GIF" && option.title != "emojis") {
                        return (
                            <OptionButtonBox key={option.title} option={option} accept={accept} setFile={option.setFile} file={option.file}/>
                        )
                    }
                    else {
                        return (
                            <EmojiButton option={option} key={option.title}/>
                        )
                    }
                })
            }
        </Box>
    )
}
function OptionButtonBox({ option, accept, file, setFile }) {
    return (
        <IconButton >
            <label>
                <input type={'file'} style={{ display: 'none' }} multiple  accept={accept} onChange={(e) => {
                    console.log(e.target.files)
                    setFile(e.target.files)
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
            <IconButton  ref={ref} onClick={handleOpen}>
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
                    newText += `${e.emoji}`
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

function ImagePreview(){
    const [previewUrl, setPreviewUrl] = useState('')
    const inputContext = useContext(InputContext)
    useEffect(()=>{
        // let {audioFiles, docFiles, mediaFiles} = inputContext
        console.log("here")
        let newArr = mergeInputFiles(inputContext)
        if(newArr.length > 0){
            setPreviewUrl(URL.createObjectURL(newArr[0]))
        }else{
            setPreviewUrl('')
        }
    }, [inputContext.audioFiles, inputContext.mediaFiles, inputContext.docFiles])
    return (
        <div style={{
            display: previewUrl.length > 0 ? 'block' : 'none'
        }}>
            <img src={previewUrl} alt='preview'/>
            <IconButton onClick={()=>{
                clearInputFiles(inputContext)
            }}>
                <Close/>
            </IconButton>
        </div>
    )
}