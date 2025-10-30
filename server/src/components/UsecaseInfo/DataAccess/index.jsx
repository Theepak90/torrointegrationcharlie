/* third lib*/
import React, { useCallback, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* material-ui */
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
import ViewAccess from './ViewAccess';

const DataAccess = ({ dataAccessList }) => {
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
            <Intl id='dataAccess' />
          </Text>
        </div>
        {dataAccessList && dataAccessList.length > 0 && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='projectName'></Intl>
                      </Text>
                    </TableCell>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='dataSet' />
                      </Text>
                    </TableCell>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='tableName' />
                      </Text>
                    </TableCell>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='location' />
                      </Text>
                    </TableCell>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='applyTime' />
                      </Text>
                    </TableCell>
                    <TableCell align='center'>
                      <Text type='subTitle'>
                        <Intl id='fields' />
                      </Text>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataAccessList.map((data, accessIndex) => (
                    <TableRow key={accessIndex}>
                      <TableCell align='center'>
                        <Text>{data.project_id}</Text>
                      </TableCell>
                      <TableCell align='center'>
                        <Text>{data.dataset_id}</Text>
                      </TableCell>
                      <TableCell align='center'>
                        <Text>{data.table_id}</Text>
                      </TableCell>
                      <TableCell align='center'>
                        <Text>{data.location}</Text>
                      </TableCell>
                      <TableCell align='center'>
                        <Text>{data.create_time}</Text>
                      </TableCell>
                      <TableCell align='center'>
                        <div>
                          {/* <VisibilityIcon
                            onClick={() => {
                              handleViewClick(data.fields);
                            }}
                          /> */}
                          <ViewAccess
                            data={data.fields}
                            resourceDetail={data}
                          />
                        </div>
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

export default DataAccess;
