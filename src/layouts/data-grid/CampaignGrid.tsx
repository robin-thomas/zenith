import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import DoneIcon from '@mui/icons-material/Done';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import ToggleCampaign from './ToggleCampaign';
import type { CampaignGridProps } from './CampaignGrid.types';
import styles from './CampaignGrid.module.css';

const renderLink = (params: any) => {
  if (params.value == null) {
    return '';
  }
  return <a href={params.value} target="_blank" className={styles.gridlink}>{params.value}</a>;
};

const renderStatusButtons = (params: any) => {
  return params.value.startsWith('true') ? (
    <ToggleCampaign
      status="disable"
      campaignId={params.value.split('_')[1]}
      icon={<ClearRoundedIcon fontSize="inherit" color="error" />}
    />
  ) : (
    <ToggleCampaign
      status="enable"
      campaignId={params.value.split('_')[1]}
      icon={<DoneIcon fontSize="inherit" color="success" />}
    />
  );
};

const columns = [
  { field: 'status', headerName: '', width: 50, renderCell: renderStatusButtons },
  { field: 'name', headerName: 'Name', width: 175 },
  { field: 'url', headerName: 'URL', width: 160, renderCell: renderLink },
  { field: 'budget', headerName: 'Budget', width: 100 },
  { field: 'remaining', headerName: 'Balance', width: 100 },
  { field: 'clicks', headerName: 'Clicks', width: 70 },
  { field: 'created', headerName: 'Created', width: 175 },
  { field: 'end', headerName: 'End', width: 175 },
];

const CampaignGrid: React.FC<CampaignGridProps> = ({ rows }) => {

  return (
    <Box sx={{ height: 250, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 1,
            },
          },
        }}
        pageSizeOptions={[1]}
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default CampaignGrid;
