import Typicode from 'likeminds-apis-sdk';
export const jsonReturnHandler = (data, error) => {
    let returnObject = {
        error: false,
    }
    if(!Boolean(error)){
        returnObject.data = data;
    }else{
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

export const getChatRoomDetails = async (myClient) => {
    try {
        const chatRoomResponse = await myClient.getChatroom();
        console.log(chatRoomResponse);
        return jsonReturnHandler(chatRoomResponse, null);
    } catch (error) {
        return jsonReturnHandler(null, error);
    }
}

// communityId = 50421
