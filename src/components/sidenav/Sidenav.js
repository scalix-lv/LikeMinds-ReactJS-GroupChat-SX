import { Box } from '@mui/material'
import React, { useContext, useState } from 'react'
import SaveAsIcon from '@mui/icons-material/SaveAs';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import { linkCss, linkTextCss, navIconCss } from '../../styledAccessories/css';
import dm from "../../assets/dm.svg"
import events from "../../assets/events.svg"
import forum from "../../assets/forum.svg"
import abm from "../../assets/abm.svg"
import groups from "../../assets/groups.svg"
const NavContext = React.createContext({
  currentPath: null,
  setCurrentPath: () => { }
})
function Sidenav() {
  const [currentPath, setCurrentPath] = useState("forums")

  const navArray = [
    {
      title: "Forums",
      path: "forums",
      Icon: forum

    },  
    {
      title: "Groups",
      path: "groups",
      Icon: groups

    },
    {
      title: "Events",
      path: "events",
      Icon: events

    },
    {
      title: "Direct Messages",
      path: "direct-messages",
      Icon: dm

    },
    {
      title: "Added By Me",
      path: "added-by-me",
      Icon: abm

    }

  ]
  
  return (
    <div>
      <NavContext.Provider value={{
        currentPath: currentPath,
        setCurrentPath: setCurrentPath
      }}>
        {
          navArray.map((block, blockIndex)=>{
            return (
              <NavBlock key={block.title+blockIndex} title={block.title} path={block.path} Icon={block.Icon}/>
            )
          })
        }

      </NavContext.Provider>

    </div>
  )
}

function NavBlock({ title, Icon, path }) {
  const useNavContext = useContext(NavContext)
  function changeCurrentPath(){
    useNavContext.setCurrentPath(path)
  }
  return (
    <Link to={path} style={{...linkCss}} onClick={changeCurrentPath}>
      <Box
       className='m-auto text-center p-3'
      >
        <Box>
        {<img
          src={Icon}
          style={{
          ...navIconCss,
          color: useNavContext.currentPath === path ? "#FFFFFF" : "#3884F7",
          backgroundColor: useNavContext.currentPath === path ? "#3884F7": " #D7E6FD",
          marginLeft: 'auto',
          marginRight: 'auto'
        }}/>}
        
        </Box>
        <span sx={{
          ...linkTextCss,
          fontWeight: useNavContext.currentPath === path ? 400 : 300 
        }} variant='p'>
          {title}
        </span>
      </Box>
    </Link>
  )
}



export default Sidenav