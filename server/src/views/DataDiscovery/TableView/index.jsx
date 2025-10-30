/* third lib*/
import React, { useState, useEffect, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* material-ui */
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/* local components & methods */
import Loading from '@assets/icons/Loading';
import styled from '@emotion/styled';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@comp/theme';
import Text from '@basics/Text';
import { getTableSchema } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';

const TableViewContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.white};
  padding: ${SPACING.space44};
  display: flex;
  flex-direction: column;
`;

const OnBack = styled.div`
  cursor: pointer;
  display: inline-block;
  display: flex;
  align-items: center;
  color: ${COLORS.mainPurple};
  margin: ${SPACING.space16} 0 ${SPACING.space20} ${SPACING.space12};
  svg {
    margin-right: ${SPACING.space12};
  }
`;

const PolicyTag = styled.div`
  padding: ${SPACING.space4} ${SPACING.space8};
  background-color: ${COLORS.mainPurple};
  color: ${COLORS.white};
  border-radius: 4px;
  margin: ${SPACING.space4};
  font-size: ${FONT_SIZES.fontSize6};
`;

const TableView = ({ tableId, onBack }) => {
  const [formLoading, setFormLoading] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filterTableList = useMemo(() => {
    if (!tableList) {
      return [];
    }
    let tmpList = tableList;
    return tmpList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [tableList, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (tableId) {
      setFormLoading(true);
      getTableSchema({ id: tableId })
        .then(res => {
          setTableList(res.schema.fields);
          setFormLoading(false);
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
        });
    }
  }, [tableId]);

  return (
    <TableViewContainer>
      <OnBack onClick={onBack}>
        <ArrowBackIcon />
        <Text type='subTitle'>
          <Intl id='back' />
        </Text>
      </OnBack>
      {formLoading && <Loading></Loading>}
      {!formLoading && tableList && (
        <>
          <TableContainer component={Paper}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='fieldName' />
                    </Text>
                  </TableCell>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='type' />
                    </Text>
                  </TableCell>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='mode' />
                    </Text>
                  </TableCell>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='policyTag' />
                    </Text>
                  </TableCell>
                  <TableCell align='center' width='25%'>
                    <Text type='subTitle'>
                      <Intl id='description' />
                    </Text>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterTableList.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell align='center'>{row.name}</TableCell>
                    <TableCell align='center'>{row.type}</TableCell>
                    <TableCell align='center'>{row.mode}</TableCell>
                    <TableCell align='center'>
                      {row.policyTags &&
                        row.policyTags.names.map((item, index) => {
                          return <PolicyTag key={index}>{item}</PolicyTag>;
                        })}
                    </TableCell>
                    <TableCell align='center'>{row.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={tableList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </TableViewContainer>
  );
};

export default TableView;
