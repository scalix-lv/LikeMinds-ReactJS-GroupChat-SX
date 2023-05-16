import LikeMinds from 'likeminds-chat-beta'
import { myClient } from '..'
export const jsonReturnHandler = (data, error) => {
  const returnObject = {
    error: false
  }
  if (!error) {
    returnObject.data = data
  } else {
    returnObject.error = true
    returnObject.errorMessage = error
  }
  return returnObject
}

export const createNewClient = (key) => {
  const client = new LikeMinds({
    apiKey: key
  })
  return client
}

export const getChatRoomDetails = async (
  myClient,
  chatRoomId
) => {
  try {
    // // console.log(chatRoomId);
    const params = {
      chatroomId: chatRoomId,
      page: 1
    }
    const chatRoomResponse = await myClient.getChatroom(params)

    // // console.log(chatRoomResponse);
    return jsonReturnHandler(chatRoomResponse, null)
  } catch (error) {
    // // console.log(error);
    return jsonReturnHandler(null, error)
  }
}

export const getConversationsForGroup = async (optionObject) => {
  try {
    const conversationCall = await myClient.getConversation(optionObject)
    return jsonReturnHandler(conversationCall.conversations, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export function getUsername(str) {
  const userMatchString = /(?<=<<)(@*).+(?=\|)/gs
  const userName = str.match(userMatchString)
  return userName
}
export function getUserLink(str) {
  const userMatchString = /(?<=\|).+(?=>>)/gs
  const userName = str.match(userMatchString)
  return userName
}
export function getString(str) {
  if (!getUsername(str)) {
    const userMatchString = /.+/gs
    const userName = str.match(userMatchString)
    return userName
  } else {
    const userMatchString = /(?<=>>)(@*).+/gs
    const userName = str.match(userMatchString)
    return userName
  }
}

export async function createNewConversation(
  val,
  groupContext,
  options
) {
  const count = options.count
  const hasFiles = options.has_files
  const configObject = {
    text: val.toString(),
    created_at: Date.now(),
    has_files: hasFiles,

    chatroom_id: groupContext.activeGroup.chatroom.id
  }
  if (hasFiles) {
    configObject.attachment_count = count
  }
  try {
    if (val.length !== 0) {
      const createCall = await myClient.onConversationsCreate(configObject)
      return jsonReturnHandler(createCall, null)
    }
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function getReportingOptions() {
  try {
    const rep = await myClient.getReportTags({
      type: 0
    })
    return jsonReturnHandler(rep, null)
  } catch (e) {
    return jsonReturnHandler(null, e)
  }
}

export async function addReaction(reaction, convoId, chatId) {
  try {
    const reactionCall = await myClient.putReaction({
      chatroom_id: chatId,
      conversation_id: convoId,
      reaction
    })
    return jsonReturnHandler(reactionCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function pushReport(convoId, tagId, reason, reportedMemberId) {
  try {
    const pushReportCall = await myClient.pushReport({
      conversation_id: convoId,
      tag_id: tagId,
      reason,
      reported_Member_id: reportedMemberId
    })
    return jsonReturnHandler(pushReportCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function initiateSDK(isGuest, userUniqueId, username) {
  try {
    const initiateCall = await myClient.initiateUser({
      is_guest: isGuest,
      user_unique_id: userUniqueId,
      user_name: username
    })
    return jsonReturnHandler(initiateCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function getTaggingList(chatroomId) {
  try {
    const tagListCall = await myClient.getTaggingList({
      chatroomId: parseInt(chatroomId),

    })
    return jsonReturnHandler(tagListCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function getAllChatroomMember(
  chatroomId,
  communityId,
  list,
  setFunction,
  setTotalMembers
) {
  try {
    const pageNoToCall = list.length / 10 + 1
    const allMemberCall = await myClient.allMembers({
      chatroom_id: chatroomId,
      community_id: communityId,
      page: pageNoToCall
    })
    if (setTotalMembers) {
      if (allMemberCall.total_members) {
        setTotalMembers(allMemberCall.total_members)
      }
    }
    const shouldLoadMore = !(allMemberCall.members.length < 10)
    let newList = [...list]
    newList = [...list, ...allMemberCall.members]
    setFunction(newList)
    return shouldLoadMore
  } catch (error) {
    return false
  }
}

// const userContext = useContext(UserContext)
// import above 2 things
// userContext.

export function mergeInputFiles(inputContext) {
  const { mediaAttachments, documentAttachments, audioAttachments } =
    inputContext

  const newArr = [
    ...mediaAttachments,
    ...documentAttachments,
    ...audioAttachments
  ]
  return newArr
}

export function clearInputFiles(inputContext) {
  inputContext.setAudioFiles([])
  inputContext.setMediaFiles([])
  inputContext.setDocFiles([])
}

export async function getUnjoinedRooms(community_id, pageNo) {
  try {
    const unjoinedGroups = await myClient.fetchFeedData({
      community_id,
      order_type: 0,
      page: pageNo || 1
    })
    return jsonReturnHandler(unjoinedGroups, null)
  } catch (error) {
    // // console.log(error);
    return jsonReturnHandler(null, error)
  }
}

export async function joinNewGroup(collabId, userID, value) {
  try {
    const joinCall = await myClient.followCR({
      collabcard_id: collabId,
      member_id: userID,
      value
    })
    return jsonReturnHandler(joinCall, null)
  } catch (error) {
    // // console.log(error);
    return jsonReturnHandler(null, error)
  }
}

export async function leaveChatRoom(collabId, userId) {
  try {
    const leaveCall = await myClient.followChatroom({
      collabcard_id: collabId,
      member_id: userId,
      value: false
    })
    if (!leaveCall.success) {
      throw false
    }
    return jsonReturnHandler(leaveCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function leaveSecretChatroom(collabId, userId) {
  try {
    const leaveCall = await myClient.leaveSecretChatroom({
      chatroom_id: collabId,
      // member_id: userId
      is_secret: true

    })
    if (!leaveCall.success) {
      throw false
    }
    return jsonReturnHandler(leaveCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export function tagExtracter(str, userContext, state) {
  if (state === 1) {
    const splitArr = str.split(
      `<<${userContext.currentUser.name}|route://member/${userContext.currentUser.id}>>`
    )
    str = splitArr.join('')
  }

  let newContent = str
    .split('<<')
    .join(
      '<span hl="Sd" class="username" style="color: #3884F7; cursor:pointer;">'
    )
  newContent = newContent.split('|route').join('</span>|route')
  const a = newContent.split('|route')

  let na = []
  for (const ar of a) {
    const ta = ar.split('>>')
    if (ta.length > 1) {
      na.push(ta[1])
    } else {
      na.push(ta)
    }
  }
  na = na.join('')

  // add a new line

  na = na.split(' \n ').join('<br/>')
  na = na.split('http').join('^#$__##$@^')
  return na
}

export async function joinThisGroup() {
  try {
    // myClient.followCR;
  } catch (e) { }
}

export function linkConverter(sampleString) {
  const newStr = sampleString.split('^#$__')
  const newStringArr = []
  for (const str of newStr) {
    if (str.substring(0, 5) === '##$@^') {
      const subStringArr = str.split(' ')
      subStringArr[0] =
        '<a target="_blank" href="http' +
        subStringArr[0].substring(5) +
        '">' +
        'http' +
        subStringArr[0].substring(5) +
        '</a>'
      const s = subStringArr.join(' ')
      newStringArr.push(s)
    } else {
      newStringArr.push(str)
    }
  }
  return newStringArr.join('').trim()
}

function seviceWorker() {
  try {
    // let w = myClient.
    // myClient.
  } catch (error) { }
}

// for joining the group
export async function joinChatRoom(collabId, userId) {
  try {
    const joinCall = await myClient.followChatroom({
      collabcard_id: collabId,
      member_id: userId,
      value: true
    })
    // refreshContext();

    return jsonReturnHandler(joinCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function markRead(chatroomId) {
  try {
    const markCall = await myClient.markReadChatroom({
      chatroom_id: chatroomId
    })
    return jsonReturnHandler(markCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function getDmHomeFeed(communityId) {
  try {
    const dmFeedCall = await myClient.getDMFeed({
      community_id: communityId
    })
    return jsonReturnHandler(dmFeedCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function canDmHomeFeed(communityId) {
  try {
    const dmFeedCall = await myClient.canDMFeed({
      community_id: communityId
    })
    return jsonReturnHandler(dmFeedCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function dmChatFeed(communityId, pageNo) {
  try {
    const dmFeedCall = await myClient.fetchDMFeed({
      page: pageNo
    })
    return jsonReturnHandler(dmFeedCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function allChatroomMembersDm(communityId, page) {
  try {
    const feedCall = await myClient.dmAllMembers({
      community_id: communityId,
      page,
      member_state: 4
    })
    return jsonReturnHandler(feedCall, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function requestDM(memberId, communityId) {
  try {
    log(memberId)
    const call = await myClient.checkDMLimit({
      memberId: memberId
    })
    return jsonReturnHandler(call, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function canDirectMessage(chatroomId) {
  try {
    const call = await myClient.canDmFeed({
      community_id: sessionStorage.getItem('communityId'),
      req_from: chatroomId
    })
    return jsonReturnHandler(call, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function createDM(memberId) {
  try {
    const call = await myClient.createDMChatroom({
      member_id: memberId
    })
    return jsonReturnHandler(call, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function sendDmRequest(chatroomId, messageText, state) {
  try {
    let call = await myClient.sendDMRequest({
      chat_request_state: state,
      chatroom_id: chatroomId,
      text: messageText
    })
    return jsonReturnHandler(call, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export async function dmAction(requestState, chatroomId, text) {
  try {
    const config = {
      chatroom_id: chatroomId,
      chat_request_state: requestState
    }
    if (text != null) {
      config.text = text
    }
    const call = await myClient.requestDmAction(config)
    return jsonReturnHandler(call, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}

export function getFromSessionStorage(key) {
  const sessionStorageObject = sessionStorage.getItem(key)
  return sessionStorageObject
}

export async function undoBlock(chatroomId) {
  try {
    // let call = await myClient.
    // let call = await m
    const call = await myClient.blockCR({
      chatroom_id: chatroomId,
      status: 1
    })
  } catch (error) {
    // // console.log(error);
  }
}

export async function deleteChatFromDM(idArr) {
  try {
    const call = await myClient.deleteConversation({
      conversation_ids: idArr,
      reason: 'none'
    })
    return true
  } catch (error) {
    // // console.log(error);
    return error
  }
}

export function getDmMember(str, currentUser) {
  const userString = str
  const currentLength = currentUser.length
  if (userString.substring(0, currentLength) === currentUser) {
    return userString.substr(currentLength + 1)
  } else {
    return userString.substring(0, userString.length - currentLength)
  }
}

export function log(str) {
  if (process.env.NODE_ENV === 'development') {
    console.log(str)
  }
}

export async function checkDMStatus(id) {
  try {
    let call = await myClient.checkDMStatus({
      requestFrom: "group_channel"
    })
    return jsonReturnHandler(call.data, null)
  } catch (error) {
    return jsonReturnHandler(null, error)
  }
}
