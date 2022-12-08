import { Box } from '@mui/material'
import { styled } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { myClient } from '../..'
import { getConversationsForGroup } from '../../sdkFunctions'
import RegularBox from '../channelGroups/RegularBox'
import { GroupContext } from '../Groups/Groups'
import Input from '../InputComponent/Input'
import Tittle from './tittle/Tittle'


// Exported Styled Box
export const StyledBox = styled(Box)({
  backgroundColor: "#FFFBF2",
  minHeight: "100vh",
  borderTop: "1px solid #EEEEEE",
  display: "flex",
  flexDirection: "column",
  height: "100%"
})


export const ConversationContext = React.createContext({
  conversationsArray: [],
  setConversationArray: ()=>{}
})



function GroupChatArea() {
  const [conversationsArray, setConversationArray] = useState([])

  let groupContext = useContext(GroupContext)

  useEffect(() => {
    console.log(groupContext)
    const fn = async () => {
      try {
        const chatRoomResponse = await myClient.getChatroom()
        console.log(chatRoomResponse)
      } catch (error) {
        console.log(error)
      }
    }
    // fn()
  })

  useEffect(() => {
    const fn = async (chatroomId, pageNo) => {
      let optionObject = {
        chatroomID: chatroomId,
        page: pageNo
      }
      let response = await getConversationsForGroup(optionObject);
      console.log(response)
      if (!response.error) {
        let conversations = response.data;
        console.log(conversations)
        let conversationToBeSetArray = []
        let newConversationArray = []
        let lastDate = ""
        for (let convo of conversations) {
          if (convo.date == lastDate) {
            conversationToBeSetArray.push(convo)
            lastDate = convo.date
          } else {
            if (conversationToBeSetArray.length != 0) {
              newConversationArray.push(conversationToBeSetArray)
              conversationToBeSetArray = []
              conversationToBeSetArray.push(convo)
              lastDate = convo.date
            } else {
              conversationToBeSetArray.push(convo)
              lastDate = convo.date
            }
          }
        }
        newConversationArray.push(conversationToBeSetArray)
        console.log(newConversationArray)


        setConversationArray(newConversationArray)
      } else {
        console.log(response.errorMessage)
      }
      // console.log(response)
    }
    fn(groupContext.activeGroup.chatroom?.id, 100)
    console.log("hello")
  }, [groupContext.activeGroup])


  return (
    <ConversationContext.Provider value={{
      conversationsArray: conversationsArray,
      setConversationArray: setConversationArray
    }}>
    <StyledBox>
      {groupContext.activeGroup.chatroom?.id != undefined ?  (
      <>
        {conversationsArray.map((convoArr, index) => {
          return <RegularBox convoArray={convoArr} key={convoArr[0].date}/>
        })
      }
      <div style={{
        flexGrow: 0.4
      }} />

      <Input />
      </>):<>hi</>}
    </StyledBox>
    </ConversationContext.Provider>
  )
}

export default GroupChatArea