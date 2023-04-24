import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { myClient } from "../..";
import { onValue, ref } from "firebase/database";

export function useFirebaseChatConversations(
  getChatroomConversations: any,
  setBufferMessage: any
) {
  const db = myClient.fbInstance();
  const { mode, id } = useParams();
  useEffect(() => {
    const query = ref(db, `/collabcards/${id}`);
    switch (mode) {
      case "groups": {
        return onValue(query, (snapshot) => {
          if (snapshot.exists()) {
            getChatroomConversations(id, 100).then((res: any) => {
              setBufferMessage(null);
            });
          }
        });
      }
    }
  }, [id]);
}
