/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { log } from "../../../sdkFunctions";

type CarouselType = {
  mediaArray: any[];
};

const MediaCarousel = ({ mediaArray }: CarouselType) => (
  <div className="border border-black border-solid">
    <Carousel showArrows showThumbs={false}>
      {mediaArray?.map((item: any) => {
        // log(item);
        return (
          <>
            {item?.type === "image" ? (
              <img
                src={item?.url}
                className="max-w-full max-h-full block h-auto w-auto"
                alt=""
              />
            ) : (
              <video
                controls
                preload="none"
                className="max-w-full max-h-full block h-auto w-auto"
                key={item?.url}
                //   onClick={}
              >
                <source src={item?.url} type="video/mp4" />
                <source src={item?.url} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        );
      })}
    </Carousel>
  </div>
);
export default MediaCarousel;
