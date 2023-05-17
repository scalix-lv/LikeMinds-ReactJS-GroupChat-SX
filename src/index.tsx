import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import LikeMinds from "likeminds-chat-beta";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
export const myClient = new LikeMinds({
  apiKey: process.env.REACT_APP_API_KEY!,
  // apiKey: "d4356d31-306e-406d-aa4a-cd49f1b88f19",
  xPlatformCode: process.env.REACT_APP_XPLATFORM_CODE,
  xVersionCode: process.env.REACT_APP_XVERSION_CODE,
});

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
