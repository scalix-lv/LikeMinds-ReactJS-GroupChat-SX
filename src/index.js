import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LikeMinds from "likeminds-chat-beta";
import { log } from "./sdkFunctions";

export const myClient = new LikeMinds({
  apiKey: process.env.REACT_APP_API_KEY,
  xPlatformCode: process.env.REACT_APP_XPLATFORM_CODE,
  xVersionCode: process.env.REACT_APP_XVERSION_CODE,
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
