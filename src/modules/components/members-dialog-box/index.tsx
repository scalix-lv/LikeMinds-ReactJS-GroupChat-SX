import {
  Checkbox,
  Dialog,
  Icon,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import search from "../../../assets/search.png";
import { myClient } from "../../..";
import { log } from "../../../sdkFunctions";
import { CheckBox } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";

type MemberDialogBoxType = {
  open: boolean;
  onClose: any;
  id: any;
};
export default function MemberDialogBox({
  open,
  onClose,
  id,
}: MemberDialogBoxType) {
  const [searchKey, setSearchKey] = useState("");
  const [members, setMembers] = useState([]);
  const [checkedMembers, setCheckedMembers] = useState<any[]>([]);
  const [shouldLoadMore, setShouldLoadMore] = useState(true);
  const dialogRef = useRef(null);
  useEffect(() => {
    let timeout = setTimeout(() => {}, 500);
    return () => clearTimeout(timeout);
  });
  async function getMembers(pg: any) {
    try {
      let call = await myClient.getAllMembers({
        chatroomId: id,
        page: pg,
      });
      if (call.members.length < 10) {
        setShouldLoadMore(false);
      }
      let newM = [...members];
      newM = newM.concat(call.members);
      setMembers(newM);
    } catch (error) {
      log(error);
    }
  }
  useEffect(() => {
    getMembers(1);
  }, []);
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "662px",
        },
      }}
      fullWidth={true}
    >
      <div className="pt-[30px] px-5 pb-3 grow" ref={dialogRef}>
        {/* <TextField
          variant="filled"
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
          fullWidth={true}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={search} alt="" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "12px",
              borderBottom: "none",
            },
          }}
          sx={{
            borderRadius: "12px",
          }}
        /> */}
        <div>
          <img src={search} alt="" className="absolute mt-[14px] ml-[14px]" />
          <input
            type="text"
            className="w-full bg-[#F5F5F5] rounded-[10px] text-[14px] h-[48px] pl-[42px]"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="max-h-[300px] overflow-auto" id="memberlist">
        <InfiniteScroll
          dataLength={members.length}
          next={() => {
            log("loadingh");
            let pg = members.length / 10 + 1;
            getMembers(pg);
          }}
          hasMore={shouldLoadMore}
          loader={null}
          scrollableTarget="memberlist"
        >
          {members.map((member: any) => {
            return (
              <div className="mx-6 py-1 border-b" key={member?.id}>
                <Checkbox
                  onChange={(e) => {
                    e.target.checked = !e.target.checked;
                    let newCheckedList: any = [...checkedMembers];
                    newCheckedList.push(member?.id);
                    setCheckedMembers(newCheckedList);
                  }}
                />
                <span className="font-medium">{member?.name}</span>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </Dialog>
  );
}
