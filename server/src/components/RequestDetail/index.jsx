// third lib
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import cn from 'classnames';
import styled from '@emotion/styled';

/* MUI */
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TodayIcon from '@mui/icons-material/Today';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/* local components & methods */
import FormDataDisplay from '../FormDataDisplay';
import Loading from '@assets/icons/Loading';
import { getRequestDetail, getFormItem } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import Text from '@basics/Text';
import CallModal from '@basics/CallModal';
import { covertToCurrentTime } from 'src/utils/timeFormat';
import { useGlobalContext } from 'src/context';
import { THEME } from '../theme';

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

const HistoryContainer = styled.div`
  background-color: ${THEME.colors.white};
  color: ${THEME.colors.mainPurple};
  padding: ${THEME.spacing.space40};
`;

const HistoryTable = styled.div`
  margin-top: ${THEME.spacing.space16};
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

const HistoryItem = styled(ListItem)`
  padding: 0 !important;
  margin-bottom: ${THEME.spacing.space16};
  cursor: pointer;
`;

const HistoryItemBox = styled.div`
  display: flex;
  align-items: center;
`;

const TimeStamp = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: ${THEME.spacing.space12};
  }
`;

const LaunchIconStyled = styled(LaunchIcon)`
  margin-left: ${THEME.spacing.space40};
`;

const RequestDetail = ({ recordId, approvedView }) => {
  const { timeContext } = useGlobalContext();

  const [formLoading, setFormLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [formData, setFormData] = useState();
  const [changeData, setChangeData] = useState();
  const [editView, setEditView] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [defaultData, setDefaultData] = useState({
    index: 0,
    data: null,
  });
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });

  const buttonClickHandle = () => {
    setDefaultData(changeData);
    setModalData({ ...modalData, open: false });
  };

  const isLatestRecord = useMemo(() => {
    return defaultData.index === 0;
  }, [defaultData.index]);

  const enableReOpen = useMemo(() => {
    if (!formData) {
      return;
    }
    let formId = Number(formData.id);

    return isLatestRecord && (formId > 350 || [1, 2].includes(formId));
  }, [isLatestRecord, formData]);

  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );

  const InitDetailPage = useCallback(() => {
    setFormLoading(true);

    getRequestDetail({ id: recordId })
      .then(res => {
        if (res.code === 200) {
          let latestRecord = res.data[0];
          res.data.forEach(item => {
            if (item.createTime > latestRecord.createTime) latestRecord = item;
          });
          setIsApprover(res.approverView);
          setDefaultData({ index: 0, data: latestRecord });
          setTableList(res.data);
          getFormItem({
            id: latestRecord.form_id,
          })
            .then(res2 => {
              if (res2.code === 200) {
                let data = res2.data;
                setFormData(data);
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
  }, [recordId]);

  useEffect(() => {
    setFormLoading(true);
    if (recordId) {
      InitDetailPage();
    }
  }, [recordId, InitDetailPage]);

  return (
    <RequestDetailContainer>
      {formLoading && <Loading></Loading>}

      {!formLoading && (
        <DetailContent>
          <FormContainer>
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
            <FormDataDisplay
              formId={formData.id}
              formTemplate={formData}
              recordId={recordId}
              approverView={approvedView}
              isApprover={isApprover}
              defaultData={defaultData.data}
              isLatestRecord={isLatestRecord}
              enableReOpen={enableReOpen}
              setEditView={setEditView}
            />
            {tableList && tableList.length > 1 && (
              <HistoryContainer>
                <Text type='title'>
                  <Intl id='historyRecord' />
                </Text>
                <HistoryTable>
                  <List>
                    {tableList.map((row, index) => (
                      <HistoryItem
                        key={index}
                        className={cn({
                          active: defaultData.index === index,
                        })}
                        onClick={() => {
                          if (editView) {
                            setChangeData({
                              index: index,
                              data: row,
                            });
                            setModalData({
                              ...modalData,
                              open: true,
                              status: 1,
                              content:
                                'Switch to this record will miss your current input.',
                            });
                          } else {
                            setDefaultData({
                              index: index,
                              data: row,
                            });
                          }
                        }}
                      >
                        <HistoryItemBox>
                          <TimeStamp>
                            <TodayIcon />
                            {covertTime(row.create_time)}
                          </TimeStamp>
                          <LaunchIconStyled />
                        </HistoryItemBox>
                      </HistoryItem>
                    ))}
                  </List>
                </HistoryTable>
              </HistoryContainer>
            )}
          </FormContainer>
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

export default RequestDetail;
