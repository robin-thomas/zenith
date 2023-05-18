import { useState, useEffect } from 'react';

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

const CampaignGrid: React.FC<CampaignGridProps> = ({ rows }) => {
  const [data, setData] = useState(rows);

  useEffect(() => setData(rows), [rows]);

  const toggleCampaignStatus = (status: string) => () => {
    const campaignId = status.split('_')[1];

    for (const row of data) {
      if (row.status === status) {
        row.status = `${status.startsWith('true') ? 'false' : 'true'}_${campaignId}`;
      }
    }

    setData([...data]);
  };

  const renderStatusButtons = (params: any) => {
    return params.value.startsWith('true') ? (
      <ToggleCampaign
        status="disable"
        campaignId={params.value.split('_')[1]}
        icon={<ClearRoundedIcon fontSize="inherit" color="error" />}
        toggleCampaignStatus={toggleCampaignStatus(params.value)}
      />
    ) : (
      <ToggleCampaign
        status="enable"
        campaignId={params.value.split('_')[1]}
        icon={<DoneIcon fontSize="inherit" color="success" />}
        toggleCampaignStatus={toggleCampaignStatus(params.value)}
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

  return (
    <Box sx={{ height: 250, width: '100%' }}>
      <DataGrid
        rows={data}
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
