import { Grid } from "@mui/material";
import React from "react";
import GroupChatArea from "../groupChatArea/GroupChatArea";

function ChannelGroups() {
  return (
    <Grid container>
      <Grid item md={4}></Grid>
      <Grid item md={8}>
        <GroupChatArea />
      </Grid>
    </Grid>
  );
}

export default ChannelGroups;
