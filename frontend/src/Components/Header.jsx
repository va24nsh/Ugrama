import React, {  useContext } from 'react';
import {  Bell } from 'lucide-react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import styled from '@emotion/styled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { MdAccountBalance } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { MyContext } from '../App';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Create a basic theme
const theme = createTheme();

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));


const Header = () => {
const context = useContext(MyContext);
const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const runTour = () => {
    const tour = driver({
      showProgress: true,
      steps: [
        {
          element: ".menu-btn",
          popover: { title: "Menu", description: "Toggle the sidebar menu here." },
        },
        {
          element: ".notification-btn",
          popover: { title: "Notifications", description: "Check all your alerts here." },
        },
        {
          element: ".profile-btn",
          popover: { title: "Profile", description: "Manage your account & settings here." },
        },
      ],
    });
    tour.drive();
  };
  return (
    <ThemeProvider theme={theme}>
      <div className={`w-full h-auto shadow-md ${context.isSidebarOpen ? 'pl-64' : 'pl-2'} transition-all duration-300 bg-white flex items-center justify-between px-2 fixed top-0 z-10`}>
        {/* Menu Button */}
        <div className="m-2 ">
        <Button onClick={() => context.setIsSidebarOpen(!context.isSidebarOpen)} >
          <IoMenu size={25} color='black' className='menu-btn'/>
        </Button>
        </div>
        <div className="m-2 ">
         <Button variant="outlined" size="small" onClick={runTour} className="m-2">
          Start Tour
        </Button>
        </div>

        
        {/* Notification Button */}
        <div className="mr-2 flex items-center gap-4">
        <IconButton aria-label="notifications">
          <StyledBadge badgeContent={4} color="secondary">
            <Bell size={20} className='notification-btn' />  
          </StyledBadge>
        </IconButton>
        <div>
            <img src="https://i.pravatar.cc/300" alt="Profile" className="w-8 h-8 rounded-full overflow-hidden cursor-pointer profile-btn" onClick={handleClick}/>
            <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem   onClick={handleClose}>
            <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/300" alt="Profile" className="w-8 h-8 rounded-full overflow-hidden cursor-pointer "/>
                <div>
                 <h3 className="text-xs font-bold leading-4">Kush </h3>
                 <p className='text-xs font-light opacity-80'>kush62831@gmail.com</p>
                </div>
            </div>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={handleClose} className='flex items-center text-[12px] gap-2'>
             <FaRegUser /><span className='mtext-[14px]'>Profile</span>
           </MenuItem>
           <MenuItem onClick={handleClose} className='flex items-center text-[12px] gap-2'>
             <MdAccountBalance /><span className='mtext-[14px]'>Account</span>
           </MenuItem>
           <MenuItem onClick={handleClose} className='flex items-center text-[12px] gap-2'>
             <IoLogOutOutline /><span className='mtext-[14px]'>Logout</span>
           </MenuItem>
      </Menu>
        </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Header;