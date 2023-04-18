import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LikeMinds from "likeminds-chat-beta";
import { log } from "./sdkFunctions";

export const myClient = new LikeMinds({
  apiKey: "45c469dc-06e1-4f05-914e-dd02419eb53f",
  xPlatformCode: process.env.REACT_APP_XPLATFORM_CODE,
  xVersionCode: process.env.REACT_APP_XVERSION_CODE,
  baseUrl: "https://betaauth.likeminds.community",
  baseUrlCaravan: "https://beta.likeminds.community",
});
log(myClient);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();

export const UserContext = React.createContext({
  currentUser: null,
  setCurrentUser: () => {},
  community: {},
  setCommunity: () => {},
});
