import { Box, IconButton, TextField } from '@mui/material'
import React from 'react'
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MicIcon from '@mui/icons-material/Mic';
import GifIcon from '@mui/icons-material/Gif';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import styled from '@emotion/styled';
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
    return (
        <Box>
            <StyledInputWriteComment
                variant='filled'
                placeholder='Write a comment'
                fullWidth
                InputProps={{
                    endAdornment: (
                        <IconButton>
                            <SendIcon color='#3884F7'/>
                        </IconButton>
                    ),
                    
                }}/>

        </Box>
    )
}

function InputOptions(){
    const optionArr = [
        {
            title: "emojis",
            Icon: SentimentSatisfiedAltIcon
        },
        {
            title: "audio",
            Icon: MicIcon
        },
        {
            title: "GIF",
            Icon: GifIcon
        },
        {
            title: "camera",
            Icon:  CameraAltIcon
        },
        {
            title: "attach",
            Icon: AttachFileIcon
        }
    ]
    return (
        <Box className='flex'>
            {
                optionArr.map((option, optionIndex)=>{
                    return (
                        <IconButton>
                            <option.Icon/>
                        </IconButton>
                    )
                })
            }
        </Box>
    )
}
export default Input