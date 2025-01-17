/* eslint-disable react/require-default-props */
import { Box, Button, IconButton } from "@mui/material";

import { Link, useParams } from "react-router-dom";
import { groupInfoPath } from "../../../routes";

import { MoreOptions } from "../../../styledAccessories/MoreOptions";
import SearchBar from "../../../styledAccessories/SearchBar";
import routeVariable from "../../../enums/routeVariables";
import searchIcon from "./../../../assets/svg/search.svg";
import { useState } from "react";
import ChannelSearch from "../channel-search";
import { CT_EVENTS } from "../../../../../analytics/clevertap/constants";
import CleverTap from "../../../../../analytics/clevertap/CleverTap";

type propsTitle = {
  title: any;
  memberCount?: any;
  chatroomUrl: any;
  openSearch?: any;
  setOpenSearch?: any;
};

const Tittle = ({
  title,
  memberCount,
  chatroomUrl,
  openSearch,
  setOpenSearch,
}: propsTitle) => {
  // const [openSearch, setOpenSearch] = useState(false);
  const closeSearchField = () => {
    setOpenSearch(false);
  };
  const openSearchField = () => {
    setOpenSearch(true);
  };

  return (
    <Box className="flex">
      <div className="w-full flex border-b border-b-[#adadad] my-0 mr-[120px] ml-[28px] pt-0 px-0 pb-[10px] shadow-none z:max-md:mr-6 items-center">
        <>
          <TitleArea
            title={title}
            memberCount={memberCount}
            chatroomUrl={chatroomUrl}
          />
          <IconButton onClick={openSearchField}>
            <img src={searchIcon} alt="" />
          </IconButton>
          <MoreOptions />
        </>
      </div>
    </Box>
  );
};
const TitleArea = ({ title, memberCount, chatroomUrl }: propsTitle) => {
  const params = useParams();
  const id: any = params[routeVariable.id];
  const mode: any = params[routeVariable.mode];
  if (mode == "direct-messages") {
    CleverTap.pushEvents(CT_EVENTS.NETWORK.GROUP.JOINED_GROUP_VISIT, {
      groupName: title,
    });
  } else if (mode == "groups") {
    CleverTap.pushEvents(CT_EVENTS.NETWORK.CHAT.MEMBER_CHAT_CLICK, {
      chatName: title,
    });
  }
  return (
    <Link
      to={mode === "groups" ? `${groupInfoPath}/${id}` : ""}
      className="grow"
    >
      <Box className="text-left">
        {/* For Group Title */}

        <span className="font-semibold text-xl leading-6 cursor-pointer">
          {chatroomUrl && mode === "groups" ? (
            <img
              src={chatroomUrl}
              alt=""
              className="h-[40px] w-[40px] rounded inline mr-2"
            />
          ) : title?.length > 0 && mode === "groups" ? (
            <span
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
                border: "0.5px solid black",
                color: "black",
                backgroundColor: "skyblue",
                borderRadius: "25%",
                padding: "8px",
                marginRight: "8px",
                height: "40px",
                width: "40px",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {title?.substring(0, 1)}
            </span>
          ) : null}
          {title || ""}
        </span>

        {/* For Group Members */}
        <div />
        <span className="text-xs font-normal leading-[14.5px] text-[#ADADAD]">
          {memberCount ? `${memberCount} members` : " "}
        </span>
      </Box>
    </Link>
  );
};

export default Tittle;
