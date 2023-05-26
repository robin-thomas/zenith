import { useEffect, useState } from 'react';

import WorldMap from 'react-svg-worldmap';
import type { CountryContext } from 'react-svg-worldmap';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

import type { MapProps } from './Map.types';

const stylingFunction = ({ countryValue, color }: CountryContext) => {
  const result = { fillOpacity: 1 } as any;

  if (countryValue === undefined) {
    result.fill = 'rgba(0,0,0,0.1)';
    result.cursor = 'default';
  } else {
    result.fill = color;
    result.cursor = 'pointer';
  }

  return result;
};

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 'bold',
  },
  '&': {
    fontSize: '0.8rem',
    backgroundColor: 'rgba(129,104,235,0.8)',
    borderColor: 'white',
    color: 'white',
  },
}));

const Map: React.FC<MapProps> = ({ data }) => {
  const [tableData, setTableData] = useState<any[]>();

  useEffect(() => {
    if (data?.length > 0) {
      setTableData(data.sort((a, b) => b.value - a.value).slice(0, 5));
    } else {
      setTableData(undefined);
    }
  }, [data]);

  return (
    <Grid container>
      <Grid md={8}>
        <WorldMap
          size="lg"
          color="black"
          valuePrefix="(Ad Clicks): "
          strokeOpacity={0}
          styleFunction={stylingFunction}
          data={data}
        />
      </Grid>
      <Grid md={4}>
        {tableData && (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Top Countries</StyledTableCell>
                <StyledTableCell align="right">Ad Clicks</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.country}>
                  <StyledTableCell>{item.country?.toUpperCase()}</StyledTableCell>
                  <StyledTableCell align="right">{item.value}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Grid>
    </Grid>
  );
};

export default Map;
