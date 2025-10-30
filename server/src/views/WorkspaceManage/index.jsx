/* third lib*/
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import Scrollbar from 'react-perfect-scrollbar';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';

/* material-ui */
import Delete from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

/* local components & methods */
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
import CallModal from '@basics/CallModal';
import Loading from '@assets/icons/Loading';
import WorkspaceForm from '@comp/WorkspaceForm';
import {
  wsDelete,
  deleteFormRequest,
  getUseCaseList,
  getUseCaseDetail,
  getWsDetail,
} from '@lib/api';
import { SUCCESS } from 'src/lib/data/callStatus';
import Button from '@basics/Button';
import { sendNotify } from 'src/utils/systerm-error';
import { useGlobalContext } from 'src/context';
import FormRender from '@comp/FormRender';
import FormItem from '@comp/FormItem';
import UsecaseInfo from '@comp/UsecaseInfo';
import { GOVERNOR, IT, ADMIN } from 'src/lib/data/roleType.js';
import { covertToCurrentTime } from 'src/utils/timeFormat';
import GroupListTable from '@comp/GroupListTable';
import { THEME } from 'src/components/theme';

const USE_CASE_FORM_ID = 2;

// Styled components
const WorkspaceCreationContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${THEME.colors.white};
`;

const WorkspaceDetailContainer = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: ${THEME.shadows.paperShadow};
`;

const WsContainer = styled.div`
  width: 100%;
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
  justify-content: space-around;
  margin-bottom: ${THEME.spacing.space20};
`;

const FullLineField = styled.div`
  margin-bottom: ${THEME.spacing.space40};
`;

const DetailItem = styled.div`
  width: 25%;
  margin-bottom: ${THEME.spacing.space20};
  box-sizing: border-box;
`;

const DetailLabel = styled.div`
  margin-bottom: ${THEME.spacing.space4};
`;

const FormOptions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-left: -1rem;
`;

const OperationContainer = styled.div`
  cursor: pointer;
  margin-left: 1rem;
  align-items: center;
  display: flex;
  justify-content: center;

  svg {
    color: ${THEME.colors.textGrey};
    width: 1.5rem;
    height: 1.5rem;

    &:nth-child(1) {
      margin-right: ${THEME.spacing.space8};
    }

    &:hover {
      color: ${THEME.colors.mainPurple};
    }
  }

  &.disabled {
    color: red;
    svg {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        color: ${THEME.colors.textGrey};
      }
    }
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

const WorkspaceManage = () => {
  const { setAuth, authContext, timeContext } = useGlobalContext();
  const { control, register } = useForm(); // initialise the hook

  const [wsData, setWsData] = useState();
  const [formLoading, setFormLoading] = useState(true);
  const [addState, setAddState] = useState(false);
  const [step, setStep] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [ucDefaultData, setUcDefaultData] = useState(null);
  const [viewUcId, setViewUcId] = useState(null);
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
    cb: null,
  });

  const disableEditWs = useMemo(() => {
    return ![ADMIN, GOVERNOR, IT].includes(authContext.role);
  }, [authContext.role]);

  const isServiceAdmin = useMemo(() => {
    return authContext.role === ADMIN;
  }, [authContext]);

  const useCaseList = useMemo(() => {
    if (!wsData) {
      return [];
    }
    let tmpList = wsData.ucList;
    return tmpList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [wsData, page, rowsPerPage]);

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

  const closeModal = () => {
    setModalData({ ...modalData, open: false, cb: null });
  };

  const handleWsDelete = useCallback(() => {
    if (!isServiceAdmin) {
      return;
    }
    setModalData({
      open: true,
      status: 1,
      content: <Intl id='confirmDeleteWs' />,
      cb: () => {
        setModalData({
          open: true,
          status: 0,
          content: <Intl id='submitting' />,
          cb: null,
        });
        wsDelete({
          id: wsData.id,
        })
          .then(res => {
            if (res.code === SUCCESS) {
              setModalData({
                open: true,
                status: 2,
                content: <Intl id='wsDeleted' />,
                cb: () => {
                  setAuth(
                    {
                      ...authContext,
                      role: res.data.role_name,
                      roleList: res.data.role_list,
                      wsId: Number(res.data.workspace_id),
                      wsList: res.data.workspace_list,
                    },
                    'refreshToken'
                  );
                  window.location.reload();
                },
              });
            }
          })
          .catch(e => {
            setModalData({
              open: true,
              status: 3,
              content: e.message,
              cb: () => {
                setModalData({
                  content: e.message,
                  status: 3,
                  open: false,
                  cb: null,
                });
              },
            });
          });
      },
    });
  }, [wsData, authContext, setAuth, isServiceAdmin]);

  const handleWsEdit = useCallback(() => {
    if (disableEditWs) {
      return;
    }
    setStep(1);
  }, [disableEditWs]);

  const handleUcClick = useCallback((uc, ucIndex) => {
    getUseCaseDetail({ id: uc.id })
      .then(res => {
        let ucData = res.data;
        let defaultData = {
          form_id: USE_CASE_FORM_ID,
          use_case_id: ucData.id,
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
        };
        setUcDefaultData(defaultData);
        setStep(2);
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, []);

  const handleUcDelete = useCallback((ucId, ucIndex, row, rowIndex) => {
    setModalData({
      open: true,
      status: 1,
      content: <Intl id='confirmDeleteUc' />,
      cb: () => {
        setModalData({
          open: true,
          status: 0,
          content: <Intl id='submitting' />,
          cb: null,
        });
        deleteFormRequest({
          form_id: USE_CASE_FORM_ID,
          id: ucId,
        })
          .then(res => {
            if (res.code === SUCCESS) {
              setModalData({
                open: true,
                status: 2,
                content: <Intl id='ucDeleted' />,
                cb: () => {
                  setModalData({
                    content: '',
                    status: 2,
                    open: false,
                    cb: null,
                  });
                },
              });
            }
          })
          .catch(e => {
            setModalData({
              open: true,
              status: 3,
              content: e.message,
              cb: () => {
                setModalData({
                  content: e.message,
                  status: 3,
                  open: false,
                  cb: null,
                });
              },
            });
          });
      },
    });
  }, []);

  const handleViewClick = useCallback((uc, ucIndex) => {
    setViewUcId(uc.id);
    setStep(3);
  }, []);

  const dynamicField = useMemo(() => {
    let fieldList = [];
    if (wsData && wsData.dynamic) {
      Object.keys(wsData.dynamic).forEach(key => {
        fieldList = fieldList.concat(
          wsData.dynamic[key].filter(item => item.label !== 'Team')
        );

        /* real logic
        fieldList = fieldList.concat(wsData.dynamic[key]);
        */
      });
    }
    return fieldList;
  }, [wsData]);

  const systemField = useMemo(() => {
    if (wsData && wsData.system) {
      let tmp = '';
      const formItemMap = {
        1: 'Checkbox',
        2: 'Dropdown',
        3: 'Textbox',
        4: 'Upload',
        5: 'Toggle',
        6: 'Datepicker',
      };

      Object.keys(wsData.system).forEach(key => {
        tmp += `${wsData.system[key].length} ${formItemMap[key]} `;
      });
      return tmp;
    } else {
      return '';
    }
  }, [wsData]);

  useEffect(() => {
    if (step === 0) {
      Promise.all([getUseCaseList(), getWsDetail({ id: authContext.wsId })])
        .then(res => {
          let res1 = res[0];
          let res2 = res[1];
          if (res1.data && res2.data) {
            let ucList = res1.data.filter(
              item => item.workspace_id === authContext.wsId
            );
            setWsData({
              ...res2.data,
              ucList: ucList,
            });
            setFormLoading(false);
          }
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
        });
    }
  }, [step, authContext]);

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

  return (
    <WorkspaceCreationContainer>
      {step === 0 && (
        <WorkspaceDetailContainer>
          <Scrollbar>
            {formLoading && <Loading></Loading>}
            {!formLoading && (
              <WsContainer>
                <Title>
                  <HeadLine>
                    <Intl id='wsMan' />
                  </HeadLine>
                </Title>
                <WsDetailBox>
                  <SecondTitle>
                    <Text type='title'>
                      <Intl id='wsDetail' />
                    </Text>
                  </SecondTitle>
                  <DetailBox>
                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='workspaceName' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.ws_name}</div>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='wsAD' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.ws_owner_group}</div>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='itAD' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.it_group}</div>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='dataGovernorAd' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.dg_group}</div>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='wsTeamAD' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.ws_team_group}</div>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='wsDes' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.ws_des}</div>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='userCycle' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.cycle}</div>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>
                        <Text type='subTitle'>
                          <Intl id='ucFlow' />
                        </Text>
                      </DetailLabel>
                      <div>{wsData.approval}</div>
                    </DetailItem>
                  </DetailBox>
                  <FullLineField>
                    <SecondTitle>
                      <Text type='title'>
                        <Intl id='defaultAd' />
                      </Text>
                    </SecondTitle>
                    <FormOptions>
                      <GroupListTable data={wsData.groupArr} editable={false} />
                    </FormOptions>
                  </FullLineField>
                  <FullLineField>
                    <SecondTitle>
                      <Text type='title'>
                        <Intl id='dynamicApprover' />
                      </Text>
                    </SecondTitle>
                    <FormOptions>{renderFormItem(dynamicField)}</FormOptions>
                  </FullLineField>
                  <FullLineField>
                    <SecondTitle>
                      <Text type='title'>
                        <Intl id='systemField' />
                      </Text>
                    </SecondTitle>
                    <div>{systemField}</div>
                  </FullLineField>
                </WsDetailBox>

                <WsDetailBox>
                  <SecondTitle>
                    <Text type='title'>
                      <Intl id='ucList' />
                    </Text>
                  </SecondTitle>
                  {useCaseList && useCaseList.length > 0 && (
                    <>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell width='20%' align='center'>
                                <Text type='subTitle'>
                                  <Intl id='ucId' />
                                </Text>
                              </TableCell>
                              <TableCell width='20%' align='center'>
                                <Text type='subTitle'>
                                  <Intl id='ucName' />
                                </Text>
                              </TableCell>
                              <TableCell width='20%' align='center'>
                                <Text type='subTitle'>
                                  <Intl id='usOwnerGroup' />
                                </Text>
                              </TableCell>
                              <TableCell width='20%' align='center'>
                                <Text type='subTitle'>
                                  <Intl id='ValidityDate' />
                                </Text>
                              </TableCell>
                              <TableCell width='20%' align='center'>
                                <Text type='subTitle'>
                                  <Intl id='operation' />
                                </Text>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {useCaseList.map((uc, ucIndex) => (
                              <TableRow key={ucIndex}>
                                <TableCell align='center'>
                                  <Text>{uc.id}</Text>
                                </TableCell>
                                <TableCell align='center'>
                                  <Text>{uc.usecase_name}</Text>
                                </TableCell>
                                <TableCell align='center'>
                                  <Text>{uc.uc_owner_group}</Text>
                                </TableCell>
                                <TableCell align='center'>
                                  <Text>{covertTime(uc.validity_date)}</Text>
                                </TableCell>
                                <TableCell align='center'>
                                  <OperationContainer>
                                    <VisibilityIcon
                                      onClick={() => {
                                        handleViewClick(uc, ucIndex);
                                      }}
                                    />
                                    <EditIcon
                                      onClick={() => {
                                        handleUcClick(uc, ucIndex);
                                      }}
                                    />
                                    {/* <Delete
                                      onClick={e => {
                                        handleUcDelete(uc.id, ucIndex);
                                      }}
                                    /> */}
                                  </OperationContainer>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component='div'
                        count={wsData.ucList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </>
                  )}
                </WsDetailBox>

                <ButtonWrapper>
                  <Button
                    onClick={() => {
                      window.history.back();
                    }}
                    variant='contained'
                  >
                    <Intl id='back' />
                  </Button>
                  {!disableEditWs && (
                    <>
                      {isServiceAdmin && (
                        <Button
                          onClick={() => {
                            handleWsDelete();
                          }}
                          variant='contained'
                        >
                          <Intl id='delete' />
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          handleWsEdit();
                        }}
                        variant='contained'
                      >
                        <Intl id='edit' />
                      </Button>
                    </>
                  )}
                </ButtonWrapper>
              </WsContainer>
            )}
          </Scrollbar>
        </WorkspaceDetailContainer>
      )}
      {step === 1 && (
        <WorkspaceForm
          onBack={() => {
            setStep(0);
            setAddState(false);
          }}
          currentId={authContext.wsId}
          addState={addState}
        />
      )}

      {step === 2 && (
        <FormRender
          formId={USE_CASE_FORM_ID}
          onBack={() => {
            setStep(0);
            setUcDefaultData(null);
          }}
          defaultData={ucDefaultData}
        />
      )}

      {step === 3 && (
        <UsecaseInfo
          onBack={() => {
            setStep(0);
            setUcDefaultData(null);
          }}
          usecaseId={viewUcId}
        />
      )}

      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={modalData.cb}
        handleClose={closeModal}
      />
    </WorkspaceCreationContainer>
  );
};

export default WorkspaceManage;
