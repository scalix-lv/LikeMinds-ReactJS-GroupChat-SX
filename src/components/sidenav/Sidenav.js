import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import SaveAsIcon from '@mui/icons-material/SaveAs';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import StarIcon from '@mui/icons-material/Star';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { linkCss, linkTextCss, navIconCss } from '../../styledAccessories/css';
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
      Icon: SaveAsIcon

    },
    {
      title: "Groups",
      path: "groups",
      Icon: GroupsIcon

    },
    {
      title: "Events",
      path: "events",
      Icon: CalendarMonthIcon

    },
    {
      title: "Direct Messages",
      path: "direct-messages",
      Icon: ChatIcon

    },
    {
      title: "Added By Me",
      path: "added-by-me",
      Icon: StarIcon

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
      <Box sx={{
        margin: 'auto',
        textAlign: 'center',
        // border: "1px solid black",
        padding: "12px",
       

      }}>
        {/* <Icon /> */}
        <Box>
        {<Icon sx={{
          ...navIconCss,
          color: useNavContext.currentPath === path ? "#FFFFFF" : "#3884F7",
          backgroundColor: useNavContext.currentPath === path ? "#3884F7": " #D7E6FD"
        }}/>}
        </Box>
        <Typography sx={{
          ...linkTextCss,
          fontWeight: useNavContext.currentPath === path ? 800 : 300 
        }} variant='p'>
          {title}
        </Typography>
      </Box>
    </Link>
  )
}



export default Sidenav