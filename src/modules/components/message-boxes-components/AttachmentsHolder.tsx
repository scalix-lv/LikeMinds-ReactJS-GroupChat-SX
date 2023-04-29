import { useState } from "react";
import ImageAndMedia from "./ImageAndMedia";
import { attType } from "./MessageBox";
type AttachmentHolderType = {
  attachmentsObject: attType;
  setMediaDisplayModel: any;
  setMediaData: any;
};

const AttachmentsHolder = ({
  attachmentsObject,
  setMediaDisplayModel,
  setMediaData,
}: AttachmentHolderType) => {
  return (
    <>
      {attachmentsObject.mediaAttachments?.length > 0 ? (
        <ImageAndMedia
          mediaArray={attachmentsObject.mediaAttachments}
          setMediaDisplayModel={setMediaDisplayModel}
          setMediaData={setMediaData}
        />
      ) : null}
      {attachmentsObject.audioAttachments?.length > 0 ? (
        <>
          {attachmentsObject.audioAttachments.map((item: any) => {
            return (
              <audio
                controls
                src={item.url}
                className="my-2 w-[230]"
                key={item.url}
              >
                {" "}
                <a href={item.url}>Download audio</a>
              </audio>
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default AttachmentsHolder;
