// third lib
import React, { useState, useEffect, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import Scrollbar from 'react-perfect-scrollbar';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

/* material-ui */
import VisibilityIcon from '@mui/icons-material/Visibility';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';

/* local components & methods */
import Text from '@basics/Text';
import styled from '@emotion/styled';
import { COLORS, SPACING, SHADOWS } from '@comp/theme';
import Loading from '@assets/icons/Loading';
import Search from '@basics/Search';
import Filter from '@comp/FilterPanel';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';
import { getRequestData, getFilterOptions } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import { useCallback } from 'react';
import Button from '@basics/Button';
import { useGlobalContext } from 'src/context';
import { covertToCurrentTime } from 'src/utils/timeFormat';
import Pending from 'src/assets/icons/Pending';
import Complete from 'src/assets/icons/Complete';
import Reject from 'src/assets/icons/Reject';
import Close from 'src/assets/icons/Close';

const RecordTableContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StatusTab = styled.div`
  display: flex;
  padding: 0 ${SPACING.space20};
  margin-top: ${SPACING.space20};
`;

const StatusTabItem = styled.div`
  color: ${COLORS.mainPurple};
  margin-right: ${SPACING.space20};
  background-color: ${COLORS.white};
  border: 1px solid ${COLORS.mainPurple};
  display: flex;
  align-items: center;
  padding: ${SPACING.space12} ${SPACING.space16};
  border-radius: ${SPACING.space8};
  cursor: pointer;

  svg {
    margin-right: ${SPACING.space12};
  }

  &:hover:not(.disbaled),
  &.active {
    color: ${COLORS.white};
    background-color: ${COLORS.darkPurple};
    border-color: ${COLORS.darkPurple};
  }

  &.reject {
    color: ${COLORS.darkRed};
    border-color: ${COLORS.darkRed};

    &:hover:not(.disbaled),
    &.active {
      color: ${COLORS.white};
      background-color: ${COLORS.darkRed};
      border-color: ${COLORS.darkRed};
    }
  }

  &.approved {
    color: ${COLORS.darkGreen};
    border-color: ${COLORS.darkGreen};

    &:hover:not(.disbaled),
    &.active {
      color: ${COLORS.white};
      background-color: ${COLORS.darkGreen};
      border-color: ${COLORS.darkGreen};
    }
  }

  &.close {
    color: ${COLORS.color12};
    border-color: ${COLORS.color12};

    &:hover:not(.disbaled),
    &.active {
      color: ${COLORS.white};
      background-color: ${COLORS.color12};
      border-color: ${COLORS.color12};
    }
  }
`;

const TableData = styled.div`
  height: calc(100% - 4.8rem);
`;

const ToolBar = styled.div`
  background-color: ${COLORS.white};
  border-radius: 4px;
  margin-bottom: ${SPACING.space20};
  display: flex;
  justify-content: space-between;
`;

const FilterBox = styled.div`
  display: flex;
  align-items: center;
`;

const FilterItem = styled.div`
  margin-right: ${SPACING.space20};
  display: flex;
  align-items: center;
  svg {
    color: ${COLORS.color12};
    margin-right: ${SPACING.space8};
  }
`;

const StyledTable = styled.div`
  &.table1 thead th {
    background-color: ${COLORS.darkRed};
  }

  &.table2 thead th {
    background-color: ${COLORS.darkGreen};
  }

  &.table3 thead th {
    background-color: ${COLORS.color12};
  }
`;

const SelectAll = styled.div`
  svg {
    color: ${COLORS.white};
  }
`;

const CheckboxCell = styled.div`
  padding: 0 !important;
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

const TableContent = styled.div`
  padding: ${SPACING.space20};
  position: relative;
  min-height: 100%;
`;

const ButtonWrapper = styled.div`
  margin: ${SPACING.space16};
  width: 100%;
  height: 5rem;

  .buttonGroup {
    position: absolute;
    bottom: ${SPACING.space16};
    right: ${SPACING.space16};
  }

  button {
    margin-right: ${SPACING.space20};
  }
  button:last-child(1) {
    margin-right: 0;
  }
`;

const tabList = [
  {
    label: 'Pending Requests',
    value: [[0, '=']],
    style: 'pending',
    icon: <Pending />,
  },
  {
    label: 'Rejected Requests',
    value: [[1, '=']],
    style: 'reject',
    icon: <Reject />,
  },
  {
    label: 'Approved Requests',
    value: [[3, '='], [4, '='], 'OR'],
    style: 'approved',
    icon: <Complete />,
  },
  {
    label: 'Closed Requests',
    value: [[2, '='], [5, '='], [6, '='], 'OR'],
    style: 'close',
    icon: <Close />,
  },
];

const RecordTable = ({ approved }) => {
  const { authContext, formListContext, timeContext } = useGlobalContext();
  const navigate = useNavigate();

  const [formLoading, setFormLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [status, setStatus] = useState([[0, '=']]);
  const [tabIndex, setTabIndex] = useState(0);
  const [ticketId, setTicketId] = useState();
  const [filterOptions, setFilterOption] = useState({
    requestor: [],
    form: [],
  });
  const [selectedList, setSelectedList] = useState([]);
  const [condition, setCondition] = useState({});

  const formList = useMemo(() => {
    return formListContext.list;
  }, [formListContext]);

  const formIdMap = useMemo(() => {
    let map = {};
    formList.forEach(item => {
      map[item.id] = item.title;
    });
    return map;
  }, [formList]);

  const filterTableList = useMemo(() => {
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

  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );

  const filterRecord = useCallback(
    (data, sta) => {
      setFormLoading(true);
      let postData = {};
      if (approved) {
        postData.approverView = true;
      }

      // filterCondition
      let con = data ? data : condition;
      if (con.form_id) postData.form_id = [[con.form_id, '=']];
      if (con.creator_id) postData.creator_id = [[con.creator_id, '=']];
      if (con.from || con.to) {
        postData.create_time = [];
        if (con.from) {
          postData.create_time.push([con.from, '>']);
        }
        if (con.to) {
          postData.create_time.push([con.to, '<']);
        }
        if (con.from && con.to) {
          postData.create_time.push('AND');
        }
      }

      // filter by status
      let currentStatus = sta ? sta : status;
      postData.form_status = currentStatus;

      // filter by ticket Id
      if (ticketId) {
        postData.id = [[ticketId, '=']];
      }

      getRequestData(postData)
        .then(res => {
          setTableList(res.data);
          setFormLoading(false);
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
        });
    },
    [condition, approved, status, ticketId]
  );

  const tabClickHandle = useCallback(
    (value, index) => {
      setStatus(value);
      setTabIndex(index);
      setTicketId('');
      setCondition({});
      filterRecord({}, value);
    },
    [filterRecord]
  );

  const handleApply = useCallback(
    data => {
      setCondition(data);
      filterRecord(data);
    },
    [filterRecord]
  );

  const handleReset = useCallback(() => {
    setCondition({});
    filterRecord({});
  }, [filterRecord]);

  const handleSearch = useCallback(() => {
    filterRecord();
  }, [filterRecord]);

  const isSelectedAll = useMemo(() => {
    if (!selectedList || !tableList) {
      return false;
    }
    return selectedList.length > 0 && selectedList.length === tableList.length;
  }, [selectedList, tableList]);

  const onSelectAllClick = useCallback(() => {
    if (isSelectedAll) {
      setSelectedList([]);
    } else {
      let tmp = tableList.map((item, index) => {
        return index;
      });
      setSelectedList(tmp);
    }
  }, [tableList, isSelectedAll]);

  const isSelected = useCallback(
    index => {
      let calcIndex = page * rowsPerPage + index;
      return selectedList.includes(calcIndex);
    },
    [selectedList, page, rowsPerPage]
  );

  const onSelect = useCallback(
    index => {
      let calcIndex = page * rowsPerPage + index;
      if (!selectedList.includes(calcIndex)) {
        let tmp = [...selectedList, calcIndex];
        setSelectedList(tmp);
      } else {
        let currentIndex = selectedList.indexOf(calcIndex);
        let tmp = [...selectedList];
        tmp.splice(currentIndex, 1);
        setSelectedList(tmp);
      }
    },
    [selectedList, page, rowsPerPage]
  );

  useEffect(() => {
    let postData = {
      form_status: [[0, '=']],
    };
    if (approved) {
      postData.approverView = true;
    }
    setFormLoading(true);
    Promise.all([getFilterOptions(), getRequestData(postData)])
      .then(res => {
        let res1 = res[0];
        let res2 = res[1];
        if (res1.data && res2.data) {
          setFilterOption(res1.data.data);
          setTableList(res2.data);
          setFormLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [approved, authContext.userId]);

  return (
    <RecordTableContainer>
      <StatusTab>
        {tabList.map((item, index) => {
          return (
            <StatusTabItem
              key={item.label}
              onClick={() => {
                tabClickHandle(item.value, index);
                setPage(0);
                setSelectedList([]);
              }}
              className={cn({
                active: index === tabIndex,
                [item.style]: true,
              })}
              size='small'
            >
              {item.icon}
              <Text>{item.label}</Text>
            </StatusTabItem>
          );
        })}
      </StatusTab>
      <TableData>
        <Scrollbar>
          {formLoading && <Loading></Loading>}
          {!formLoading && (
            <TableContent>
              <ToolBar>
                <FilterBox>
                  <FilterItem>
                    <Search
                      value={ticketId}
                      placeholder='Seach by ticket ID'
                      onChange={value => {
                        setTicketId(value);
                      }}
                      handleSearch={handleSearch}
                    />
                  </FilterItem>
                  <FilterItem>
                    <Filter
                      options={filterOptions}
                      handleApply={handleApply}
                      approved={approved}
                      condition={condition}
                      handleReset={handleReset}
                    />
                  </FilterItem>
                </FilterBox>
              </ToolBar>

              <StyledTable className={`table${tabIndex}`}>
                <TableContainer component={Paper}>
                  <Table aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'>
                          <SelectAll>
                            <Checkbox
                              color='primary'
                              checked={isSelectedAll}
                              onChange={onSelectAllClick}
                              className={CheckboxCell}
                            />
                          </SelectAll>
                        </TableCell>
                        <TableCell align='center'>
                          <Text type='subTitle'>
                            <Intl id='requestId' />
                          </Text>
                        </TableCell>
                        <TableCell align='center'>
                          <Text type='subTitle'>
                            <Intl id='useCase' />
                          </Text>
                        </TableCell>
                        {approved && (
                          <TableCell align='center'>
                            <Text type='subTitle'>
                              <Intl id='requestor' />
                            </Text>
                          </TableCell>
                        )}
                        <TableCell align='center'>
                          <Text type='subTitle'>
                            <Intl id='associatedForm' />
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
                          <TableCell align='center'>
                            <Checkbox
                              color='primary'
                              checked={isSelected(index)}
                              className={CheckboxCell}
                              onChange={() => {
                                onSelect(index);
                              }}
                            />
                          </TableCell>
                          <TableCell align='center'>{row.id}</TableCell>
                          <TableCell align='center'>
                            {row['Use case'] || '-'}
                          </TableCell>
                          {approved && (
                            <TableCell align='center'>
                              {row.creator_id}
                            </TableCell>
                          )}
                          <TableCell align='center'>
                            {formIdMap[row.form_id] || 'Unknown'}
                          </TableCell>
                          <TableCell align='center'>
                            {covertTime(row.create_time)}
                          </TableCell>
                          <TableCell align='center'>
                            <Operation>
                              <VisibilityIcon
                                onClick={() => {
                                  if (approved) {
                                    navigate(`/app/approvalFlow?id=${row.id}`);
                                  } else {
                                    navigate(`/app/requestDetail?id=${row.id}`);
                                  }
                                }}
                              />
                            </Operation>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledTable>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={tableList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <ButtonWrapper>
                <div className='buttonGroup'>
                  <Button
                    onClick={() => {
                      if (selectedList.length < 1) {
                        return;
                      }
                      let selectedIdList = selectedList.map(selectedIndex => {
                        return tableList[selectedIndex].id;
                      });

                      if (approved) {
                        navigate(
                          `/app/approvalFlow?idList=${selectedIdList.join('|')}`
                        );
                      } else {
                        navigate(
                          `/app/requestDetail?idList=${selectedIdList.join(
                            '|'
                          )}`
                        );
                      }
                    }}
                    variant='contained'
                    disabled={selectedList.length < 1}
                  >
                    <Intl id='previewAll' />
                  </Button>
                </div>
              </ButtonWrapper>
            </TableContent>
          )}
        </Scrollbar>
      </TableData>
    </RecordTableContainer>
  );
};

export default RecordTable;
