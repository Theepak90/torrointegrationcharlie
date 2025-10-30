/* third lib*/
import React, { useState, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import cn from 'classnames';
import ScrollBar from 'react-perfect-scrollbar';

/* MUI */
import Paper from '@mui/material/Paper';
import EmailIcon from '@mui/icons-material/Email';
import TablePagination from '@mui/material/TablePagination';
import MarkUnreadChatAltIcon from '@assets/icons/MarkUnreadChatAlt';

/* local components & methods */
import Text from '@basics/Text';
import { THEME } from '@comp/theme';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';

const NotifyTable = ({ notify, viewRequest, unRead, readAll }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filterTableList = useMemo(() => {
    if (!notify) {
      return [];
    }
    let tmpList = notify;
    return tmpList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [notify, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ScrollBar>
      <div style={{ width: '80rem', maxHeight: '50rem', overflow: 'hidden' }}>
        <div
          style={{
            marginBottom: THEME.spacing.space20,
            color: THEME.colors.mainPurple,
            display: 'flex',
          }}
        >
          <Text type='subTitle'>
            <Intl id='youGot' />{' '}
            <span
              style={{
                color: THEME.colors.mainRed,
                fontWeight: THEME.fontWeights.medium,
              }}
            >
              {unRead.length}
            </span>{' '}
            <Intl id='unread' />
          </Text>
          {unRead.length > 0 && (
            <div
              style={{
                marginLeft: THEME.spacing.space20,
                textDecoration: 'underline',
                color: THEME.colors.textGrey,
                cursor: 'pointer',
              }}
              onClick={readAll}
            >
              <Text type='subTitle'>
                <Intl id='readAll' />
              </Text>
            </div>
          )}
        </div>

        <TableContainer component={Paper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell width='10%' align='center'>
                  <Intl id='notifyID'></Intl>
                </TableCell>
                <TableCell width='20%' align='center'>
                  <Intl id='formName'></Intl>
                </TableCell>
                <TableCell width='40%' align='center'>
                  <Intl id='msg'></Intl>
                </TableCell>
                <TableCell width='20%' align='center'>
                  <Intl id='time'></Intl>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <Intl id='operation'></Intl>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterTableList.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    className={cn({
                      active: row.is_read === 0,
                    })}
                    style={
                      row.is_read === 0
                        ? {
                            fontWeight: THEME.fontWeights.medium,
                            color: THEME.colors.mainPurple,
                          }
                        : {}
                    }
                  >
                    <TableCell width='10%' align='center'>
                      {row.id}
                    </TableCell>
                    <TableCell width='20%' align='center'>
                      {row.title}
                    </TableCell>
                    <TableCell width='40%' align='center'>
                      {row.comment}
                    </TableCell>
                    <TableCell width='20%' align='center'>
                      {row.create_time}
                    </TableCell>
                    <TableCell width='10%' align='center'>
                      <div
                        onClick={() => {
                          viewRequest(row.input_form_id, row.id);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {row.is_read === 0 && <MarkUnreadChatAltIcon />}
                        {row.is_read === 1 && <EmailIcon />}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={notify.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </ScrollBar>
  );
};

export default NotifyTable;
