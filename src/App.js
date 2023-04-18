import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./Main";
import Groups from "./components/Groups/Groups";
import GroupInfo from "./components/groupChatArea/GroupInfo";
import GroupChatArea from "./components/groupChatArea/GroupChatArea";
import AcceptInvite from "./components/groupChatArea/AcceptInvite";
import PersonInfo from "./components/groupChatArea/PersonInfo";
import {
  addedByMePath,
  directMessageChatPath,
  directMessageInfoPath,
  directMessagePath,
  eventsPath,
  forumPath,
  groupAcceptInvitePath,
  groupInfoPath,
  groupMainPath,
  groupPath,
  groupPersonalInfoPath,
  mainPath,
} from "./routes";
import DirectMessagesMain from "./components/direct-messages/DirectMessagesMain";
import "./App.css";
import { useEffect, useState } from "react";
import { UserContext } from ".";
import { initiateSDK, log } from "./sdkFunctions";
import ChatArea from "./components/direct-messages/ChatArea";
import Error from "./components/errorPage/Error";

const router = createBrowserRouter([
  {
    path: mainPath,
    element: <Main />,
    children: [
      {
        path: forumPath,
        element: null,
      },
      {
        path: groupPath,
        element: <Groups />,
        children: [
          {
            path: groupMainPath + "/:status",
            element: <GroupChatArea />,
          },
          {
            path: groupInfoPath,
            element: <GroupInfo />,
          },
          {
            path: groupAcceptInvitePath,
            element: <AcceptInvite />,
          },
          {
            path: groupPersonalInfoPath,
            element: <PersonInfo />,
          },
        ],
      },
      {
        path: eventsPath,
        element: null,
      },
      {
        path: directMessagePath,
        element: <DirectMessagesMain />,
        children: [
          {
            path: directMessageChatPath + "/:status",
            element: <ChatArea />,
          },
          {
            path: directMessageInfoPath,
            element: <PersonInfo />,
          },
        ],
      },
      {
        path: addedByMePath,
        element: null,
      },
    ],
    errorElement: <Error />,
  },
]);

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [community, setCommunity] = useState({});
  useEffect(() => {
    // 2nd arg for userid
    initiateSDK(false, "", "")
      .then((res) => {
        setCommunity(res?.data?.community);
        setCurrentUser(res?.data?.user);
        sessionStorage.setItem("communityId", res?.data?.community?.id);
      })
      .catch((error) => {
        log("Error =>", error);
      });
  }, []);

  return (
    <div className="App h-[100vh] flex flex-1">
      <UserContext.Provider
        value={{
          currentUser: currentUser,
          setCurrentUser: setCurrentUser,
          community: community,
          setCommunity: setCommunity,
        }}
      >
        {Object.keys(currentUser)?.length > 0 ? (
          <>
            <RouterProvider router={router} />
          </>
        ) : null}
      </UserContext.Provider>
      {/* <Block/> */}
    </div>
  );
}

export default App;
