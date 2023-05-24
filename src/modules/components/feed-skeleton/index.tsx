import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';

const SkeletonFeed = () => {
  const [removeFeed, setRemoveFeed] = useState(false);
  function changeSkeleton() {
    setRemoveFeed(true);
  }
  useEffect(() => {
    document.addEventListener('feedLoaded', changeSkeleton);
    return () => {
      document.removeEventListener('feedLoaded', changeSkeleton);
    };
  });
  if (removeFeed) {
    return null;
  }
  return (
    <>
      {Array(30)
        .fill(0)
        .map((_item: any, index: any) => (
          <div className="px-4 py-4 border" key={index}>
            <Skeleton height={32} />
          </div>
        ))}
    </>
  );
};

export default SkeletonFeed;
