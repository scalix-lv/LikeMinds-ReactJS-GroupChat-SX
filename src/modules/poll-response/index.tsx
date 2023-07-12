import React, { useContext, useEffect, useState } from "react";
import { linkConverter, tagExtracter } from "../../sdkFunctions";
import { UserContext } from "../contexts/userContext";
import parse from "html-react-parser";
import { messageStrings } from "../../enums/strings";
import { myClient } from "../..";
import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AccountCircle } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
type PollResponseProps = {
  conversation: any;
};
const PollResponse = ({ conversation }: PollResponseProps) => {
  const { answer = "" } = conversation;
  const userContext = useContext(UserContext);
  const [selectedPolls, setSelectedPolls] = useState<any>([]);
  const [shouldShowSubmitPollButton, setShouldShowSubmitPollButton] =
    useState(false);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [addPollDialog, setAddPollDialog] = useState(false);
  const [addOptionInputField, setAddOptionInputField] = useState("");
  const [hasPollEnded, setHasPollEnded] = useState(false);

  function setSelectedPollOptions(pollIndex: any) {
    const newSelectedPolls = [...selectedPolls];
    const isPollIndexIncluded = newSelectedPolls.includes(pollIndex);
    if (isPollIndexIncluded) {
      const selectedIndex = newSelectedPolls.findIndex(
        (index) => index === pollIndex
      );
      newSelectedPolls.splice(selectedIndex, 1);
    } else {
      newSelectedPolls.push(pollIndex);
    }
    setSelectedPolls(newSelectedPolls);
  }

  useEffect(() => {
    const difference = conversation?.expiry_time - Date.now();

    if (difference > 0) {
      setHasPollEnded(false);
    } else {
      setHasPollEnded(true);
    }
    if (difference > 0) {
      let timer = setTimeout(() => {
        setHasPollEnded(true);
      }, difference);

      return () => {
        clearTimeout(timer);
      };
    }
  });

  useEffect(() => {
    const res = conversation?.polls?.some((poll: any) => {
      return poll.is_selected === true;
    });
    setShowResultsButton(res);
  }, []);
  useEffect(() => {
    if (conversation?.multiple_select_no === undefined) {
      if (selectedPolls.length > 0) {
        setShouldShowSubmitPollButton(true);
      } else {
        setShouldShowSubmitPollButton(false);
      }
    } else {
      switch (conversation?.multiple_select_state) {
        case undefined: {
          if (selectedPolls.length === 1) {
            setShouldShowSubmitPollButton(true);
          }
          break;
        }
        case 1: {
          if (
            selectedPolls.length <= conversation.multiple_select_no &&
            selectedPolls.length > 0
          ) {
            setShouldShowSubmitPollButton(true);
          }
          break;
        }
        case 2: {
          if (selectedPolls.length >= conversation.multiple_select_no) {
            setShouldShowSubmitPollButton(true);
          }
          break;
        }
        default: {
          setShouldShowSubmitPollButton(false);
        }
      }
    }
  }, [selectedPolls]);
  async function submitPoll() {
    try {
      //   console.log(selectedPolls);
      const polls = selectedPolls?.map((itemIndex: any) => {
        return conversation?.polls[itemIndex];
      });
      console.log(polls);
      const pollSubmissionCall = await myClient.submitPoll({
        conversationId: conversation?.id,
        polls: polls,
      });
      console.log(pollSubmissionCall);
    } catch (error) {
      console.log("error at poll submission");
      console.log(error);
    }
  }

  async function addPollOption() {
    try {
      if (addOptionInputField.length === 0) {
        return;
      }
      const pollObject = {
        text: addOptionInputField,
      };
      const addPollCall = await myClient.addPollOption({
        conversationId: conversation.id,
        poll: pollObject,
      });
    } catch (error) {
      console.log("error at addPollOption");
      console.log(error);
    }
  }

  return (
    <div className="w-full p-2">
      <Dialog
        open={addPollDialog}
        onClose={() => {
          setAddPollDialog(false);
        }}
      >
        <div className="p-12 relative bg-white w-[350px] min-h-[250px]">
          <span
            onClick={() => {
              setAddPollDialog(false);
            }}
            className=" top-[16px] right-[16px] absolute  cursor-pointer"
          >
            <CloseIcon />
          </span>
          <div className="py-2 text-md text-black font-800">
            Add new poll option
          </div>
          <div className="text-400 text-sm">
            Enter an option that you think is missing in this poll. This can not
            be undone.
          </div>
          <div className="py-4">
            <input
              value={addOptionInputField}
              onChange={(e) => {
                setAddOptionInputField(e.target.value);
              }}
              type="text"
              className="w-full border border-[#727272] rounded-[16px] px-2 py-2"
            />
          </div>
          <div className="mt-2">
            <button
              className="w-full flex justify-center items-center bg-[#3884f7] border border-[#727272] rounded-[16px] py-2 mb-2 hover:opacity-50"
              onClick={addPollOption}
            >
              <span className="text-sm text-white hover:text-black">
                SUBMIT
              </span>
            </button>
          </div>
        </div>
      </Dialog>
      <div>
        <div className="flex justify-start items-center">
          <span className="text-xs pr-4 text-[#9B9B9B]">
            {conversation?.poll_type === 0
              ? messageStrings.INSTANT_POLL
              : messageStrings.DEFFERED_POLL}
          </span>
          <span className="text-xs pr-4 text-[#9B9B9B]">
            {conversation?.submit_type_text}
          </span>
        </div>
        <div className="my-2 flex">
          <span>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="#3884f7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="12"
                fill="#3884f7"
                stroke="none"
                stroke-width="3"
              />
              <path d="M9 17H7V11H9V17Z" fill="white" />
              <path d="M13 17H11V8H13V17Z" fill="white" />
              <path d="M17 17H15V13H17V17Z" fill="white" />
            </svg>
          </span>
          <span className="grow" />
          <span
            className={`border rounded-full py-1 px-2 text-xs text-white ${
              hasPollEnded ? "bg-[#ff0000]" : "bg-[#3884f7]"
            }`}
          >
            {hasPollEnded
              ? "Poll Ended"
              : "Poll Ends " + dayjs(conversation?.expiry_time).fromNow()}
          </span>
        </div>
        <div className="text-[14px] w-full font-[500] text-[#323232]">
          <span className="msgCard">
            {parse(linkConverter(tagExtracter(answer, userContext)))}
          </span>
        </div>
        <div>
          {conversation?.polls?.map(
            (poll: any, index: any, pollsArray: any) => {
              return (
                <VoteOptionField
                  poll={poll}
                  pollsArray={pollsArray}
                  setSelectedPollOptions={setSelectedPollOptions}
                  index={index}
                  conversationId={conversation?.id}
                  key={poll?.id}
                />
              );
            }
          )}
        </div>
        <div
          className={`my-2 ${
            conversation?.allow_add_option &&
            conversation?.poll_type === 0 &&
            !showResultsButton
              ? null
              : "hidden"
          } border border-[#D0D8E2] rounded py-2 flex justify-center hover:opacity-80  cursor-pointer`}
          onClick={() => {
            setAddPollDialog(true);
          }}
        >
          <span className="mx-auto text-black text-sm hover:text-black">
            ADD OPTION
          </span>
        </div>
        <div
          className={`my-2 ${
            shouldShowSubmitPollButton && showResultsButton === false
              ? null
              : "hidden"
          } border border-[#EEEEEE] rounded-[48px] py-2 flex justify-center bg-[#3884f7] hover:opacity-80 cursor-pointer`}
          onClick={submitPoll}
        >
          <span className="mx-auto text-white text-sm">SUBMIT</span>
        </div>
        <span className="pt-4 text-xs text-[#9B9B9B]">
          {conversation.poll_answer_text}
        </span>
      </div>
    </div>
  );
};

function VoteOptionField({
  poll,
  pollsArray,
  setSelectedPollOptions,
  index,
  conversationId,
  setShouldShowResults,
}: any) {
  const [shouldShowVotes, setShouldShowVotes] = useState(false);
  const [showSelected, setShowSelected] = useState(false);
  const [pollResults, setPollResults] = useState<any>();
  const [shouldOpenPollResultsDialog, setShouldOpenPollResultsDialog] =
    useState(false);

  function clickHandler() {
    setShowSelected(!showSelected);
    setSelectedPollOptions(index);
  }
  async function getPollUsers() {
    try {
      const getPollUsersCall: any = await myClient.getPollUsers({
        conversationId: conversationId,
        pollId: poll?.id,
      });
      console.log(getPollUsersCall.data);
      setPollResults(getPollUsersCall?.data);
    } catch {}
  }
  useEffect(() => {
    const res = pollsArray?.some((poll: any) => {
      return poll.is_selected === true;
    });
    console.log("the value of shouldShowVotes is ", res);
    setShouldShowVotes(res);
  }, []);

  useEffect(() => {
    if (shouldShowVotes) {
      getPollUsers();
    }
  }, [shouldShowVotes]);

  return (
    <>
      <Dialog
        open={shouldOpenPollResultsDialog}
        onClose={() => {
          setShouldOpenPollResultsDialog(!shouldOpenPollResultsDialog);
        }}
      >
        <div className="py-2 px-4 min-h-[600px] min-w-[400px] max-h-full">
          <span
            className="absolute top-[16px] right-[16px] cursor-pointer"
            onClick={() => {
              setShouldOpenPollResultsDialog(!shouldOpenPollResultsDialog);
            }}
          >
            <CloseIcon />
          </span>
          <div className="my-12">
            {pollResults?.members?.map((member: any) => {
              return (
                <div className="py-2 px-4 flex items-center" key={member.id}>
                  <div className="mr-8">
                    {member?.image_url?.length !== 0 ? (
                      <>
                        <img src={member?.image_url} alt="imageIcon" />
                      </>
                    ) : (
                      <>
                        <AccountCircle />
                      </>
                    )}
                  </div>
                  <div className="grow">{member.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
      <div key={poll?.id} className={` text-md font-[300] mt-2 cursor-pointer`}>
        <div onClick={clickHandler}>
          {poll.is_selected || showSelected ? (
            <div
              className={`border border-[#3884f7] py-2 px-4 rounded rounded-2`}
            >
              {poll?.text}
            </div>
          ) : (
            <div className="border border-[#D0D8E2] rounded rounded-2 py-2 px-4">
              {poll?.text}
            </div>
          )}
        </div>
      </div>
      {shouldShowVotes ? (
        <span
          className="cursor-pointer text-xs"
          onClick={() => {
            setShouldOpenPollResultsDialog(true);
          }}
        >
          {poll.no_votes} votes
        </span>
      ) : null}
    </>
  );
}
export default PollResponse;
