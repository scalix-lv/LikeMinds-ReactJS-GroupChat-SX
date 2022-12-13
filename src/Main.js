import { createTheme, Grid, ThemeProvider } from "@mui/material";
import React from "react";
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

function Main() {
  return (
    <ThemeProvider theme={newTheme}>
      <div className="h-full w-full">
        <div className="w-full fixed h-[65px] z-10">
          <Header />
        </div>

        <div className="w-full flex h-full customHeight">
          <div className="w-[140px] h-full mt-[65px] border-r-[1px] border-[#eeeeee]">
            <Sidenav />
          </div>
          <div className="mt-[65px] w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Main;
