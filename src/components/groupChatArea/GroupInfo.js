import { Box, IconButton } from "@mui/material";
import React, { useContext } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { GroupContext } from "../Groups/Groups";
import Tittle from "./tittle/Tittle";
import backIcon from "../../assets/svg/arrow-left.svg";
import rightArrow from "../../assets/svg/right-arrow.svg";

const StyledBox = styled(Box)({
  backgroundColor: "#f6f6ff",
});

function GroupInfo() {
  const gc = useContext(GroupContext);
  const participants = gc.activeGroup.membersDetail;
  return (
    <StyledBox>
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
          <div className="text-[20px] mt-[8px] font-[700] leading-[24px] text-[#3884F7]">
            Group Info
          </div>
        </div>

        {/* Member list */}
        <div className="ml-1 pl-[5px]">
          <div className="text-4 font-[700] text-[#323232]">Participants</div>
          <div className="py-[18px]">
            {participants.map((profile, profileIndex) => {
              return (
                <ParticipantTile
                  key={profile + profileIndex}
                  profile={profile}
                  index={profileIndex}
                />
              );
            })}
          </div>
        </div>
        {/* Member list */}
      </div>
    </StyledBox>
  );
}

function ParticipantTile({ index, profile }) {
  return (
    <div className="p-2.5 border-[#eeeeee] border-b-[1px] flex justify-between bg-white items-center">
      <div className="flex items-center">
        <div className="w-[36px] h-[36px] border-[1px] border-[#eeeeee] mr-2.5 rounded-[5px] flex justify-center items-center">
          {profile?.name[0]}
        </div>
        <div className="font-bold text-sm">{profile.name}</div>
      </div>

      <IconButton className="w-[32px] h-[32px]">
        <img src={rightArrow} alt="arrow icon" />
      </IconButton>
    </div>
  );
}
export default GroupInfo;
