import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { linkCss, linkTextCss, navIconCss } from "../../styledAccessories/css";
import dm from "../../assets/dm.svg";
import events from "../../assets/events.svg";
import forum from "../../assets/forum.svg";
import abm from "../../assets/abm.svg";
import groups from "../../assets/groups.svg";
import { RouteContext } from "../../Main";
import { addedByMePath, directMessagePath, eventsPath, forumPath, groupPath } from "../../routes";
const NavContext = React.createContext({
  currentPath: null,
  setCurrentPath: () => {},
});
function Sidenav() {
  

  

  const navArray = [
    {
      title: "Forums",
      path: forumPath,
      Icon: forum,
    },
    {
      title: "Groups",
      path: groupPath,
      Icon: groups,
    },
    {
      title: "Events",
      path: eventsPath,
      Icon: events,
    },
    {
      title: "Direct Messages",
      path: directMessagePath,
      Icon: dm,
    },
    {
      title: "Added By Me",
      path: addedByMePath,
      Icon: abm,
    },
  ];

  return (
    <div>
      
      
        {navArray.map((block, blockIndex) => {
          return (
            <NavBlock
              key={block.title + blockIndex}
              title={block.title}
              path={block.path}
              Icon={block.Icon}
            />
          );
        })}
   
    </div>
  );
}

function NavBlock({ title, Icon, path }) {
  const useNavContext = useContext(RouteContext);
  function changeCurrentPath() {
    useNavContext.setCurrentRoute(path);
    
  }
  return (
    <Link to={path} style={{ ...linkCss }} onClick={changeCurrentPath}>
      <Box className="m-auto text-center p-3">
        <Box>
          {
            <img
              src={Icon}
              style={{
                ...navIconCss,
                color:
                  useNavContext.currentRoute === path ? "#FFFFFF" : "#3884F7",
                backgroundColor:
                  useNavContext.currentRoute === path ? "#3884F7" : " #D7E6FD",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              alt="h"
            />
          }
        </Box>
        <span
          sx={{
            ...linkTextCss,
            fontWeight: useNavContext.currentRoute === path ? 400 : 300,
          }}
          variant="p"
        >
          {title}
        </span>
      </Box>
    </Link>
  );
}

export default Sidenav;
