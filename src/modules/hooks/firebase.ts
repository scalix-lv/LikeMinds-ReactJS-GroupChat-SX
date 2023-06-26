import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { myClient } from "../..";
import routeVariable from "../../enums/routeVariables";

export function useFirebaseChatConversations(
  getChatroomConversations: any,
  setBufferMessage: any
) {
  const db = myClient.fbInstance();
  const params = useParams();
  const id: any = params[routeVariable.id];
  useEffect(() => {
    const query = ref(db, `collabcards`);
    return onValue(query, (snapshot: any) => {
      if (snapshot.exists()) {
        if (localStorage.getItem("searchConversationId") !== null) {
          return;
        }
        getChatroomConversations(id, 100).then(() => {
          setBufferMessage(null);
        });
      }
    });
  }, [id]);
}
