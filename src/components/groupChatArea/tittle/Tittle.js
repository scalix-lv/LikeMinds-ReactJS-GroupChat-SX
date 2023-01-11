import styled from "@emotion/styled";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import Gap from "../../../styledAccessories/Gap";

import SearchBar from "../../../styledAccessories/SearchBar";
import { MoreOptions } from "../../../styledAccessories/MoreOptions";
import { Link } from "react-router-dom";
import { groupInfoPath } from "../../../routes";
const TitleBox = styled(Box)({
  display: "flex",
  width: "100%",
  borderBottom: "1px solid #adadad",
  margin: "0 120px 0px 28px",
  padding: "0 0 10px 0px",
});

function Tittle({ title, memberCount }) {
  return (
    <Box className="flex">
      <TitleBox>
        <TitleArea title={title} memberCount={memberCount} />
        <Gap />
        <OptionArea />
      </TitleBox>
      <Box className="flex" />
    </Box>
  );
}

function TitleArea({ title, memberCount }) {
  return (
    <Box className="text-left">
      {/* For Group Title */}
      <span component={"p"} className="font-semibold text-xl leading-6">
        {title ? title : null}
      </span>

      {/* For Group Members */}
      <div />
      <span className="text-xs font-normal leading-[14.5px] text-[#ADADAD]">
        <Link to={groupInfoPath}>
          {memberCount ? memberCount : null} members
        </Link>
      </span>
    </Box>
  );
}

function OptionArea() {
  return (
    <Box>
      <SearchBar />
      <MoreOptions />
    </Box>
  );
}

export default Tittle;
