/* third lib*/
import React, { useCallback, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* MUI */
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

/* local components & methods */
import { THEME } from '@comp/theme';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';
import Text from '@basics/Text';

const UsecaseResournce = ({ resoureList }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: THEME.spacing.space40 }}>
        <div
          style={{
            color: THEME.colors.mainPurple,
            marginBottom: THEME.spacing.space20,
          }}
        >
          <Text type='title'>
            <Intl id='gcpResources' />
          </Text>
        </div>
        {resoureList && resoureList.length > 0 && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='resourceName'></Intl>
                      </Text>
                    </TableCell>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='resourceLabel' />
                      </Text>
                    </TableCell>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='accessTime' />
                      </Text>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resoureList.map((data, accessIndex) => (
                    <TableRow key={accessIndex}>
                      <TableCell align='center'>
                        <Text>{data.resource_name}</Text>
                      </TableCell>
                      <TableCell align='center'>
                        <Text>{data.resource_label}</Text>
                      </TableCell>
                      <TableCell align='center'>
                        <Text>{data.create_time}</Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={3}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UsecaseResournce;
