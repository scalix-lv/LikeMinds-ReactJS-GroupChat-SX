import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styled from "@emotion/styled";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import IconButton from '@mui/material';

const StyledBox = styled(Box)({
  backgroundColor: "#FFFBF2",
  minHeight: "100vh",
  // borderTop: "1px solid #EEEEEE",
  display: "flex",
  flexDirection: "column",
});

function GroupInfo() {
  const participants = Array(5).fill(1);
  return (
    <StyledBox
      style={{
        marginTop: "none",
        padding: "0px 96px 0px 12px",
      }}
    >
      <Box className="flex items-center">
        <IconButton>
          <KeyboardBackspaceIcon
            sx={{
              color: "#3884F7",
            }}
          />
        </IconButton>
        <Typography fontSize={"20px"} fontWeight={700} color={"#3884F7"}>
          Group Info
        </Typography>
      </Box>
      <Box
        sx={{
          marginLeft: "12px",
        }}
      >
        This group is a community of people working in start- ups coming
        together to help each other.
        <Typography
          fontSize={"16px"}
          fontWeight={700}
          color={"#323232"}
          marginTop={2}
        >
          Participants
        </Typography>
        <Box className="py-6">
          {participants.map((profile, profileIndex) => {
            return (
              <ParticipantTile
                key={profile + profileIndex}
                index={profileIndex}
              />
            );
          })}
        </Box>
      </Box>
    </StyledBox>
  );
}

function ParticipantTile({ index }) {
  return (
    <Box className="py-3 px-2  border-gray border flex justify-center items-center bg-white">
      <AccountCircleIcon fontSize="large" className="mr-3" />

      <span className="font-bold text-sm">Person {index}</span>
      <div className="grow" />
      <IconButton>
        <KeyboardArrowRightIcon />
      </IconButton>
    </Box>
  );
}
export default GroupInfo;
