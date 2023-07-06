import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DateTimePicker } from "@mui/x-date-pickers";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { messageStrings } from "../../enums/strings";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { myClient } from "../..";
import { useParams } from "react-router-dom";
import routeVariable from "../../enums/routeVariables";

function PollBody() {
  const [question, setQuestion] = useState<any>("");
  const [optionsArray, setOptionsArray] = useState<any>([]);
  const [voterAddOptions, setVoterAddOptions] = useState(false);
  const [anonymousPoll, setAnonymousPoll] = useState(false);
  const [liveResults, setLiveResults] = useState(false);
  const [voteAllowerPerUserTerm, setVoteAllowedPerUserTerm] = useState<any>(1);
  const [voteAllowedPerUser, setVoteAllowedPerUser] = useState<any>(0);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<any>(false);
  const [expiryTime, setExpiryTime] = useState<any>("");

  const params = useParams();
  const id = params[routeVariable.id];
  useEffect(() => {
    let id_1 = nanoid();
    let id_2 = nanoid();
    let initialOptionArray = [
      {
        id: id_1,
        text: "",
      },
      {
        id: id_2,
        text: "",
      },
    ];
    setOptionsArray(initialOptionArray);
  }, []);

  function setQuestionField(e: any) {
    setQuestion(e.target.value);
  }
  function handleInputOptionsChangeFunction(index: any, value: any) {
    const newOptions: any = [...optionsArray];
    newOptions[index].text = value;
    setOptionsArray(newOptions);
  }
  function addNewOption() {
    let newOptionsArr = [...optionsArray];
    let newOption = {
      id: nanoid(),
      text: "",
    };
    newOptionsArr.push(newOption);
    setOptionsArray(newOptionsArr);
  }
  function removeAnOption(index: any) {
    const newOptionsArr = [...optionsArray];
    newOptionsArr.splice(index, 1);
    setOptionsArray(newOptionsArr);
  }
  async function postPoll() {
    try {
      const polls = optionsArray.map((item: any) => {
        return {
          text: item?.text,
        };
      });
      const pollOptions = {
        chatroomId: parseInt(id!),
        text: question,
        expiryTime: parseInt(expiryTime),
        pollType: 0,
        isAnonymous: anonymousPoll,
        allowAddOption: voterAddOptions,
        polls: polls,
        state: 10,
        multipleSelectState: voteAllowerPerUserTerm,
        multipleSelectNo: voteAllowedPerUser,
      };
      console.log(pollOptions);
      const pollCall = await myClient.postPollConversation(pollOptions);
      console.log(pollCall);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="pt-2">
        <textarea
          className="text-4 font-semibold leading-6 w-full border border-[#D0D8E2] rounded-2 p-4 resize-none"
          placeholder="Ask a question*"
          value={question}
          onChange={setQuestionField}
          rows={2}
        />

        <p>{messageStrings.POLL_OPTIONS_HEADING}</p>
        <div className="mb-2">
          {optionsArray.map((option: any, index: any) => {
            return (
              <div className="my-4 relative" key={option.id}>
                <input
                  type="text"
                  value={option?.text}
                  onChange={(e: any) => {
                    handleInputOptionsChangeFunction(index, e?.target?.value);
                  }}
                  className="text-4 font-semibold leading-6 w-full border border-[#D0D8E2] rounded-2 p-4"
                  placeholder="Option"
                />
                <span
                  className="absolute top-[50%] right-0 mr-4 -translate-y-1/2 cursor-pointer"
                  onClick={() => {
                    removeAnOption(index);
                  }}
                >
                  <HighlightOffIcon />
                </span>
              </div>
            );
          })}
          <div
            className="text-4 font-semibold leading-6 w-full border border-[#D0D8E2] rounded-2 p-4 flex items-center cursor-pointer"
            onClick={addNewOption}
          >
            <AddCircleOutlineIcon className="text-[#00897B]" />
            <span className="px-2 text-[#00897B]">
              {messageStrings.ADD_ANOTHER_POLL_OPTION}
            </span>
          </div>
        </div>
        <p>{messageStrings.POLL_EXPIRES_ON_HEADING}</p>
        {/* <div className="text-4 font-semibold leading-6 w-full border border-[#D0D8E2] rounded-2  cursor-pointer"> */}
        <DateTimePicker
          sx={{
            width: "100%",
            border: "1px solid #D0D8E2",
          }}
          onChange={(val: any) => {
            setExpiryTime(Date.parse(val["$d"].toString()));
          }}
        />
        {/* </div> */}

        <div
          className="w-full border border-[#D0D8E2] mt-4 rounded-8 rounded"
          style={{
            display: isAdvancedOpen ? "block" : "none",
          }}
        >
          <div className="border-b border-[#D0D8E2] flex justify-between items-center p-2 py-4">
            <span className="text-4">
              {messageStrings.ALLOW_VOTERS_TO_ADD_OPTIONS}
            </span>
            <Switch
              value={voterAddOptions}
              onChange={(e) => {
                setVoterAddOptions(e.target.checked);
              }}
            />
          </div>
          <div className="border-b border-[#D0D8E2] flex justify-between items-center p-2 py-4">
            <span className="text-4">{messageStrings.ANONYMOUS_POLL}</span>
            <Switch
              value={anonymousPoll}
              onChange={(e) => {
                setAnonymousPoll(e.target.checked);
              }}
            />
          </div>
          <div className="border-b border-[#D0D8E2] flex justify-between items-center p-2 py-4">
            <span className="text-4">
              {messageStrings.DONT_SHOW_LIVE_RESULTS}
            </span>
            <Switch
              value={liveResults}
              onChange={(e) => {
                setLiveResults(e.target.checked);
              }}
            />
          </div>
          <div className="border-b border-[#D0D8E2] p-2 py-4">
            {/* <p>{messageStrings.USERS_CAN_VOTE_FOR}</p> */}
            <div className="flex justify-between items-center">
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="user-can-vote-term">
                  {messageStrings.USERS_CAN_VOTE_FOR}
                </InputLabel>
                <Select
                  labelId="user-can-vote-term"
                  id="demo-simple-select-standard"
                  value={voteAllowerPerUserTerm}
                  onChange={(e) => {
                    setVoteAllowedPerUserTerm(e.target.value);
                  }}
                  label="Age"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={0}>Exactly</MenuItem>
                  <MenuItem value={1}>Atmost</MenuItem>
                  <MenuItem value={2}>Atleast</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={voteAllowedPerUser}
                  onChange={(e) => {
                    setVoteAllowedPerUser(e.target.value);
                  }}
                  label="Age"
                >
                  <MenuItem value={0}>1 Option</MenuItem>
                  <MenuItem value={1}>2 Option</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <div
          className="flex justify-center cursor-pointer"
          onClick={() => {
            setIsAdvancedOpen(!isAdvancedOpen);
          }}
        >
          <span>Advanced</span>
          {isAdvancedOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>

        <div
          className="flex justify-center items-center cursor-pointer mt-4"
          onClick={postPoll}
        >
          <CheckCircleIcon
            className="text-[#00897B]"
            style={{
              fontSize: "72px",
            }}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default PollBody;
