/* eslint-disable react/require-default-props */
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useContext } from "react";
import { getString, linkConverter, tagExtracter } from "../../../sdkFunctions";
import parse from "html-react-parser";
import { UserContext } from "../../contexts/userContext";
type ReplyBoxType = {
  openReplyBox: boolean;
  memberName: string;
  answer: string;
  setIsSelectedConversation: any;
  setSelectedConversation: any;
  attachments?: any;
};

const ReplyBox: React.FC<ReplyBoxType> = ({
  openReplyBox,
  memberName,
  answer,
  setIsSelectedConversation,
  setSelectedConversation,
  attachments,
}: ReplyBoxType) => {
  const userContext = useContext(UserContext);
  return (
    <div
      className="w-full justify-between shadow-sm overflow-auto bg-white absolute  max-h-[250px] rounded-[5px]"
      style={{
        display: openReplyBox ? "flex" : "none",
        transform: "translate(0, -105%)",
      }}
    >
      <div className="border-l-4 border-l-green-500 px-2 text-[14px]">
        <p className="mb-3 mt-2 text-green-500">{memberName}</p>
        <div>
          {attachments !== undefined ? (
            <div>
              {attachments.map((item: any) => {
                if (item.type === "image") {
                  return (
                    <img
                      src={item.url}
                      className="h-[120px] w-[120px]"
                      alt=""
                    />
                  );
                }
                return null;
              })}
            </div>
          ) : null}
        </div>
        <div>{parse(linkConverter(tagExtracter(answer, userContext, 1)))}</div>
      </div>
      <div>
        <IconButton
          onClick={() => {
            setIsSelectedConversation(false);
            setSelectedConversation({});
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
};

export default ReplyBox;
