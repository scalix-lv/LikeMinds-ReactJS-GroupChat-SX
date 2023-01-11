import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import Gap from "../../styledAccessories/Gap";

import SearchBar from "../../styledAccessories/SearchBar";
import MoreOptions, {
  MoreOptionsDM,
} from "../../styledAccessories/MoreOptions";
import { Link, useNavigate } from "react-router-dom";
import { directMessageInfoPath } from "../../routes";
import { DmContext } from "./DirectMessagesMain";
const TitleBox = styled(Box)({
  display: "flex",
  width: "100%",
  borderBottom: "1px solid #adadad",
  margin: "0 120px 0px 28px",
  padding: "0 0 10px 0px",
  boxShadow: "none",
});

function TittleDm({ title }) {
  return (
    <Box className="flex">
      <TitleBox>
        <TitleArea title={title} />
        <Gap />
        <OptionArea />
      </TitleBox>
      <Box className="flex" />
    </Box>
  );
}

function TitleArea({ title }) {
  const navigate = useNavigate();
  const dmContext = useContext(DmContext);
  return (
    <div
      className="text-left"
      onClick={() => {
        navigate(directMessageInfoPath, {
          state: {
            memberId: dmContext.currentChatroom.chatroom_with_user.id,
            communityId: dmContext.currentProfile.community.id,
          },
        });
      }}
    >
      <span component={"p"} className="font-semibold text-xl leading-6">
        {title ? title : null}
      </span>
      <div />
      <span className="text-xs font-normal leading-[14.5px] text-[#ADADAD]">
        Member
      </span>
    </div>
  );
}

function OptionArea() {
  return (
    <Box>
      <SearchBar />
      <MoreOptionsDM />
    </Box>
  );
}

export default TittleDm;
