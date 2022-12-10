import { Box, Dialog, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useContext, useRef, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { userObj } from '../..';
import { addReaction, getString, getUserLink, getUsername } from '../../sdkFunctions';
import { Link } from 'react-router-dom';
import { myClient } from '../..';
import ReportConversationDialogBox from '../reportConversation/ReportConversationDialogBox';
import emojiIcon from '../../assets/emojioption.png'
import EmojiPicker from 'emoji-picker-react';
import { GroupContext } from '../Groups/Groups';
function MessageBox({
    username,
    messageString,
    time,
    userId,
    attachments,
    convoId,
    conversationReactions
}) {
    return (
       <div>
         <Box
            className='flex'
        >
            <StringBox username={username} messageString={messageString} time={time} userId={userId} attachments={attachments} />
            <MoreOptions convoId={convoId} />
        </Box>
        <div>
            {
                conversationReactions.map((reactionObject, reactionObjectIndex)=>{
                    return (
                        <ReactionIndicator reaction={reactionObject.reaction}/>
                    )
                })
            }
        </div>
       </div>
    )
}

function ReactionIndicator({reaction}){
    return (
        <span className='text-normal mx-1'>
            {reaction}
        </span>
    )
}

function StringBox({ username, messageString, time, userId, attachments }) {
    const ref = useRef(null)
    return (
        <Box
            className='flex justify-between py-4 px-4  w-[282px] rounded-[10px]'
            sx={{
                background: userId === userObj.id ? "#ECF3FF" : "#FFFFFF",
            }}>
            <Box>
                <Typography component={'p'} fontWeight={700} fontSize={12} >
                    {username}
                </Typography>
                {
                    attachments != null ?
                        (
                            attachments.filter((item, itemIndex) => {
                                console.log(item)
                                return item.type === 'image'
                            }).map((item, itemIndex) => {
                                console.log(item)
                                return (
                                    <img src={item.url} className="max-w-[100%] h-auto" />
                                )
                            })
                        ) :
                        null
                }
                <Typography component={'p'} fontWeight={300} fontSize={14} >
                    {
                        <Link to={"/" + getUserLink(messageString)}>
                            <span className="text-green-500 font-semibold">
                                {getUsername(messageString)}
                            </span>
                        </Link>}
                    {<span ref={ref} children={() => {
                        let newDomNode = document.createElement('span')
                        let str = getString(messageString)
                        newDomNode.innerHTML = str
                        return [newDomNode]
                    }}>{
                            getString(messageString)
                        }</span>
                    }
                </Typography>
            </Box>
            <TimeBox time={time} />
        </Box>
    )
}

function TimeBox({ time }) {
    return (
        <span
            style={{
                fontSize: "10px",
                fontWeight: 300,
                color: "#323232"
            }}
        >
            {time}
        </span>
    )
}

function MoreOptions({ convoId }) {
    const [anchor, setAnchor] = useState(null)
    const [shouldShow, setShouldShowBlock] = useState(false)
    let open = Boolean(anchor)
    const [anchorEl, setAnchorEl] = useState(null)
    const ref2 = useRef(null)
    const handleOpen = () => {
        setAnchorEl(ref.current)
    }
    const handleCloseEmoji = () => {
        setAnchorEl(null)
    }
    const ref = useRef(null)
    const groupContext = useContext(GroupContext)
    useState(() => {
        const handleCloseFunction = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setAnchor(null)
            }
        }
        document.addEventListener('click', handleCloseFunction)
        return () => {
            document.removeEventListener('click', handleCloseFunction)
        }
    })
    async function onClickhandlerReport(id, reason, convoid) {
        try {
            const deleteCall = await myClient.pushReport({
                tag_id: id,
                reason: reason,
                conversation_id: convoid
            });
            setShouldShowBlock(!shouldShow)
            console.log(deleteCall)
        } catch (error) {
            console.log(error)
        }
    }
    const options = [
        {
            title: "Reply",
            clickFunction: null
        },
        {
            title: "Reply Privately",
            clickFunction: null
        },
        {
            title: "Report",
            clickFunction: () => {
                setShouldShowBlock(!shouldShow)
            }
        }
    ]
    return (
        <Box className='flex items-center'>
            <IconButton ref={ref2} onClick={handleOpen}>
                <img src={emojiIcon} alt="emo" width={"20px"} height="20px" />
            </IconButton>
            <IconButton
                ref={ref}
                onClick={(e) => {
                    setAnchor(e.currentTarget)
                }}
                className="my-auto"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                open={open}
                anchorEl={anchor}
            >
                {
                    options.map((option, optionIndex) => {
                        return (
                            <MenuItem key={option.title} onClick={option.clickFunction}>
                                {option.title}
                            </MenuItem>
                        )
                    })
                }
            </Menu>
            <Dialog
                open={shouldShow}
                onClose={
                    () => {
                        setShouldShowBlock(false)
                    }
                }
            >
                <ReportConversationDialogBox convoId={convoId} shouldShow={shouldShow} onClick={onClickhandlerReport} />
            </Dialog>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseEmoji}
            >
                <EmojiPicker onEmojiClick={(e) => {
                    addReaction(e.emoji, convoId, groupContext.activeGroup.id).then(r => console.log(r)).catch(e => console.log(e))

                }} />
            </Menu>
        </Box>
    )
}

export default MessageBox