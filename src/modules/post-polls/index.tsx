import React from "react";
import PollHeader from "./poll-header";
import PollBody from "./poll-body";

function Poll() {
  return (
    <div className="w-[424px] min-h-[614px] max-h-[700px] relative py-5 px-12 bg-white overflow-scroll opacity-100">
      <PollHeader />
      <PollBody />
    </div>
  );
}

export default Poll;
