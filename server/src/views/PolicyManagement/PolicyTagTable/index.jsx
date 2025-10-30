/* third lib*/
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/* material-ui */
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

/* local components & methods */
import { SPACING, COLORS } from '@comp/theme';
import HeadLine from '@basics/HeadLine';
import Text from '@basics/Text';
import Button from '@basics/Button';
import Loading from '@assets/icons/Loading';
import { getPolicys } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import { useGlobalContext } from 'src/context';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';
import { covertToCurrentTime } from 'src/utils/timeFormat';

// Styled components
const PolicyCreation = styled.div`
  width: 100%;
  height: 100%;
`;

const PolicyContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.white};
  padding: ${SPACING.space44};
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: ${COLORS.mainPurple};
  margin-bottom: ${SPACING.space44};
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${SPACING.space40};

  .filterSelect {
    width: 12rem;
  }
`;

const Operation = styled.div`
  cursor: pointer;
  margin-left: 1rem;
  align-items: center;

  svg {
    color: ${COLORS.textGrey};
    width: 1.5rem;
    height: 1.5rem;
    &:nth-child(1) {
      margin-right: ${SPACING.space8};
    }
    &:hover {
      color: ${COLORS.mainPurple};
    }
  }
`;

const PolicyTagTable = ({ setStep, setCurrentId }) => {
  const navigate = useNavigate();
  const { timeContext } = useGlobalContext();

  const [policyTagList, setPolicyTagList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formLoading, setFormLoading] = useState(true);

  const filterTableList = useMemo(() => {
    let tmpList = policyTagList;
    return tmpList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [policyTagList, page, rowsPerPage]);

  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getPolicys()
      .then(res => {
        setPolicyTagList(res.data);
        setFormLoading(false);
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, []);

  return (
    <div>
      <Title>
        <HeadLine>
          <Intl id='policyMan' />
        </HeadLine>
      </Title>
      <Filter>
        <Button
          filled
          onClick={() => {
            navigate(`/app/forms?id=3`);
          }}
        >
          <Intl id='addPolicy' />
        </Button>
      </Filter>
      {formLoading && <Loading></Loading>}
      {!formLoading && (
        <>
          <TableContainer component={Paper}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='policyId' />
                    </Text>
                  </TableCell>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='policyName' />
                    </Text>
                  </TableCell>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='description' />
                    </Text>
                  </TableCell>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='createtime' />
                    </Text>
                  </TableCell>
                  <TableCell align='center'>
                    <Text type='subTitle'>
                      <Intl id='operation' />
                    </Text>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterTableList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align='center'>{row.id}</TableCell>
                    <TableCell align='center'>
                      {row.taxonomy_display_name}
                    </TableCell>
                    <TableCell align='center'>{row.description}</TableCell>
                    <TableCell align='center'>
                      {covertTime(row.create_time)}
                    </TableCell>
                    <TableCell align='center'>
                      <Operation>
                        <EditIcon
                          onClick={() => {
                            setCurrentId(row.id);
                            setStep(1);
                          }}
                        />
                      </Operation>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={policyTagList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default PolicyTagTable;
