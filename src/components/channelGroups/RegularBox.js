import React from "react";
import MessageBlock from "./MessageBlock";

function RegularBox({ convoArray }) {
  // // console.log(convoArray);
  return (
    <div className="ml-[28px] mr-[114px] pt-5">
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
export default RegularBox;

export function DateSpecifier({ dateString }) {
  return (
    <div className="border-b border-solid border-[#EEEEEE] relative my-5 flex justify-center items-center">
      <div className="border-[#EEEEEE] border-solid border py-1 px-3 text-[10px] line-height-[12px] font-normal rounded-[20px] absolute bg-white">
        {dateString}
      </div>
    </div>
  );
}
