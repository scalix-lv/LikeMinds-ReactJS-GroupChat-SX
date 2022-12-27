import { Margin } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useContext } from "react";
import { DmContext } from "./DirectMessagesMain";

function DmMemberTile({ profile, profileIndex }) {
  console.log(profile);
  return (
    <div className="flex justify-between py-[10px] px-[20px] border border-solid border-[#EEEEEE] cursor-pointer">
      <span className="text-base font-normal">{profile.name}</span>
      <div style={{ flexGrow: 1 }} />
      <Button
        sx={{
          background: "#3884F7",
          width: "87px",
          height: "34px",
          marginRight: "12px",
          color: "white",
          ":hover": {
            background: "grey",
          },
        }}
        variant="filled"
      >
        Message
      </Button>
      <Button
        sx={{
          width: "107px",
          height: "34px",
        }}
        variant="outlined"
      >
        View Profile
      </Button>
    </div>
  );
}

export default DmMemberTile;
