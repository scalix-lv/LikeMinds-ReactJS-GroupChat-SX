type ImageAndMediaType = {
  mediaArray: any;
  setMediaDisplayModel: any;
  setMediaData: any;
};
const ImageAndMedia = ({ mediaArray, setMediaDisplayModel, setMediaData }: ImageAndMediaType) => (
  <div className="flex w-full">
    {mediaArray?.length === 1 ? (
      <div
        className="w-full"
        onClick={() => {
          setMediaData({ mediaObj: mediaArray, type: 'image' });
          setMediaDisplayModel(true);
        }}
      >
        {mediaArray[0].type === 'image' ? (
          <img src={mediaArray[0].url!} className="max-w-full max-h-full block h-auto w-auto" alt="" />
        ) : (
          <video
            controls
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
          className="max-w-[50%] h-full grow"
          onClick={() => {
            setMediaData({ mediaObj: mediaArray, type: 'image' });
            setMediaDisplayModel(true);
          }}
        >
          {mediaArray[0].type === 'image' ? (
            <img src={mediaArray[0].url!} alt="" className="max-w-full max-h-full block h-auto w-auto" />
          ) : (
            <video
              controls
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
        <div className="max-w-[50%] grow flex justify-center items-center bg-slate-400" style={{ opacity: '50%' }}>
          <span className="text-xl text-black  text-center">+ {(mediaArray.length - 1).toString()}</span>
        </div>
      </>
    )}
  </div>
);

export default ImageAndMedia;
