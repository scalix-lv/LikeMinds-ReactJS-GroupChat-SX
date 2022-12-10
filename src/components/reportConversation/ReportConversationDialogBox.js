import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { myClient } from '../..';
import { getReportingOptions } from '../../sdkFunctions';

// myClient.onUploadFile
function ReportConversationDialogBox({convoId, shouldShow, onClick}) {
  const [reasonArr, setReasonArr] = useState([])
  useEffect(()=>{
    getReportingOptions().then(r=>setReasonArr(r.data.report_tags)).catch(e=>console.log(e))
  })
  return (
    <div
    className='bg-white'
    >
      <div className='flex items-center justify-center '>
        <div className='p-3 '>
          <div className='flex justify-between mb-2'>
            <span className='text-base font-bold'>
              Report Message
            </span>
            <IconButton>
              <CloseIcon/>
            </IconButton>
          </div>
          <p className='text-sm font-bold mb-2'>
          Please specify the problem to continue
          </p>
          <p className='text-sm font-normal text-[#666666]'>
          You would be able to report this message after selecting a problem.
          </p>
          <div>
          {
            reasonArr.map((item, index)=>{
              return (
                <ReportedReasonBlock id={item.id} name={item.name} conversationid={convoId} onClickhandler={onClick}/>
              )
            })
          }
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportedReasonBlock({id, name, onClickhandler, conversationid}){
  return (
    <div onClick={()=>[
      onClickhandler(id, name, conversationid)
    ]} 
    className='inline-block border rounded-[15px] px-4 py-2'>
      <span className='text-sm text=[#9b9b9b]'>
        {name}
      </span>
    </div> 
  )
}

export default ReportConversationDialogBox