/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState } from "react";
import "./App.css";
import RouteProvider from "./modules/components/routes";
import { UserContext } from "./modules/contexts/userContext";
import { initiateSDK } from "./sdkFunctions";

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [community, setCommunity] = useState();
  useEffect(() => {
    initiateSDK(false, "53208f29-5d15-473e-ab70-5fd77605be0f", "Ankit Garg SDK")
      .then((res: any) => {
        setCommunity(res?.data?.community);
        setCurrentUser(res?.data?.user);
        sessionStorage.setItem("communityId", res?.data?.community?.id);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, []);
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
