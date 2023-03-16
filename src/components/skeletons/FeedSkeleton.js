import { Skeleton } from "@mui/material";
import React from "react";

function FeedSkeleton() {
  const arr = Array(6).fill(null);
  return (
    <div>
      {arr.map(() => {
        return <Feed />;
      })}
    </div>
  );
}

function Feed() {
  return (
    <div className="h-[56px] flex items-start flex-col border-[#EEEEEE] border-t-[1px] justify-evenly">
      <Skeleton
        variant="rectangular"
        height={15}
        width={"50%"}
        sx={{
          marginX: "12px",
        }}
      />
      {/* <Skeleton variant="rectangular" height={15} width={"90%"} sx={{}} /> */}
    </div>
  );
}

export default FeedSkeleton;
