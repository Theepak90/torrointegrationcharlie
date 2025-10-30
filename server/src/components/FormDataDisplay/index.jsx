/* third lib*/
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import styled from '@emotion/styled';

/* MUI */
import Paper from '@mui/material/Paper';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

/* local components & methods */
import ProgressBar from '@comp/ProgressBar';
import FormItem from '@comp/FormItem';
import Button from '@basics/Button';
import HeadLine from '@basics/HeadLine';
import Text from '@basics/Text';
import { COLORS, SPACING, SHADOWS, FONT_SIZES } from '../theme';
import {
  getFieldDisplayConfig,
  updateFormRequest,
  changeStatus,
} from '@lib/api';
import Loading from '@assets/icons/Loading';
import { sendNotify } from 'src/utils/systerm-error';
import CallModal from '@basics/CallModal';
import { SUCCESS } from 'src/lib/data/callStatus';
import TextBox from '@basics/TextBox';
import SpecialField from './SpecialField';
import CommentSection from '../CommentSection';
import { covertToCurrentTime } from 'src/utils/timeFormat';
import { useGlobalContext } from 'src/context';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';
import { STATUS_MAP } from 'src/constant';

const FormDataDisplay = ({
  formId,
  formTemplate,
  recordId,
  defaultData,
  enableReOpen,
  setEditView,
  approverView,
  isApprover,
  isLatestRecord,
}) => {
  const { handleSubmit, control, register } = useForm(); // initialise the hook
  const { timeContext } = useGlobalContext();

  const [status, setStatus] = useState();
  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [commentList, setCommentList] = useState(defaultData.comment_history);
  const [specialList, setSpecialList] = useState([]);

  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );

  const [submitData, setSubmitData] = useState(null);
  const [comment, setComment] = useState('');
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });

  const isCurrentApprover = useMemo(() => {
    return approverView && isApprover;
  }, [approverView, isApprover]);

  const buttonClickHandle = useCallback(() => {
    let apiCall;
    let postData;
    let successTips;
    if (submitData.type === 'changeStatus') {
      apiCall = changeStatus;
      successTips =
        submitData.data.form_status === 1
          ? 'Request have been rejected'
          : 'Request have been approved';
      postData = { ...submitData.data, comment: comment || '' };
    } else {
      apiCall = updateFormRequest;
      postData = { ...submitData.data, id: recordId };
      let valueMap = postData.form_field_values_dict;
      successTips = <Intl id='newRequestSubmit' />;
      if (valueMap) {
        let validate = true;
        Object.keys(valueMap).forEach(k => {
          if (!valueMap[k]) validate = false;
        });
        if (!validate) {
          sendNotify({
            msg: 'There are form items not entered',
            status: 3,
            show: true,
          });
          return;
        }
      }
    }

    switch (modalData.status) {
      case 1:
      case 3:
        setModalData({
          ...modalData,
          status: 0,
          content: <Intl id='loadNpatience' />,
        });

        apiCall(postData)
          .then(res => {
            if (res.code === SUCCESS) {
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
  }, [modalData, submitData, recordId, comment]);

  const submitHandle = data => {
    setModalData({
      open: true,
      status: 1,
      content: 'Do you confirm to raise this request?',
    });
    let files = {};
    Object.keys(data).forEach(key => {
      if (data[key] instanceof Array && data[key][0] instanceof File) {
        data[key].forEach((item, index) => {
          files[key + '-' + (index + 1)] = item;
        });
        data[key] = [];
      }
    });
    setSubmitData({
      type: 'reOpen',
      data: {
        form_id: formId,
        form_field_values_dict: data,
      },
    });
  };

  const renderFormItem = items => {
    return items.map((item, index) => {
      return (
        <FormItem
          key={index}
          data={item}
          index={index}
          control={control}
          register={register}
        />
      );
    });
  };

  const handleStatusChange = useCallback(
    status => {
      setModalData({
        open: true,
        status: 1,
        content:
          status === 1 ? <Intl id='rejectTips' /> : <Intl id='approveTips' />,
      });
      setComment('');
      setSubmitData({
        type: 'changeStatus',
        data: {
          id: recordId,
          form_status: status,
          form_id: formData.id,
        },
      });
    },
    [formData, recordId]
  );

  const renderFieldValue = useCallback(
    row => {
      let label = row.label;
      let defaultValue = row.default;
      let special;
      specialList.forEach(item => {
        if (
          label === item.label &&
          (item.formId === null ? true : item.formId === formId)
        ) {
          special = item;
        }
      });
      if (special || (formId === 108 && label === 'Table ID')) {
        if (special) {
          return (
            <SpecialField
              formId={formId}
              special={special}
              data={defaultValue}
            />
          );
        } else {
          // tmp logic let Data Consumption Request display tableTag
          let tableTagProp = {};
          formData.fieldList.forEach(item => {
            if (item.label === 'Project ID') {
              tableTagProp.project_id = item.default;
            }
            if (item.label === 'Data Set ID') {
              tableTagProp.dataset_id = item.default;
            }
            if (item.label === 'Table ID') {
              tableTagProp.table_id = item.default;
            }
          });
          return (
            <SpecialField
              formId={formId}
              specialProp={tableTagProp}
              data={defaultValue}
              special={{
                showValue: true,
                comp: 'TableTagsAutoGen',
              }}
            />
          );
        }
      }

      if (defaultValue instanceof Array || defaultValue instanceof Object) {
        if (
          defaultValue instanceof Array &&
          defaultValue[0] &&
          defaultValue[0].fileName
        ) {
          return defaultValue.map((item, index) => {
            return (
              <FileLink
                key={index}
                 
                target='_blank'
                href={item.fileURL}
              >
                <InsertDriveFileIcon />
                {item.fileName}
              </FileLink>
            );
          });
        }
      } else if (typeof defaultValue === 'boolean') {
        return String(defaultValue);
      } else if (row.style === 6) {
        return covertTime(defaultValue);
      } else {
        return defaultValue;
      }
    },
    [formId, specialList, covertTime, formData]
  );

  useEffect(() => {
    if (!formTemplate || !defaultData) {
      return;
    }
    let defaultValue = defaultData.form_field_values_dict;
    let data = formTemplate;
    let currenFileList = data.fieldList.map(item => {
      if (typeof defaultValue[item.id] === 'boolean') {
        item.default = String(defaultValue[item.id]);
      } else {
        item.default = defaultValue[item.id] || '';
      }
      return item;
    });
    data = {
      ...data,
      fieldList: currenFileList,
    };
    setStatus(defaultData.form_status);
    setFormData(data);
    setFormLoading(false);
  }, [formTemplate, defaultData]);

  useEffect(() => {
    getFieldDisplayConfig().then(res => {
      if (res.data) {
        setSpecialList(res.data);
      }
    });
  }, []);

  useEffect(() => {
    setEdit(false);
  }, [defaultData]);

  useEffect(() => {
    setEditView && setEditView(edit);
  }, [edit, setEditView]);

  useEffect(() => {
    setCommentList(defaultData.comment_history);
  }, [defaultData]);

  return (
    <FormDataDisplayContainer>
      {formLoading && <Loading />}
      {!formLoading && formData && (
        <>
          {!edit && (
            <div
              className={cn({ expired: !isLatestRecord })}
              style={{
                width: '10rem',
                height: '2rem',
                borderRadius: '2rem',
                backgroundColor: isLatestRecord
                  ? COLORS.mainPurple
                  : COLORS.textGrey,
                color: COLORS.white,
                textAlign: 'center',
                lineHeight: '2rem',
                position: 'absolute',
                top: SPACING.space44,
                right: SPACING.space20,
              }}
            >
              {isLatestRecord ? STATUS_MAP[status] : 'expired'}
            </div>
          )}
          <HeadLine>
            {formData.title}
            <span style={{ margin: `0 ${SPACING.space20}` }}>-</span>
            {recordId}
          </HeadLine>
          <div
            style={{ color: COLORS.color12, fontSize: FONT_SIZES.fontSize3 }}
          >
            <Text>{formData.des}</Text>
          </div>
          {!edit && (
            <ViewBox>
              <ReadOnlyView>
                <div style={{ width: '50%' }}>
                  <div
                    style={{
                      color: COLORS.mainPurple,
                      marginBottom: SPACING.space40,
                    }}
                  >
                    <Text type='title'>
                      <Intl id='requestDetail'></Intl>
                    </Text>
                  </div>
                  <TableContainer component={Paper}>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell width='30%' align='center'>
                            <Intl id='label'></Intl>
                          </TableCell>
                          <TableCell width='70%' align='center'>
                            <Intl id='value'></Intl>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.fieldList.map((row, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell width='30%' align='center'>
                                {row.label}
                              </TableCell>
                              <TableCell width='70%' align='center'>
                                {renderFieldValue(row)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <ProgressBox>
                  <div
                    style={{
                      color: COLORS.mainPurple,
                      marginBottom: SPACING.space40,
                    }}
                  >
                    <Text type='title'>
                      <Intl id='requestProgress'></Intl>
                    </Text>
                  </div>
                  <Progress>
                    <ProgressBar
                      progress={defaultData.status_history}
                      stagesLog={defaultData.workflow_stages_list}
                    />
                  </Progress>
                </ProgressBox>
              </ReadOnlyView>
              <CommentSection
                recordId={recordId}
                commentList={commentList}
                statusHistory={defaultData.status_history}
                handleChange={data => {
                  setCommentList(data);
                }}
              />
              {isCurrentApprover && status === 0 && (
                <ButtonWrapper>
                  <Button
                    onClick={() => {
                      handleStatusChange(4);
                    }}
                    variant='contained'
                  >
                    <Intl id='approve' />
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusChange(1);
                    }}
                    variant='contained'
                  >
                    <Intl id='reject' />
                  </Button>
                </ButtonWrapper>
              )}
              {!approverView && enableReOpen && (
                <ButtonWrapper>
                  <Button
                    onClick={() => {
                      setEdit(true);
                    }}
                    variant='contained'
                  >
                    <Intl id='reOpen' />
                  </Button>
                </ButtonWrapper>
              )}
            </ViewBox>
          )}
          {edit && (
            <Form
              id={`currentForm${formData.id}`}
              onSubmit={handleSubmit(submitHandle)}
            >
              <FormOptions>{renderFormItem(formData.fieldList)}</FormOptions>

              <ButtonWrapper>
                <Button
                  onClick={() => {
                    setEdit(false);
                  }}
                  variant='contained'
                >
                  <Intl id='cancel' />
                </Button>
                <Button type='submit' variant='contained'>
                  <Intl id='reSubmit' />
                </Button>
              </ButtonWrapper>
            </Form>
          )}
        </>
      )}
      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={buttonClickHandle}
        handleClose={() => {
          setModalData({ ...modalData, open: false });
        }}
      >
        {modalData.status === 1 && (
          <div style={{ marginBottom: SPACING.space40 }}>
            <div
              style={{
                marginBottom: SPACING.space12,
                color: COLORS.mainPurple,
                fontSize: FONT_SIZES.fontSize3,
              }}
            >
              Additional comments
            </div>
            <TextBox
              value={comment}
              placeholder='Please enter your comment'
              multiline
              rows={4}
              onChange={value => {
                setComment(value);
              }}
            />
          </div>
        )}
      </CallModal>
    </FormDataDisplayContainer>
  );
};

// Style components
const FormDataDisplayContainer = styled.div`
  position: relative;
  background-color: ${COLORS.white};
  flex: 1;
  width: 100%;
  padding: ${SPACING.space40} ${SPACING.space40} ${SPACING.space20}
    ${SPACING.space40};
  display: flex;
  flex-direction: column;
  color: ${COLORS.mainPurple};
`;

const Form = styled.form`
  margin-top: 3rem;
  flex: 1;
  position: relative;
`;

const FormOptions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .formItem {
    width: 100%;
    min-width: calc(33.3% - 2rem);
    margin: ${SPACING.space16};
    flex: 1;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  button {
    margin-right: ${SPACING.space20};
  }
  button:last-child {
    margin-right: 0;
  }
`;

const ViewBox = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const ReadOnlyView = styled.div`
  display: flex;
  margin-top: ${SPACING.space44};
  margin-bottom: ${SPACING.space44};
`;

const ProgressBox = styled.div`
  margin-left: ${SPACING.space40};
`;

const Progress = styled.div`
  margin: ${SPACING.space40} 0 0 ${SPACING.space40};
  flex: 1;
`;

const FileLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: center;
  cursor: pointer;
  text-decoration: underline;
  color: ${COLORS.mainPurple};
  svg {
    color: ${COLORS.mainPurple};
    margin-right: ${SPACING.space8};
  }
`;

export default FormDataDisplay;
