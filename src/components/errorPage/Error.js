import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/settingsIcon.png";
import { mainPath } from "../../routes";
function Error() {
  return (
    <div className="bg-white flex justify-center items-center flex-col w-full">
      <img src={logo} alt="settings" className="w-[150px] h-[150px]" />
      <p className="text-lg font-bold">Sorry something went off at our end</p>
      <p>
        We are aware of it and are working on it, meanwhile you can go back or
        reload this page
      </p>
      <Link to={mainPath} className="mt-2">
        <Button variant="contained">GO BACK</Button>
      </Link>
    </div>
  );
}

export default Error;
