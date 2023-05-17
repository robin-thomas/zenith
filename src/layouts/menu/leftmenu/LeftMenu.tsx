import { useState } from 'react';
import { Poppins, Montserrat_Alternates } from 'next/font/google';
import Link from 'next/link';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';

import { items } from '@/constants/leftmenu';
import styles from './LeftMenu.module.css';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });
const montserrat_alternates = Montserrat_Alternates({ weight: '700', subsets: ['latin'] });

const LeftMenu: React.FC = () => {
  const [selectedLeftMenu, setSelectedLeftMenu] = useState('Analytics');

  return (
    <>
      <div className={styles.appname}>
        <span className={montserrat_alternates.className}>Zenith.</span>
      </div>
      <MenuList
        subheader={
          <ListSubheader component="div" className={styles.subheader}>
            Menu
          </ListSubheader>
        }
      >
        {items.map((item) => (
          <Link key={item.name} href={item.href}>
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
        ))}
      </MenuList>
      <div className={styles.appfooter}>
      </div>
    </>
  );
};

export default LeftMenu;
