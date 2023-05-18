import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import type { CampaignGridProps } from './CampaignGrid.types';

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'url', headerName: 'URL', width: 150 },
  { field: 'budget', headerName: 'Budget', width: 100 },
  { field: 'remaining', headerName: 'Balance', width: 100 },
  { field: 'clicks', headerName: 'Clicks', width: 50 },
  { field: 'created', headerName: 'Created', width: 200 },
  { field: 'end', headerName: 'End', width: 200 },
];

const CampaignGrid: React.FC<CampaignGridProps> = ({ rows }) => (
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

export default CampaignGrid;
