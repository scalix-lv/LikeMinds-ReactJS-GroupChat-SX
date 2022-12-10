import Typicode from 'likeminds-apis-sdk';
import { json } from 'react-router-dom';
import { myClient } from '..';
// import('likeminds-apis-sdk/dist/chatroom/types').ConversationData as conversationData
export const jsonReturnHandler = (data, error) => {
    let returnObject = {
        error: false,
    }
    if (!Boolean(error)) {
        returnObject.data = data;
    } else {
        returnObject.error = true
        returnObject.errorMessage = error;
    }
    return returnObject;
}

export const createNewClient = (key) => {
    const client = new Typicode({
        apiKey: key
    })
    return client;
}

export const getChatRoomDetails = async (myClient: Typicode, chatRoomId) => {
    try {
        console.log(chatRoomId)

        const chatRoomResponse = await myClient.getChatroom(
            chatRoomId
        );
        // console.log(chatRoomResponse);
        return jsonReturnHandler(chatRoomResponse, null);
    } catch (error) {
        console.log(error)
        return jsonReturnHandler(null, error);
    }
}

export const getConversationsForGroup = async (optionObject) => {
    try {
        let conversationCall = await myClient.getConversations(optionObject)
        // console.log(conversationCall)
        return jsonReturnHandler(conversationCall.conversations, null)
    } catch (error) {

        return jsonReturnHandler(null, error)
    }
}

export function parseMessageString(message) {
    let newMessage = " " + message + " ";

}
export function getUsername(str) {
    let userMatchString = /(?<=<<)(@*).+(?=\|)/gs
    let userName = str.match(userMatchString)
    return userName
}
export function getUserLink(str) {
    let userMatchString = /(?<=\|).+(?=>>)/gs
    let userName = str.match(userMatchString)
    return userName
}
export function getString(str) {
    if (!Boolean(getUsername(str))) {
        let userMatchString = /.+/gs
        let userName = str.match(userMatchString)
        return userName
    } else {
        let userMatchString = /(?<=>>)(@*).+/gs
        let userName = str.match(userMatchString)
        return userName
    }
}

export async function createNewConversation(val, groupContext, options) {
    let {has_files, count } = options
    let configObject = {
        text: val.toString(),
        created_at: Date.now(),
        has_files: has_files,
        
        chatroom_id: groupContext.activeGroup.chatroom.id,
        
    }
    if(has_files){
        configObject['attachment_count'] = count
    }
    try {
        if (val.length != 0) {
            let createCall = await myClient.onConversationsCreate(configObject)
            return jsonReturnHandler(createCall, null)
        }
    } catch (error) {
        return jsonReturnHandler(null, error)
    }
}

export async function getReportingOptions(){
    try{
        let rep = await myClient.getReportTags()
        return jsonReturnHandler(rep, null)
    }catch(e){
        return jsonReturnHandler(null, e)
    }
}

// communityId = 50421

export async function addReaction(reaction, convoId, chatId){
    try {
        const reactionCall = await myClient.addAction({
            chatroom_id: chatId,
            conversation_id: convoId,
            reaction: reaction
        })
        return jsonReturnHandler(reactionCall, null)
    } catch (error) {
        return jsonReturnHandler(null, error)
    }
}

export async function pushReport(convoId, tagId, reason){
    try {
        const pushReportCall = await myClient.pushReport({
            conversation_id: convoId,
            tag_id: tagId,
            reason: reason
        })
        return jsonReturnHandler(pushReportCall, null)
    } catch (error) {
        return jsonReturnHandler(null, error)
    }
}

export async function initiateSDK(is_guest, user_unique_id, user_name){
    try {
        let initiateCall = await myClient.initSDK({
            is_guest, user_unique_id, user_name
        })
        return jsonReturnHandler(initiateCall, null)
    } catch (error) {
        return jsonReturnHandler(null, error)
    }
}






























let user = {
    "success": true,
    "user": {
        "id": 3555,
        "name": "Ankit Garg",
        "updated_at": 1660911399,
        "is_guest": false,
        "user_unique_id": "707a866a-2d28-4b8d-b34b-382ac76c8b85",
        "organisation_name": null,
        "image_url": ""
    },
    "community": {
        "id": 50421,
        "name": "Notification settings",
        "purpose": "We will send all the announcements here on this chatroom.",
        "image_url": "https://beta.likeminds.community/media/media/community/default.jpeg",
        "members_count": 16,
        "type": 1111,
        "sub_type": 1111,
        "is_paid": false,
        "auto_approval": true,
        "grace_period": 0,
        "is_discoverable": false,
        "referral_enabled": false,
        "updated_at": 1668600256,
        "fee_membership": 5,
        "fee_event": 5,
        "fee_payment_pages": 5,
        "branding": {
            "basic": {
                "primary_colour": "#007AFF"
            },
            "advanced": {
                "header_colour": "",
                "buttons_icons_colour": "",
                "text_links_colour": ""
            }
        },
        "is_whitelabel": false,
        "whitelabel_info": null,
        "hide_dm_tab": false,
        "is_freemium_community": false,
        "community_setting_rights": [
            {
                "id": 1,
                "title": "Create chat rooms",
                "state": 0,
                "is_selected": true,
                "is_locked": false
            },
            {
                "id": 2,
                "title": "Create polls",
                "state": 1,
                "is_selected": true,
                "is_locked": false
            },
            {
                "id": 3,
                "title": "Create events",
                "state": 2,
                "is_selected": true,
                "is_locked": false
            },
            {
                "id": 4,
                "title": "Respond in chat rooms",
                "state": 3,
                "is_selected": true,
                "is_locked": false
            },
            {
                "id": 6,
                "title": "Auto-approve created chat rooms",
                "sub_title": "If auto-approved, member's chat rooms will be posted instantly and would not need any approval.",
                "state": 5,
                "is_selected": true,
                "is_locked": false
            },
            {
                "id": 7,
                "title": "Create secret chat rooms",
                "state": 6,
                "is_selected": true,
                "is_locked": false
            },
            {
                "id": 8,
                "title": "Direct messages",
                "sub_title": "Direct messaging can happen only between a community manager and a community member (not among 2 members).",
                "state": 7,
                "is_selected": false,
                "is_locked": false
            }
        ]
    },
    "app_access": true
}