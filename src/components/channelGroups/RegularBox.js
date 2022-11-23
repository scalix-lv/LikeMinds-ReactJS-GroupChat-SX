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
    <div style={{
        padding: "24px 96px 12px 24px"
    }}>
        <DateSpecifier/>

       {
        msgBoxes.map((msg, msgIndex)=>{
            return <MessageBlock userId={msg.userId} key={msg.userId + msgIndex}/>
        })
       }
    </div>
  )
}   


function DateSpecifier(){
    return (
        <div>
            <div style={{
                border: "0.5px solid #EEEEEE",
                position: "relative",
                marginBottom: "12px"
            }}>
                <span style={{
                padding: "4px 12px",
                fontSize: "10px",
                fontWeight: "400",
                borderRadius: "35%",
                position: "absolute",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#FFFFFF",
                border: "1px solid #EEEEEE"
            }}>
                Yesterday
            </span>
            </div>
            
        </div>
    )
}

export default RegularBox