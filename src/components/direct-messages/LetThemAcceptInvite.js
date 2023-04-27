import { Box, Button, Typography } from "@mui/material";
import React from "react";
import appLogo from "./../../assets/waitingClock.png";
import TittleDm from "./TitleDM";
function LetThemAcceptInvite({ title }) {
  return (
    <div className="h-full">
      <Box className="flex justify-center items-center flex-col h-full">
        <div className="grow" />
        <img src={appLogo} alt="" className="h-[50px] w-[50px]" />
        <Typography
          fontSize={"24px"}
          fontWeight={700}
          color={"#323232"}
          maxWidth={"400px"}
          textAlign="center"
        >
          Waiting for {title} to accept your request
        </Typography>
        {/* <Button
        sx={{
          background: "#3884F7",
          color: 'white'
        }}
        className='bg-[#3884F7] text-white py-4 px-[34px] text-base my-3 hover:text-[#3884F7] hover:bg-[#EBF3FF]'
        > 
            Accept
        </Button> */}
        <div className="grow" />
      </Box>
    </div>
  );
}

export default LetThemAcceptInvite;
