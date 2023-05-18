import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import PolicyIcon from '@mui/icons-material/Policy';

export const items = [
  {
    name: 'New Campaign',
    href: '/user/campaigns/new',
    icon: <AddIcon fontSize="small" />,
    description: 'Create a new campaign',
  },
  {
    name: 'Analytics',
    href: '/user/campaigns',
    icon: <SignalCellularAltOutlinedIcon fontSize="small" />,
    description: 'See analytics of your campaigns',
  },
  {
    name: 'Watch an Ad',
    href: '/user/ad',
    icon: <PolicyIcon fontSize="small" />,
    description: 'Get paid to watch an advertisement',
  },
  {
    name: 'Rewards',
    href: '/user/rewards',
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    description: 'See your rewards',
  },
];
