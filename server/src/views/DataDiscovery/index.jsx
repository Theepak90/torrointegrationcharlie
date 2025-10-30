/* third lib*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

/* material-ui */
import TablePagination from '@mui/material/TablePagination';

/* local components & methods */
import Text from '@basics/Text';
import FormItem from '@comp/FormItem';
import styled from '@emotion/styled';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@comp/theme';
import HeadLine from '@basics/HeadLine';
import Search from '@basics/Search';
import CallModal from '@basics/CallModal';
import Loading from '@assets/icons/Loading';
import { getTableData } from '@lib/api';
import Button from '@basics/Button';
import { sendNotify } from 'src/utils/systerm-error';
import CardItem from './CardItem';

const DataDiscoverContainer = styled.div`
  position: relative;
  min-height: 100%;
  background-color: ${COLORS.white};
  padding: 2.75rem;
`;

const Title = styled.div`
  color: ${COLORS.mainPurple};
  margin-bottom: ${SPACING.space20};
`;

const DataContainer = styled.div`
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
`;

const FilterPanel = styled.div`
  color: ${COLORS.mainPurple};
  flex: 1;
`;

const TableSearch = styled.form`
  width: 100%;
  height: 100%;
`;

const FormOptions = styled.div`
  width: 100%;
  display: flex;
  margin-top: ${SPACING.space20};
  flex-wrap: wrap;
`;

const FilterBox = styled.div`
  width: 100%;
  margin: ${SPACING.space20} 0;
  padding: 0 ${SPACING.space16};
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: ${SPACING.space20};
  align-items: center;
`;

const ResetButton = styled.div`
  cursor: pointer;
  color: ${COLORS.textGrey};
  margin: ${SPACING.space16};

  span {
    font-size: ${FONT_SIZES.fontSize3};
    font-weight: ${FONT_WEIGHTS.medium};
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const DataTable = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const tableForm = [
  {
    default: '',
    des: 'Dataset name',
    edit: 1,
    id: 'datasetId',
    label: 'Dataset name',
    options: [],
    placeholder: 'Dataset name',
    style: 3,
  },
  {
    default: '',
    des: 'Table description',
    edit: 1,
    id: 'tableDescription',
    label: 'Table description',
    options: [],
    placeholder: 'Table description',
    style: 3,
  },
  {
    default: '',
    des: 'Location',
    edit: 1,
    id: 'location',
    label: 'Location',
    options: [],
    placeholder: 'Location',
    style: 3,
  },
  {
    default: '',
    des: 'Column name',
    edit: 1,
    id: 'columnName',
    label: 'Column name',
    options: [],
    placeholder: 'Column name',
    style: 3,
  },
  {
    default: '',
    des: 'Included table tag',
    edit: 1,
    id: 'tags',
    label: 'Included table tag',
    options: [],
    placeholder: 'Included table tag',
    style: 3,
  },
  {
    default: '',
    des: 'Included policy tag',
    edit: 1,
    id: 'policyTags',
    label: 'Included policy tag',
    options: [],
    placeholder: 'Included policy tag',
    style: 3,
  },
  {
    default: '',
    des: 'Create time',
    edit: 1,
    id: 'createTime',
    label: 'Create time',
    options: [],
    placeholder: 'Create time',
    style: 9,
  },
  {
    default: '',
    des: 'Onboard time',
    edit: 1,
    id: 'onboardTime',
    label: 'Onboard time',
    options: [],
    placeholder: 'Onboard time',
    style: 9,
  },
  {
    default: '',
    des: 'Type',
    edit: 1,
    id: 'type',
    label: 'Type',
    options: [
      { label: 'TABLE', value: 'TABLE' },
      { label: 'View', value: 'View' },
    ],
    placeholder: '',
    style: 1,
  },
];

const DataDiscovery = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, register, reset } = useForm(); // initialise the hook

  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [tableList, setTableList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [dataName, setDataName] = useState('');

  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
    cb: null,
  });

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

  const submitHandle = useCallback(
    data => {
      Object.keys(data).forEach(key => {
        !data[key] && delete data[key];
      });

      if (dataName) {
        data.tableId = dataName;
      }
      setSearchQuery(data);
    },
    [dataName]
  );

  const renderFormItem = (items, disabled) => {
    return items.map((item, index) => {
      return (
        <FormItem
          key={index}
          data={item}
          index={index}
          control={control}
          register={register}
          disabled={disabled}
        />
      );
    });
  };

  const closeModal = () => {
    setModalData({ ...modalData, open: false, cb: null });
  };

  useEffect(() => {
    if (searchQuery) {
      setFormLoading(true);
      getTableData(searchQuery)
        .then(res => {
          setTableList(res.data);
          setFormLoading(false);
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
        });
    }
  }, [searchQuery]);

  useEffect(() => {
    setFormLoading(true);
    getTableData()
      .then(res => {
        setTableList(res.data);
        setFormLoading(false);
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, []);

  const handleSearch = useCallback(() => {
    setFormLoading(true);
    getTableData(searchQuery)
      .then(res => {
        setTableList(res.data);
        setFormLoading(false);
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [searchQuery]);

  return (
    <DataDiscoverContainer>
      <Title>
        <HeadLine>
          <Intl id='dataExplore' />
        </HeadLine>
      </Title>
      <TableSearch id='tableSearch' onSubmit={handleSubmit(submitHandle)}>
        <DataContainer>
          <FilterContainer>
            <FilterPanel>
              <FormOptions>{renderFormItem(tableForm)}</FormOptions>
            </FilterPanel>
          </FilterContainer>
          <FilterBox>
            <FilterItem>
              <Search
                fullWidth
                placeholder='Search by Table name'
                value={dataName}
                onChange={value => {
                  setDataName(value);
                }}
                handleSearch={handleSearch}
              />
              <ButtonWrapper>
                <Button
                  onClick={() => {
                    navigate(`/app/dashboard`);
                  }}
                  text
                >
                  <Intl id='backToDashboard' />
                </Button>
                <Button type='submit' variant='contained'>
                  <Intl id='search' />
                </Button>
                <ResetButton
                  onClick={() => {
                    setDataName('');
                    reset({
                      datasetId: '',
                      tableDescription: '',
                      location: '',
                      columnName: '',
                      tags: '',
                      policyTag: '',
                      createTime: '',
                      onboardTime: '',
                      type: '',
                    });
                    setSearchQuery({});
                    setTableList([]);
                    setPage(0);
                  }}
                >
                  <Text type='regular'>
                    <Intl id='CLEAR' />
                  </Text>
                </ResetButton>
              </ButtonWrapper>
            </FilterItem>
          </FilterBox>
          <MainContent>
            <DataTable>
              {formLoading && <Loading></Loading>}
              {!formLoading &&
                filterTableList.map(item => {
                  return <CardItem key={item.id} cardData={item} />;
                })}
            </DataTable>

            <TablePagination
              rowsPerPageOptions={[6, 12, 24]}
              component='div'
              count={tableList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </MainContent>
        </DataContainer>
      </TableSearch>

      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={modalData.cb}
        handleClose={closeModal}
      />
    </DataDiscoverContainer>
  );
};

export default DataDiscovery;
