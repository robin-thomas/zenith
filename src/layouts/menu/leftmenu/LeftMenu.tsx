import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { advertiserItems, publisherItems } from '@/constants/leftmenu';
import styles from './LeftMenu.module.css';
import { Logo } from '@/layouts/typography';
import { useAppContext } from '@/hooks/useAppContext';
import Menu from './Menu';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });

const getCurrentMenu = () => {
  return [...advertiserItems, ...publisherItems]
    .find((item) => item.href === window.location.pathname)?.name ?? 'Analytics';
};

const getAddress = (wallet: any, trim = false) => {
  const address = wallet?.accounts?.[0];
  if (trim) {
    return `${address?.substr(0, 10)}...${address?.substr(-10)}`;
  }

  return address;
};

const LeftMenu: React.FC = () => {
  const { wallet, setWallet } = useAppContext();

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
    <div className={styles.container}>
      <Logo disableLink />
      <Dialog open={open} onClose={handleClose}>
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
      <Menu
        title="Advertiser"
        items={advertiserItems}
        selectedMenu={selectedLeftMenu}
        setSelectedMenu={setSelectedLeftMenu}
      />
      <Menu
        title="Publisher"
        items={publisherItems}
        selectedMenu={selectedLeftMenu}
        setSelectedMenu={setSelectedLeftMenu}
      />
      <MenuList>
        <Divider sx={{ mt: -1, mb: 2 }} />
        <MenuItem onClick={onLogoutClick}>
          <ListItemIcon><LogoutRoundedIcon /></ListItemIcon>
          <ListItemText className={styles.itemname}>
            <span className={poppins.className} style={{ fontSize: '0.8rem' }}>Logout</span>
          </ListItemText>
        </MenuItem>
      </MenuList>
      <div className={styles.appfooter}>
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid>
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'black' }} />
          </Grid>
          <Grid>
            <Tooltip title={getAddress(wallet)} arrow placement="top">
              <div className={styles.address}>
                <span>{getAddress(wallet, true)}</span>
              </div>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default LeftMenu;
