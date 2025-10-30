// third lib
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import ScrollBar from 'react-perfect-scrollbar';
import cn from 'classnames';
import styled from '@emotion/styled';

/* material-ui */
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Checkbox from '@mui/material/Checkbox';
import MarkUnreadChatAltIcon from '@assets/icons/MarkUnreadChatAlt';

/* local components & methods */
import FormDataDisplay from '../FormDataDisplay';
import Button from '@basics/Button';
import Loading from '@assets/icons/Loading';
import HeadLine from '@basics/HeadLine';
import { THEME } from '../theme';
import {
  changeStatusList,
  getRequestDetailList,
  getFormDataList,
} from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import Text from '@basics/Text';
import CallModal from '@basics/CallModal';

// Styled components
const RequestDetailContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const DetailContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: ${THEME.colors.lightGrey};
`;

const FormContainer = styled.div`
  flex: 1;
  background-color: ${THEME.colors.white};
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const OnBackButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${THEME.colors.mainPurple};
  margin: ${THEME.spacing.space16} 0 0 ${THEME.spacing.space12};

  svg {
    margin-right: ${THEME.spacing.space12};
  }
`;

const RequestList = styled.div`
  width: 30rem;
  margin-left: ${THEME.spacing.space20};
  height: 100%;
  padding: ${THEME.spacing.space20} 0 0 0;
  background-color: ${THEME.colors.white};
  color: ${THEME.colors.mainPurple};
`;

const RequestContent = styled.div`
  margin-left: ${THEME.spacing.space20};
  height: 100%;
  position: relative;
`;

const RequestTable = styled.div`
  margin-top: ${THEME.spacing.space40};
  color: #333;

  &.active {
    color: ${THEME.colors.mainPurple};

    svg {
      color: ${THEME.colors.mainPurple};
    }
  }

  svg {
    cursor: pointer;
  }
`;

const TimeStamp = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: ${THEME.spacing.space12};
  }
`;

const RequestItem = styled(ListItem)`
  cursor: pointer;
`;

const SvgIcon = styled.div`
  color: ${THEME.colors.darkPurple} !important;
`;

const CheckboxStyled = styled(Checkbox)`
  padding: 0 !important;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: ${THEME.spacing.space20};
  width: 100%;

  button {
    margin-right: ${THEME.spacing.space20};
  }

  button:last-child {
    margin-right: 0;
  }
`;

const RequestDetailList = ({ idListStr, approvedView }) => {
  const [formLoading, setFormLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [currentData, setCurrentData] = useState();
  const [selectedList, setSelectedList] = useState([]);
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });
  const [submitData, setSubmitData] = useState();

  const disableBtn = useMemo(() => {
    return selectedList.length === 0;
  }, [selectedList]);

  const recordList = useMemo(() => {
    let idList = idListStr.split('|');
    return idList;
  }, [idListStr]);

  const isSelected = useCallback(
    index => {
      return selectedList.includes(index);
    },
    [selectedList]
  );

  const onSelect = useCallback(
    index => {
      if (!selectedList.includes(index)) {
        let tmp = [...selectedList, index];
        setSelectedList(tmp);
      } else {
        let currentIndex = selectedList.indexOf(index);
        let tmp = [...selectedList];
        tmp.splice(currentIndex, 1);
        setSelectedList(tmp);
      }
    },
    [selectedList]
  );

  const buttonClickHandle = useCallback(() => {
    let successTips;
    successTips =
      submitData.action === 1
        ? 'Selected Request have been rejected'
        : 'Selected have been approved';

    switch (modalData.status) {
      case 1:
      case 3:
        setModalData({
          ...modalData,
          status: 0,
          content: <Intl id='loadNpatience' />,
        });

        changeStatusList(submitData.data)
          .then(res => {
            if (res.code === 200) {
              setModalData({
                open: true,
                status: 2,
                content: successTips,
              });
              window.location.reload();
            }
          })
          .catch(() => {
            setModalData({
              ...modalData,
              status: 3,
              content: <Intl id='goesWrong' />,
            });
          });
        break;
      default:
        setModalData({ ...modalData, open: false });
        break;
    }
  }, [modalData, submitData]);

  const submitHandle = useCallback(
    action => {
      setModalData({
        open: true,
        status: 1,
        content:
          action === 1
            ? 'Do you confirm to reject selected request?'
            : 'Do you confirm to approve selected request?',
      });
      let selected = requestList.filter(request => {
        return selectedList.includes(request.seq);
      });

      let selectedData = selected.map(item => ({
        id: item.record.id,
        form_status: action,
        form_id: item.form.id,
        comment: '',
      }));

      setSubmitData({
        action: action,
        data: { data: selectedData },
      });
    },
    [requestList, selectedList]
  );

  useEffect(() => {
    getRequestDetailList({ idList: recordList })
      .then(recordData => {
        setFormLoading(true);
        if (recordData.data) {
          let record = recordData.data;
          let formIdList = record.map(item => {
            let latestRecord = item[0];
            return latestRecord.form_id;
          });

          getFormDataList({ idList: formIdList })
            .then(formData => {
              if (formData.data) {
                let tmp = formData.data.map((form, index) => {
                  return {
                    form: form,
                    record: record[index][0],
                    seq: index,
                    status: record[index][0].form_status,
                    checked: index === 0,
                  };
                });
                setRequestList(tmp);
                setCurrentData(tmp[0]);
                setFormLoading(false);
              }
            })
            .catch(e => {
              sendNotify({ msg: e.message, status: 3, show: true });
            });
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [recordList]);

  return (
    <RequestDetailContainer>
      {formLoading && <Loading></Loading>}

      {!formLoading && (
        <DetailContent>
          <FormContainer>
            <ScrollBar>
              <MainContent>
                <OnBackButton
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  <ArrowBackIcon />
                  <Text type='subTitle'>
                    <Intl id='back' />
                  </Text>
                </OnBackButton>
                {currentData && (
                  <FormDataDisplay
                    formId={currentData.form.id}
                    formTemplate={currentData.form}
                    recordId={currentData.record.id}
                    approvedView={approvedView}
                    defaultData={currentData.record}
                    enableReOpen={false}
                    isLatestRecord={true}
                  />
                )}
              </MainContent>
            </ScrollBar>
          </FormContainer>

          <RequestList>
            <ScrollBar>
              <RequestContent>
                <HeadLine>
                  <Intl id='requestList' />
                </HeadLine>
                <RequestTable>
                  <List>
                    {requestList.map((request, index) => (
                      <RequestItem
                        key={index}
                        className={cn({
                          active: currentData.seq === index,
                        })}
                        onClick={() => {
                          setCurrentData(request);
                          setRequestList(
                            requestList.map((item, currIndex) => {
                              if (index === currIndex) {
                                item.checked = true;
                              }
                              return item;
                            })
                          );
                        }}
                      >
                        <ListItemText>{request.record.id}</ListItemText>
                        <ListItemText>
                          <TimeStamp>{request.form.title}</TimeStamp>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          {!approvedView && <MarkUnreadChatAltIcon />}
                          {approvedView && (
                            <>
                              {(request.status === 4 ||
                                request.status === 2) && <ThumbUpAltIcon />}
                              {request.status === 1 && <ThumbDownAltIcon />}
                              {request.status === 0 && !request.checked && (
                                <MarkUnreadChatAltIcon />
                              )}
                              {request.status === 0 && request.checked && (
                                <CheckboxStyled
                                  color='primary'
                                  checked={isSelected(index)}
                                  onChange={() => {
                                    onSelect(index);
                                  }}
                                />
                              )}
                            </>
                          )}
                        </ListItemSecondaryAction>
                      </RequestItem>
                    ))}
                  </List>
                </RequestTable>

                {approvedView && (
                  <ButtonWrapper>
                    <Button
                      onClick={() => {
                        if (disableBtn) {
                          return;
                        }
                        submitHandle(4);
                      }}
                      variant='contained'
                      disabled={disableBtn}
                    >
                      <Intl id='approveAll' />
                    </Button>
                    <Button
                      onClick={() => {
                        if (disableBtn) {
                          return;
                        }
                        submitHandle(1);
                      }}
                      variant='contained'
                      disabled={disableBtn}
                    >
                      <Intl id='rejectAll' />
                    </Button>
                  </ButtonWrapper>
                )}
              </RequestContent>
            </ScrollBar>
          </RequestList>
        </DetailContent>
      )}

      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={buttonClickHandle}
        handleClose={() => {
          setModalData({ ...modalData, open: false });
        }}
      />
    </RequestDetailContainer>
  );
};

export default RequestDetailList;
