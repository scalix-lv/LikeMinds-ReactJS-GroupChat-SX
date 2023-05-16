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
    initiateSDK(false, "d3e22b1a-a749-4da3-8b19-a42a796cd5b1", "Sasuke")
      .then((res: any) => {
        setCommunity(res?.data?.community);
        setCurrentUser(res?.data?.user);
        sessionStorage.setItem("communityId", res?.data?.community?.id);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, []);
  useEffect(() => {
    if (currentUser?.memberState != undefined) {
      return;
    }
    myClient
      .getProfile({
        userId: currentUser?.id,
      })
      .then((res: any) => {
        let newUserObject = { ...currentUser };
        newUserObject.memberState = res.member.state;
        setCurrentUser(newUserObject);
      });
  }, [currentUser]);

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
