import { Poppins } from 'next/font/google';
import Link from 'next/link';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Tooltip from '@mui/material/Tooltip';

import styles from './LeftMenu.module.css';
import type { MenuProps } from './Menu.types';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });

const Menu: React.FC<MenuProps> = ({ title, items, selectedMenu, setSelectedMenu }) => (
  <MenuList
    subheader={
      <ListSubheader component="div" className={styles.subheader}>
        {title}
      </ListSubheader>
    }
  >
    {items.map((item) => (
      <Tooltip key={item.name} title={item.description} arrow>
        <Link href={item.href}>
          <MenuItem
            sx={{ mt: 1, mb: 1 }}
            selected={selectedMenu === item.name}
            onClick={() => setSelectedMenu(item.name)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText className={styles.itemname}>
              <span className={poppins.className} style={{ fontSize: '0.8rem' }}>{item.name}</span>
            </ListItemText>
          </MenuItem>
        </Link>
      </Tooltip>
    ))}
  </MenuList>
);

export default Menu;
