import React from "react";
import MediaCarousel from "../carousel";

type ImageAndMediaType = {
  mediaArray: any;
  setMediaDisplayModel: any;
  setMediaData: any;
};
const ImageAndMedia = ({
  mediaArray,
  setMediaDisplayModel,
  setMediaData,
}: ImageAndMediaType) => {
  return (
    <>
      <div className="flex">
        {mediaArray?.length === 1 ? (
          <div
            className="w-full"
            onClick={() => {
              setMediaData({ mediaObj: mediaArray, type: "image" });
              setMediaDisplayModel(true);
            }}
          >
            {mediaArray[0].type == "image" ? (
              <img
                src={mediaArray[0].url!}
                className="max-w-full max-h-full block h-auto w-auto"
              />
            ) : (
              <video
                controls={true}
                preload="none"
                className="max-w-full max-h-full block h-auto w-auto"
                key={mediaArray[0]?.url}
                //   onClick={}
              >
                <source src={mediaArray[0]?.url} type="video/mp4" />
                <source src={mediaArray[0]?.url} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ) : (
          <>
            <div
              className="max-w-[50%] h-full"
              onClick={() => {
                setMediaData({ mediaObj: mediaArray, type: "image" });
                setMediaDisplayModel(true);
              }}
            >
              {mediaArray[0].type == "image" ? (
                <img
                  src={mediaArray[0].url!}
                  className="max-w-full max-h-full block h-auto w-auto"
                />
              ) : (
                <video
                  controls={true}
                  preload="none"
                  className="max-w-full max-h-full block h-auto w-auto"
                  key={mediaArray[0]?.url}
                  //   onClick={}
                >
                  <source src={mediaArray[0]?.url} type="video/mp4" />
                  <source src={mediaArray[0]?.url} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div
              className="w-full"
              style={{
                opacity: "50%",
              }}
            >
              <div
                className="flex justify-center items-center grow bg-contain h-full"
                style={{
                  background: `url(${mediaArray[1]?.url})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                }}
              >
                <span className="text-xl text-black  text-center">
                  + {(mediaArray.length - 1).toString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ImageAndMedia;
