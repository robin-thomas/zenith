import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Tooltip from '@mui/material/Tooltip';

import ToggleCampaign from './ToggleCampaign';
import type { CampaignGridProps } from './CampaignGrid.types';
import { CURRENCY_SYMBOL } from '@/constants/app';

const renderLink = (params: any) => {
  if (params.value == null) {
    return '';
  }
  return (
    <Tooltip arrow title={params.value}>
      <a href={params.value} target="_blank">{params.value}</a>
    </Tooltip>
  );
};

const renderCurrency = (params: any) => {
  if (params.value === undefined || params.value == null) {
    return '';
  }
  return `${CURRENCY_SYMBOL} ${params.value}`;
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
        status="pause"
        campaignId={params.value.split('_')[1]}
        icon={<PauseIcon fontSize="inherit" color="error" />}
        toggleCampaignStatus={toggleCampaignStatus(params.value)}
      />
    ) : (
      <ToggleCampaign
        status="start"
        campaignId={params.value.split('_')[1]}
        icon={<PlayArrowIcon fontSize="inherit" color="success" />}
        toggleCampaignStatus={toggleCampaignStatus(params.value)}
      />
    );
  };

  const columns = [
    { field: 'status', headerName: '', width: 50, renderCell: renderStatusButtons },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'url', headerName: 'URL', width: 185, renderCell: renderLink },
    { field: 'budget', headerName: 'Budget', width: 100, renderCell: renderCurrency },
    { field: 'remaining', headerName: 'Balance', width: 100, renderCell: renderCurrency },
    { field: 'clicks', headerName: 'Clicks', width: 70 },
    { field: 'created', headerName: 'Created', width: 175 },
    { field: 'end', headerName: 'End', width: 175 },
  ];

  return (
    <Box sx={{ height: 265, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 3,
            },
          },
        }}
        pageSizeOptions={[3]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default CampaignGrid;
