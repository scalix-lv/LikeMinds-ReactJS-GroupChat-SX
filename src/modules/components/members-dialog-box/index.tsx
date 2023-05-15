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
  const infiniteScrollRef = useRef<any>(null);
  useEffect(() => {
    if (searchKey.length > 0) {
      let timeout = setTimeout(async () => {
        let call = await myClient.searchMembers({
          search: searchKey,
          search_type: "name",
          page: 1,
          page_size: 10,
        });
        setMembers(call.members);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      getMembers(1);
    }
  }, [searchKey]);
  async function getMembers(pg: any) {
    try {
      let call = await myClient.getAllMembers({
        chatroomId: id,
        page: pg,
      });
      if (call.members.length < 10) {
        setShouldLoadMore(false);
      }
      if (members.length < 10) {
        setMembers(call.members);
      } else {
        let newM = [...members];
        newM = newM.concat(call.members);
        setMembers(newM);
      }
    } catch (error) {
      log(error);
    }
  }

  async function addAllMembers() {
    await myClient.sendInvites({
      chatroom_id: id,
      is_secret: true,
      chatroom_participants: checkedMembers,
    });
    onClose();
  }

  useEffect(() => {
    function addClickListener(e: any) {
      if (e?.target?.contains(dialogRef?.current)) {
        onClose();
      }
    }
    document.addEventListener("click", addClickListener);
    return () => {
      document.removeEventListener("click", addClickListener);
    };
  }, []);

  useEffect(() => {
    setShouldLoadMore(true);
  }, [searchKey]);

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
      <div className="max-h-[300px] overflow-auto mb-3" id="memberlist">
        <InfiniteScroll
          ref={infiniteScrollRef}
          dataLength={members?.length}
          next={() => {
            if (
              infiniteScrollRef.current &&
              infiniteScrollRef?.current?.el?.scrollTop === 0
            ) {
              return;
            }
            let pg = Math.floor(members?.length / 10) + 1;
            if (searchKey === "") {
              getMembers(pg);
            } else {
              myClient
                .searchMembers({
                  search: searchKey,
                  search_type: "name",
                  page: pg,
                  page_size: 10,
                })
                .then((res: any) => {
                  if (res.members.length < 10) {
                    setShouldLoadMore(false);
                  }
                  let newM = [...members];
                  newM = newM.concat(res.members);
                  setMembers(newM);
                });
            }
          }}
          hasMore={shouldLoadMore}
          loader={null}
          scrollableTarget="memberlist"
        >
          {members?.map((member: any, index: any) => {
            return (
              <div className="mx-6 py-1 border-b" key={member?.id + index}>
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
      <div className="p-5">
        <button
          className="w-[93px] h-[34px] py-[5px] rounded-[5px] bg-[#3884F7] text-white mr-4"
          onClick={addAllMembers}
        >
          Add
        </button>
        <button
          className="w-[93px] h-[34px] py-[5px] border border-[#3884F7] rounded-[5px] text-[#3884F7] mr-4"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
