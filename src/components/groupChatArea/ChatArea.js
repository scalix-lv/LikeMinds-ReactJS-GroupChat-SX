import { Box } from "@mui/material";
import React from "react";
import RegularBox from "../channelGroups/RegularBox";
import Input from "@mui/material";
function ChatArea() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RegularBox />
      <div style={{ flexGrow: 1 }} />
      {/* <Input/> */}
    </Box>
  );
}

export default ChatArea;
