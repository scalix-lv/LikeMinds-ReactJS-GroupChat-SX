import { Box, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import { GroupContext } from "../../Main";
import Tittle from "./tittle/Tittle";
import backIcon from "../../assets/svg/arrow-left.svg";
import rightArrow from "../../assets/svg/right-arrow.svg";
import { getAllChatroomMember, log } from "../../sdkFunctions";
import InfiniteScroll from "react-infinite-scroll-component";
import { myClient } from "../..";
import { groupPersonalInfoPath, groupMainPath } from "../../routes";

const StyledBox = styled(Box)({
  backgroundColor: "#f6f6ff",
});

function GroupInfo() {
  const gc = useContext(GroupContext);
  const [participantList, setParticipantList] = useState([]);
  const [loadMode, setLoadMore] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  let callFn = (isSecret) => {
    log("here");
    const getMemberList = async (isSecret) => {
      try {
        let page = Math.floor(participantList.length / 10) + 1;
        let call = await myClient.viewParticipants({
          chatroom_id: gc.activeGroup.chatroom.id,
          is_secret: isSecret,
          page: page,
          page_size: 10,
        });
        if (call.participants.length < 10) {
          setLoadMore(false);
        }
        let newList = participantList.concat(call.participants);
        setParticipantList(newList);
      } catch (error) {
        log(error);
      }
    };
    getMemberList(isSecret);
  };
  // myClient.fb(gc.activeGroup.chatroom.id);
  useEffect(() => {
    if (Object.keys(gc.activeGroup).length > 0) {
      const isSecret = gc.activeGroup.chatroom.is_secret;
      callFn(isSecret);
    }
  }, [gc.activeGroup]);

  return (
    <div className=" w-full customHeight">
      {/* Title Header */}
      {gc.activeGroup.chatroom?.id ? (
        <Tittle
          title={gc.activeGroup.chatroom.header}
          memberCount={totalMembers}
        />
      ) : null}
      {/* Title Header */}

      <div className="mr-[120px] ml-[20px] mt-[10px] h-full z:max-md:mr-[28px]">
        <div className="flex">
          <Link to={groupMainPath + "/" + gc.activeGroup.chatroom.id}>
            <IconButton>
              <img src={backIcon} alt="back icon" />
            </IconButton>
          </Link>
          <div className="text-[20px] mt-[8px] font-[700] leading-[24px] text-[#3884F7]">
            Group Info
          </div>
        </div>

        {/* Member list */}
        <div className="ml-1 pl-[5px] h-full">
          <div className="text-4 font-[700] text-[#323232]">Participants</div>
          <div
            className="py-[18px] overflow-auto max-h-[70%]"
            id="participant-list"
          >
            <InfiniteScroll
              next={() => callFn(gc.activeGroup.chatroom.is_secret)}
              hasMore={loadMode}
              dataLength={participantList.length}
              scrollableTarget="participant-list"
            >
              {participantList?.map((profile, profileIndex) => {
                return (
                  <ParticipantTile
                    key={profile.id + profileIndex + Math.random()}
                    profile={profile}
                    index={profileIndex}
                  />
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
        {/* Member list */}
      </div>
    </div>
  );
}

function ParticipantTile({ index, profile }) {
  const navigate = useNavigate();
  const groupContext = useContext(GroupContext);
  return (
    <div
      className="p-2.5 border-[#eeeeee] border-b-[1px] flex justify-between bg-white items-center cursor-pointer"
      onClick={() => {
        navigate(groupPersonalInfoPath, {
          state: {
            memberId: profile.id,
            communityId: groupContext.activeGroup.community?.id,
          },
        });
      }}
    >
      <div className="flex items-center">
        <div className="w-[36px] h-[36px] uppercase border-[1px] border-[#eeeeee] bg-[#eeeeee] mr-2.5 rounded-[5px] flex justify-center items-center">
          {profile?.name[0]}
        </div>
        <div className="font-bold text-sm capitalize">{profile.name}</div>
      </div>

      <IconButton className="w-[32px] h-[32px]">
        <img src={rightArrow} alt="arrow icon" />
      </IconButton>
    </div>
  );
}
export default GroupInfo;
