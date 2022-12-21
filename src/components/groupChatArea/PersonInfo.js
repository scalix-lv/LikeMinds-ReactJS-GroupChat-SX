// import { AccountCircleIcon } from '@mui/icons-material'
import { Box, Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { StyledBox } from "./GroupChatArea";
import { IconButton } from "@mui/material";
import { Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { myClient } from "../..";
import backIcon from "../../assets/svg/arrow-left.svg";

import userIcon from "./../../assets/user.png";
import { GroupContext } from "../Groups/Groups";
import Tittle from "./tittle/Tittle";

function PersonInfo() {
  const gc = useContext(GroupContext);
  const mediaArray = [LinkedInIcon, InstagramIcon, TwitterIcon];
  const location = useLocation();
  const [profileDate, setProfileData] = useState({});

  useEffect(() => {
    const fn = async () => {
      try {
        const memberCall = await myClient.profileData({
          community_id: location.state.communityId,
          member_id: location.state.memberId,
        });
        setProfileData(memberCall?.member);
      } catch (error) {
        console.log(error);
      }
    };
    fn();
  }, []);
  return (
    <div>
      {/* Title Header */}
      {gc.activeGroup.chatroom?.id ? (
        <Tittle
          headerProps={{
            title: gc.activeGroup.chatroom.header,
            memberCount: gc.activeGroup.participant_count,
          }}
        />
      ) : null}
      {/* Title Header */}

      <div className="mr-[120px] ml-[20px] mt-[10px]">
        <div className="flex">
          <Link to={"/groups/main"}>
            <IconButton>
              <img src={backIcon} alt="back icon" />
            </IconButton>
          </Link>
          <div className="text-[20px] mt-[8px] font-[400] leading-[24px]">
            Group Info /{" "}
            <span className="font-[700] text-[#3884F7]">
              {profileDate.name}
            </span>
          </div>
        </div>

        <Box className="ml-3 mt-4">
          <Box>
            {/* <AccountCircleIcon fontSize="large" /> */}

            <img
              src={profileDate.image_url || userIcon}
              className="w-[60px] h-[60px] rounded-[5px]"
              alt=""
            />
          </Box>
          <p className="text-base font-bold my-2 mx-0 text-[#323232]">
            {profileDate.name}
          </p>
          <Box className="my-2 mx-0">
            {mediaArray.map((MediaIcon, mediaIconIndex) => {
              return <MediaIcon className="m-1 text-4xl" fontSize="medium" />;
            })}
          </Box>
          <Typography
            fontSize={"14px"}
            fontWeight={400}
            color={"#323232"}
            marginTop={2}
          >
            An organized and enthusiastic designer, whose life has been nothing
            but a series of unplanned and unexpected events. I enjoy working on
            topics that are out of the box and that would let me come up with
            innovative ideas.
          </Typography>

          <Typography
            fontSize={"16px"}
            fontWeight={700}
            color={"#323232"}
            marginTop={2}
          >
            {profileDate.custom_title}
          </Typography>

          <Box className="py-4 px-0">
            <p className="font-bold text-2xl">Find them in</p>

            <InfoTile title={"Hiring Techniques"} buttontitle={"Forum"} />
            <InfoTile title={"Beyond Design"} buttontitle={"Group"} />
          </Box>
        </Box>
      </div>
    </div>
  );
}

function InfoTile({ index, title, buttontitle }) {
  return (
    <Box className="bg-white py-2 px-4 flex justify-center items-center border border-solid border-[#EEEEEE] mb-2">
      <Box>
        <p className="mt-0 mx-0 mb-1">
          <span className="text-[#323232] text-base font-semibold">
            {title}
          </span>
        </p>

        <Button
          variant="outlined"
          className="py-1 px-1.5 text-[#E0FFDF] bg-[#83D381] hover:bg-[#E0FFDF] hover:text-[#83D381]"
          startIcon={<FiberManualRecordIcon color="#E0FFDF" />}
        >
          {buttontitle}
        </Button>
      </Box>
      <div className="grow" />

      <Button variant="outlined" className="py-[5px] px-4 text-[#3884F7]">
        View
      </Button>
    </Box>
  );
}

export default PersonInfo;
