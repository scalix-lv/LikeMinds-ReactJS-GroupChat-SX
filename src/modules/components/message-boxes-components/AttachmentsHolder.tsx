/* eslint-disable react/jsx-no-useless-fragment */
import ImageAndMedia from './ImageAndMedia';
import { attType } from './MessageBox';
import pdfIcon from '../../../assets/svg/pdf-document.svg';

type AttachmentHolderType = {
  attachmentsObject: attType;
  setMediaDisplayModel: any;
  setMediaData: any;
};

const AttachmentsHolder = ({ attachmentsObject, setMediaDisplayModel, setMediaData }: AttachmentHolderType) => (
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
        {attachmentsObject.audioAttachments.map((item: any) => (
          <audio controls src={item.url} className="my-2 w-[230]" key={item.url}>
            {' '}
            <a href={item.url}>Download audio</a>
          </audio>
        ))}
      </>
    ) : null}
    {attachmentsObject.docAttachments?.length > 0 ? (
      <>
        {attachmentsObject.docAttachments?.map((item: any) => (
          <a href={item.url} target="_blank" rel="noreferrer" className="mb-2 w-[200px] flex" key={item.url}>
            <img src={pdfIcon} alt="pdf" className="w-[24px]" />
            <span className="text-[#323232] text-[14px] ml-2 mt-1">{item.name}</span>
            <br />
          </a>
        ))}
      </>
    ) : null}
  </>
);

export default AttachmentsHolder;
