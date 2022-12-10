import React from "react";
import MessageBlock from "./MessageBlock";

function RegularBox({ convoArray }) {
  return (
    <div className="pt-6 pr-24 pb-3 pl-6 w-full">
      <DateSpecifier dateString={convoArray[0].date} />

      {convoArray.map((conversation, conversationIndex) => {
        return (
          <MessageBlock
            userId={conversation.member.id}
            conversationObject={conversation}
            key={conversation.id}
          />
        );
      })}
    </div>
  );
}

function DateSpecifier({ dateString }) {
  return (
    <div className="border border-solid border-[#EEEEEE] relative mb-3">
      <span className="border-[#EEEEEE] border-solid border py-1 px-3 text-[10px] line-height-[12px] font-normal rounded-[20px] absolute left-[50%] translate-y-[-50%] bg-white">
        {dateString}
      </span>
    </div>
  );
}

export default RegularBox;
