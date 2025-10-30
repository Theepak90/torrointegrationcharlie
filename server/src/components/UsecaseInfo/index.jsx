/* third lib*/
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
import HeadLine from '@basics/HeadLine';
import Text from '@basics/Text';

import {
  getUserCaseMemberConfig,
  getFormItem,
  getUseCaseDetail,
} from '@lib/api';

import { sendNotify } from 'src/utils/systerm-error';
import DataAccess from './DataAccess';
import UsecaseResournce from './UsecaseResournce';

const USE_CASE_FORM_ID = 2;

// Styled Components

const WsContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${THEME.spacing.space44};
`;

const WsDetailBox = styled.div`
  margin-bottom: ${THEME.spacing.space40};
`;

const Title = styled.div`
  color: ${THEME.colors.darkPurple};
  margin-bottom: ${THEME.spacing.space44};
`;

const DetailBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${THEME.spacing.space20};
`;

const DetailItem = styled.div`
  width: 25%;
  margin-bottom: ${THEME.spacing.space20};
  box-sizing: border-box;
`;

const DetailLabel = styled.div`
  margin-bottom: ${THEME.spacing.space4};
`;

const OnBack = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${THEME.colors.mainPurple};
  margin: ${THEME.spacing.space16} 0 0 ${THEME.spacing.space12};

  svg {
    margin-right: ${THEME.spacing.space12};
  }
`;

const SecondTitle = styled.div`
  color: ${THEME.colors.mainPurple};
  margin-bottom: ${THEME.spacing.space20};
`;

const ButtonWrapper = styled.div`
  text-align: right;
  margin-bottom: ${THEME.spacing.space20};

  button:nth-child(1) {
    margin-right: ${THEME.spacing.space20};
  }
`;

const UseCaseRow = ({ user, userColumnKey }) => {
  const [open, setOpen] = useState(false);

  const leftKey = useMemo(() => {
    let wholeKey = Object.keys(user);
    wholeKey = wholeKey.filter(key => {
      return !userColumnKey.includes(key);
    });
    return wholeKey;
  }, [userColumnKey, user]);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell width='10%'>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {userColumnKey.map((key, index) => {
          return (
            <TableCell key={index} align='center'>
              <Text>{user[key]}</Text>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <DetailBox>
                <div style={{ display: 'none' }}></div>
                {leftKey.map((item, index) => {
                  return (
                    <DetailItem key={item + index}>
                      <DetailLabel>
                        <Text type='subTitle'>{item}</Text>
                      </DetailLabel>
                      <div>{user[item]}</div>
                    </DetailItem>
                  );
                })}
              </DetailBox>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
const UsecaseInfo = ({ onBack, usecaseId, detailDisplay }) => {
  const [useCaseDetail, setUseCaseDetail] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ucData, setUcData] = useState();
  const [useCaseMember, setUseCaseMember] = useState([]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const userColumnKey = useMemo(() => {
    return useCaseMember;
  }, [useCaseMember]);

  useEffect(() => {
    if (!usecaseId) {
      return;
    }

    Promise.all([
      getUserCaseMemberConfig(),
      getUseCaseDetail({ id: usecaseId }),
      getFormItem({
        id: USE_CASE_FORM_ID,
      }),
    ])
      .then(res => {
        let res1 = res[0];
        let res2 = res[1];
        let res3 = res[2];
        if (res1.data && res2.data && res3.data) {
          let ucData = res2.data;
          setUseCaseMember(res1.data);
          ucData = {
            defaultData: {
              form_id: USE_CASE_FORM_ID,
              id: ucData.id,
              s1: ucData.region_country,
              s2: ucData.departments,
              u2: ucData.uc_owner_group,
              u3: ucData.uc_team_group,
              u4: ucData.validity_date,
              u5: ucData.usecase_name,
              u6: ucData.uc_des,
              u7: ucData.budget,
              u8: ucData.service_account,
              u9: ucData.resources_access_list,
              u10: ucData.allow_cross_region,
              u11: ucData.prefix,
              u12: ucData.form_field_values_dict.u12,
            },
            user_infos: ucData.user_infos,
            data_access: ucData.data_access ? ucData.data_access : [],
            usecase_resource: ucData.usecase_resource
              ? ucData.usecase_resource
              : [],
          };
          let data = res3.data;
          let tempFieldList = data.fieldList.map(item => {
            if (ucData && ucData?.defaultData[item.id]) {
              item.default = ucData?.defaultData[item.id];
            }
            return item;
          });
          setUcData(ucData);
          setUseCaseDetail(tempFieldList);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [usecaseId]);

  return (
    <div>
      {onBack && (
        <OnBack onClick={onBack}>
          <ArrowBackIcon />
          <Text type='subTitle'>
            <Intl id='back' />
          </Text>
        </OnBack>
      )}
      <WsContainer>
        <Title>
          <HeadLine>
            <Intl id='usecaseInfo' />
          </HeadLine>
        </Title>
        <WsDetailBox>
          <SecondTitle>
            <Text type='title'>
              <Intl id='useCaseDetail' />
            </Text>
          </SecondTitle>
          <DetailBox>
            {useCaseDetail?.length > 0 &&
              useCaseDetail.map(item => {
                return (
                  <DetailItem key={item.id}>
                    <DetailLabel>
                      <Text type='subTitle'>{item.label}</Text>
                    </DetailLabel>
                    <div>{item.default}</div>
                  </DetailItem>
                );
              })}
          </DetailBox>
        </WsDetailBox>
        <WsDetailBox>
          <SecondTitle>
            <Text type='title'>
              <Intl id='useCaseMember' />
            </Text>
          </SecondTitle>
          {ucData && ucData?.user_infos.length > 0 && (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width='10%'></TableCell>
                      {userColumnKey.map((item, index) => {
                        return (
                          <TableCell key={index} align='center'>
                            <Text type='subTitle'>{item}</Text>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ucData.user_infos.map((user, ucIndex) => (
                      <UseCaseRow
                        key={ucIndex}
                        user={user}
                        userColumnKey={userColumnKey}
                      />
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
        </WsDetailBox>
        {ucData && ucData.data_access && (
          <DataAccess dataAccessList={ucData.data_access} />
        )}
        {ucData && ucData.usecase_resource && (
          <UsecaseResournce resoureList={ucData.usecase_resource} />
        )}
      </WsContainer>
    </div>
  );
};

export default UsecaseInfo;
