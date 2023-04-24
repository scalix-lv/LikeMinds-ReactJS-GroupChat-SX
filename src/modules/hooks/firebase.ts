import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { myClient } from "../..";
import { onValue, ref } from "firebase/database";
import { log } from "../../sdkFunctions";

export function useFirebaseChatConversations(
  getChatroomConversations: any,
  setBufferMessage: any
) {
  const db = myClient.fbInstance();
  const { mode, id } = useParams();
  useEffect(() => {
    log("running on id : " + id + "on mode :" + mode);
    const query = ref(db, `/collabcards/${id}`);

    switch (mode) {
      case "groups": {
        log("running on here");
        return onValue(query, (snapshot) => {
          if (snapshot.exists()) {
            log(snapshot.val());
            getChatroomConversations(id, 100).then((res: any) => {
              setBufferMessage(null);
            });
          }
        });
      }
    }
  }, [id]);
}
