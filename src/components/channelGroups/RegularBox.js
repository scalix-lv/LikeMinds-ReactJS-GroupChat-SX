import React from 'react'
import MessageBlock from './MessageBlock'

function RegularBox() {
    const msgBoxes = [
        {
            userId: "NASH"
        },
        {
            userId: "DASH"
        },
        {
            userId: "BASH"
        },
        {
            userId: "SASH"
        }
    ]
    return (
        <div
        className='pt-6 pr-24 pb-3 pl-6'
        >
            <DateSpecifier />

            {
                msgBoxes.map((msg, msgIndex) => {
                    return <MessageBlock userId={msg.userId} key={msg.userId + msgIndex} />
                })
            }
        </div>
    )
}


function DateSpecifier() {
    return (

        <div className='border border-solid border-[#EEEEEE] relative mb-3'>
            <span className="border-[#EEEEEE] border-solid border py-1 px-3 text-[10px] font-normal rounded-[35%] absolute left-[50%] translate-y-[-50%] bg-white">
                Yesterday
            </span>
        </div>


    )
}

export default RegularBox