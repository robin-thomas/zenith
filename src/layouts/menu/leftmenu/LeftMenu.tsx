import { useState } from 'react';
import { Poppins, Montserrat_Alternates } from 'next/font/google';
import Link from 'next/link';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { items } from '@/constants/leftmenu';
import styles from './LeftMenu.module.css';
import { Divider } from '@mui/material';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });
const montserrat_alternates = Montserrat_Alternates({ weight: '700', subsets: ['latin'] });

const getCurrentMenu = () => {
  return items.find((item) => item.href === window.location.pathname)?.name ?? 'Analytics';
};

const LeftMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedLeftMenu, setSelectedLeftMenu] = useState(getCurrentMenu());

  const handleClose = () => setOpen(false);
  const onLogoutClick = () => setOpen(true);

  const onLogout = async () => {
    // TODO;

    handleClose();
  };

  return (
    <>
      <div className={styles.appname}>
        <span className={montserrat_alternates.className}>Zenith.</span>
      </div>
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
            <Avatar />
          </Grid>
          <Grid>
            <Tooltip title="Logout" arrow>
              <IconButton onClick={onLogoutClick}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default LeftMenu;
