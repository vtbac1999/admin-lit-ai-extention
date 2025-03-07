import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Modal } from 'antd';
import IconifyIcon from 'components/base/IconifyIcon';
import ProfileCard from 'pages/profile/profile';
import { useState } from 'react';

interface MenuItems {
  id: number;
  title: string;
  icon: string;
}
let user = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  avatar: '',
  gender: '',
};
try {
  const userData = localStorage.getItem('user');
  user = userData ? JSON.parse(userData) : user;
} catch (error) {
  console.error('Failed to parse user data from localStorage:', error);
}

const menuItems: MenuItems[] = [
  {
    id: 1,
    title: 'View Profile',
    icon: 'material-symbols:account-circle-outline',
  },
  {
    id: 2,
    title: 'Account Settings',
    icon: 'material-symbols:settings-account-box-outline-rounded',
  },
  {
    id: 3,
    title: 'Notifications',
    icon: 'ic:outline-notifications-none',
  },
  {
    id: 4,
    title: 'Switch Account',
    icon: 'material-symbols:switch-account-outline',
  },
  {
    id: 5,
    title: 'Help Center',
    icon: 'material-symbols:help-outline',
  },
  {
    id: 6,
    title: 'Logout',
    icon: 'material-symbols:logout',
  },
];

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleMenuItemClick = (id: number) => () => {
    switch (id) {
      case 1:
        console.log('View Profile');
        setIsModalOpen(true);
        handleProfileMenuClose();
        break;
      case 2:
        console.log('Account Settings');
        break;
      case 3:
        console.log('Notifications');
        break;
      case 4:
        console.log('Switch Account');
        break;
      case 5:
        console.log('Help Center');
        break;
      case 6:
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/authentication/sign-in';
        break;
      default:
        break;
    }
  };
  return (
    <>
      <ButtonBase
        onClick={handleProfileClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        disableRipple
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 44,
            width: 44,
            bgcolor: 'primary.main',
          }}
        />
      </ButtonBase>
      <Modal title="User Profile" open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        <ProfileCard user={user} />
      </Modal>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
            width: 230,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem onClick={handleProfileMenuClose} sx={{ '&:hover': { bgcolor: 'info.dark' } }}>
            <Avatar src={user.avatar} sx={{ mr: 1, height: 42, width: 42 }} />
            <Stack direction="column">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400}>
                {user.email}
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              onClick={handleMenuItemClick(item.id)} // Truyền hàm xử lý sự kiện khi click
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {item.title}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
