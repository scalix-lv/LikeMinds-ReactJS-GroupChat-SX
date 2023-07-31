/* eslint-disable no-use-before-define */
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { getReportingOptions } from '../../../sdkFunctions';

import CleverTap from '../../../../../analytics/clevertap/CleverTap';
import { CT_EVENTS } from '../../../../../analytics/clevertap/constants';

type ReportConversationDialogBoxType = {
  convoId: any;
  onClick: any;
  closeBox: any;
  reportedMemberId: any;
  title: string;
};
const ReportConversationDialogBox = ({
  convoId,
  onClick,
  closeBox,
  reportedMemberId,
  title
}: ReportConversationDialogBoxType) => {
  const [reasonArr, setReasonArr] = useState([]);
  useEffect(() => {
    getReportingOptions()
      .then((r: any) => setReasonArr(r.data.report_tags))
      .catch((_e) => {
        // // console.log(e);
      });
  }, []);
  return (
    <div className="bg-white p-4 w-[400px]">
      <div className="flex justify-between p-4">
        <div className="text-base font-bold mt-2">Report Message</div>
        <IconButton onClick={closeBox}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className="px-4 pb-4">
        <p className="text-sm font-bold mb-2">Please specify the problem to continue</p>
        <p className="text-sm font-normal text-[#666666]">
          You would be able to report this message after selecting a problem.
        </p>
        <div className="mt-3 w-full text-center">
          <div className="my-3 w-full text-left">
            {reasonArr.map((item: any) => (
              <ReportedReasonBlock
                id={item?.id}
                name={item?.name}
                title={title}
                conversationid={convoId}
                onClickhandler={onClick}
                reportedMemberId={reportedMemberId}
                key={item?.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
type ReasonType = {
  id: any;
  name: any;
  title: string;
  onClickhandler: any;
  conversationid: any;
  reportedMemberId: any;
};
const ReportedReasonBlock = ({ id, name, onClickhandler, conversationid, reportedMemberId, title }: ReasonType) => (
  <div
    onClick={() => {
      CleverTap.pushEvents(CT_EVENTS.NETWORK.GROUP.JOINED_GROUP_REPORT_COMPLETE, { reason: name, groupName: title });
      onClickhandler(id, name, conversationid, reportedMemberId);
    }}
    className="inline-block border rounded-[20px] py-2 px-3 mr-2 mb-2 text-sm text=[#9b9b9b]"
  >
    {name}
  </div>
);

export default ReportConversationDialogBox;
