import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { messageStrings } from "../../enums/strings";
function PollHeader() {
  return (
    <div className="relative flex flex-col-reverse pt-5">
      <span className="absolute right-0 top-0">
        <CloseIcon />
      </span>
      <p className="text-black">{messageStrings.NEW_POLL}</p>
    </div>
  );
}

export default PollHeader;
