/* third lib */

/* MUI */
import { styled } from '@mui/material/styles';
import TableR from '@mui/material/Table';
import TableBodyR from '@mui/material/TableBody';
import TableCellR from '@mui/material/TableCell';
import TableContainerR from '@mui/material/TableContainer';
import TableHeadR from '@mui/material/TableHead';
import TableRowR from '@mui/material/TableRow';

/* local components and methods */
import { COLORS } from '../../theme';
export const Table = TableR;
export const TableBody = TableBodyR;
export const TableContainer = TableContainerR;
export const TableHead = TableHeadR;

export const TableRow = styled(TableRowR)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f7f7f7',
  },
}));

export const TableCell = styled(TableCellR)(({ theme }) => ({
  padding: '0.75rem',
  fontSize: '0.875rem',
  '&.MuiTableCell-head': {
    backgroundColor: COLORS.darkPurple,
    color: COLORS.white,
  },
}));
