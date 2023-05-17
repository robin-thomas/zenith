import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { items } from '@/constants/leftmenu';
import styles from './LeftMenu.module.css';
import Logo from '@/layouts/logo/Logo';
import { useAppContext } from '@/hooks/useAppContext';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });

const getCurrentMenu = () => {
  return items.find((item) => item.href === window.location.pathname)?.name ?? 'Analytics';
};

const LeftMenu: React.FC = () => {
  const { setWallet } = useAppContext();

  const [open, setOpen] = useState(false);
  const [selectedLeftMenu, setSelectedLeftMenu] = useState<string>();

  useEffect(() => {
    setSelectedLeftMenu(getCurrentMenu());
  }, []);

  const handleClose = () => setOpen(false);
  const onLogoutClick = () => setOpen(true);

  const onLogout = async () => {
    handleClose();
    window.sessionStorage.setItem('zenith.user.logout', 'true');
    setWallet(undefined);
  };

  return (
    <>
      <Logo />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Logout?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>No</Button>
          <Button onClick={onLogout}>Yes</Button>
        </DialogActions>
      </Dialog>
      <MenuList
        subheader={
          <ListSubheader component="div" className={styles.subheader}>
            Menu
          </ListSubheader>
        }
      >
        {items.map((item) => (
          <Tooltip key={item.name} title={item.description} arrow>
            <Link href={item.href}>
              <MenuItem
                sx={{ marginTop: 1, marginBottom: 1 }}
                selected={selectedLeftMenu === item.name}
                onClick={() => setSelectedLeftMenu(item.name)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText className={styles.itemname}>
                  <span className={poppins.className} style={{ fontSize: '0.8rem' }}>{item.name}</span>
                </ListItemText>
              </MenuItem>
            </Link>
          </Tooltip>
        ))}
        <Divider sx={{ marginTop: 2 }} />
      </MenuList>
      <div className={styles.appfooter}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
            <Avatar sx={{ width: 30, height: 30 }} />
          </Grid>
          <Grid>
            <Tooltip title="Logout" arrow placement="top">
              <IconButton onClick={onLogoutClick}>
                <LogoutRoundedIcon fontSize="small" style={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default LeftMenu;
