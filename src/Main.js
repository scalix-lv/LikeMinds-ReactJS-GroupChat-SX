import { createTheme, Grid, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import Sidenav from "./components/sidenav/Sidenav";
const newTheme = createTheme({
  typography: {
    fontFamily: ["Lato"],
    body2: {
      fontSize: "12px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
export const GroupContext = React.createContext({
  activeGroup: {},
  setActiveGroup: () => {},
  refreshContextUi: () => {},
});
function Main() {
  const [activeGroup, setActiveGroup] = useState({});
  const [refreshState, setRefreshState] = useState(true);
  function refreshGroups() {
    console.log("hello refreshing the state");
    setRefreshState(!refreshState);
  }
  return (
    <GroupContext.Provider
      value={{
        activeGroup: activeGroup,
        setActiveGroup: setActiveGroup,
        refreshContextUi: refreshGroups,
      }}
    >
      <ThemeProvider theme={newTheme}>
        <div className="flex w-[100vw] fixed h-[65px] z-10">
          <Header />
        </div>

        <div className="flex flex-1 h-full customHeight mt-[65px]">
          <div className="flex-[.085] border-r-[1px] border-[#eeeeee]">
            <Sidenav />
          </div>
          <div className="flex-[.915]">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </GroupContext.Provider>
  );
}

export default Main;
