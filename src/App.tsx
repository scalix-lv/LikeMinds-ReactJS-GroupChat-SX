/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState } from "react";
import "./App.css";
import RouteProvider from "./modules/components/routes";
import { UserContext } from "./modules/contexts/userContext";
import { initiateSDK, log } from "./sdkFunctions";
import { myClient } from ".";

function App() {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [community, setCommunity] = useState();
  useEffect(() => {
    initiateSDK(false, "be4aafd2-15e8-430d-a7c3-a52d075cd0f8", "")
      .then((res: any) => {
        setCommunity(res?.data?.community);
        setCurrentUser(res?.data?.user);
        sessionStorage.setItem("communityId", res?.data?.community?.id);
      })
      .catch((error) => {
        log(error);
      });
  }, []);
  useEffect(() => {
    if (currentUser?.memberState !== undefined) {
      return;
    }
    if (currentUser?.id === undefined) {
      return;
    }
    myClient
      .getMemberState({
        memberId: currentUser?.id,
      })
      .then((res: any) => {
        let newUserObject = { ...currentUser };
        newUserObject.memberState = res?.member?.state;
        newUserObject.memberRights = res?.member_rights;
        setCurrentUser(newUserObject);
      });
  }, [currentUser]);

  if (currentUser?.id === undefined || currentUser.memberState === undefined) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        community,
        setCommunity,
      }}
    >
      <RouteProvider />
    </UserContext.Provider>
  );
}

export default App;
