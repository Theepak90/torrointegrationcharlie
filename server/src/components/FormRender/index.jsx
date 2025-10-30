/* third lib*/
import React, { useEffect, useState, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/* local components & methods */
import FormItem from '@comp/FormItem';
import Button from '@basics/Button';
import HeadLine from '@basics/HeadLine';
import Text from '@basics/Text';
import { COLORS, SPACING, FONT_SIZES } from '@comp/theme';
import {
  getFormItem,
  raiseFormRequest,
  updateFormRequest,
  getUcResource,
} from '@lib/api';
import Loading from '@assets/icons/Loading';
import { sendNotify } from 'src/utils/systerm-error';
import CallModal from '@basics/CallModal';
import { SUCCESS } from 'src/lib/data/callStatus';
import { useMemo } from 'react';

const UC_FORM_ID = '2';
const specialForm = [{ id: 2, torroDefField: ['s1', 'u2', 'u3', 'u8', 'u11'] }];
const UC_PROP_MAP = {
  u2: 'owner_group',
  u3: 'team_group',
  u8: 'service_account',
  u11: 'label',
};

const UC_PROP = ['u2', 'u3', 'u8', 'u11'];

const FormRender = ({ formId, onBack, defaultData }) => {
  const navigate = useNavigate();
  const { handleSubmit, control, register, setValue } = useForm(); // initialise the hook
  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(true);
  const [submitData, setSubmitData] = useState(null);
  const [ucDef, setUcDef] = useState({});
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });

  const ucForm = useMemo(() => {
    return formId === UC_FORM_ID;
  }, [formId]);

  const specialField = useMemo(() => {
    if (!formData) {
      return [];
    }
    let tmp = [];
    specialForm.forEach(item => {
      if (item.id === formData.id) tmp = item.torroDefField || [];
    });

    return tmp;
  }, [formData]);

  const buttonClickHandle = useCallback(() => {
    let apiCall = defaultData ? updateFormRequest : raiseFormRequest;
    let postData = submitData;

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
                content: <Intl id='newRequestSubmit' />,
                successCb: () => {
                  navigate(`/app/requestDetail?id=${res.data.id}`);
                },
              });
            }
          })
          .catch(e => {
            setModalData({
              ...modalData,
              status: 3,
              content: e.message,
            });
          });
        break;
      default:
        setModalData({ ...modalData, open: false });
        break;
    }
  }, [modalData, submitData, defaultData, navigate]);

  const submitHandle = useCallback(
    (data, d, f) => {
      setModalData({
        open: true,
        status: 1,
        content: <Intl id='confirmRaise' />,
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
      if (ucForm) {
        UC_PROP.forEach(key => {
          data[key] = ucDef[key][data[key]];
        });
      }
      if (defaultData?.use_case_id) {
        setSubmitData({
          ...files,
          form_id: formId,
          form_field_values_dict: data,
          use_case_id: defaultData?.use_case_id,
        });
      } else {
        setSubmitData({
          ...files,
          form_id: formId,
          form_field_values_dict: data,
        });
      }
    },
    [formId, setSubmitData, ucForm, ucDef, defaultData]
  );

  const renderFormItem = useCallback(
    (items, disabled) => {
      return items.map((item, index) => {
        return (
          <FormItem
            key={index}
            data={item}
            index={index}
            control={control}
            register={register}
            disabled={disabled}
            changeCb={e => {
              if (ucForm && UC_PROP.includes(item.id)) {
                UC_PROP.forEach(key => {
                  setValue(key, e);
                });
              }
            }}
            specialField={specialField}
          />
        );
      });
    },
    [control, register, setValue, ucForm, specialField]
  );

  const initUcDef = useCallback((tempFieldList, formData) => {
    getUcResource()
      .then(res2 => {
        if (res2.data) {
          let tmpUcDef = {};
          Object.keys(UC_PROP_MAP).forEach(key => {
            tmpUcDef[key] = [];
          });
          res2.data.forEach((item, index) => {
            Object.keys(UC_PROP_MAP).forEach(key => {
              tmpUcDef[key].push(item.resource[UC_PROP_MAP[key]]);
            });
          });
          setUcDef(tmpUcDef);
          tempFieldList = tempFieldList.map(item => {
            if (UC_PROP.includes(item.id)) {
              item.style = 2;
              item.options = tmpUcDef[item.id].map((val, index) => ({
                label: val,
                value: index,
              }));
            }
            return item;
          });
          setFormData({
            ...formData,
            fieldList: [
              ...tempFieldList,
              // {
              //   default: '',
              //   des: 'Bacth Onboard User',
              //   edit: 1,
              //   id: 's88',
              //   label: 'Bacth Onboard User',
              //   options: [],
              //   placeholder: 'Attach User sheet',
              //   fileTemplate: {
              //     fileName: 'User-Batch-Onboard.xlsx',
              //     fileUrl: 'User-Batch-Onboard.xlsx',
              //   },
              //   multiple: false,
              //   required: true,
              //   style: 4,
              // },
            ],
          });
          setFormLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, []);

  useEffect(() => {
    setFormLoading(true);
    getFormItem({
      id: formId,
    })
      .then(res => {
        if (res.code === 200) {
          let data = res.data;
          let tempFieldList = data.fieldList.map(item => {
            if (defaultData && defaultData[item.id]) {
              item.default = defaultData[item.id];
            }
            return item;
          });

          if (ucForm) {
            initUcDef(tempFieldList, data);
            return;
          }
          setFormData({
            ...data,
            fieldList: tempFieldList,
          });
          setFormLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [formId, defaultData, initUcDef, ucForm]);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: COLORS.white,
        minHeight: '100%',
        padding: '3rem',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          color: COLORS.mainPurple,
          marginBottom: SPACING.space44,
        }}
      >
        {formLoading && <Loading />}
        {!formLoading && formData && (
          <>
            <div
              style={{
                fontWeight: 'bold',
                fontSize: FONT_SIZES.fontSize1,
                color: COLORS.darkPurple,
              }}
            >
              <HeadLine>{formData.title}</HeadLine>
            </div>
            <div
              style={{ color: COLORS.color12, fontSize: FONT_SIZES.fontSize3 }}
            >
              <Text>{formData.des}</Text>
            </div>
            <form
              style={{ marginTop: '3rem', flex: 1 }}
              onSubmit={handleSubmit(submitHandle)}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  marginBottom: SPACING.space20,
                }}
              >
                {renderFormItem(formData.fieldList)}
              </div>
              <div
                style={{ position: 'absolute', bottom: '3rem', right: '3rem' }}
              >
                {!onBack && (
                  <Button
                    onClick={() => {
                      navigate(`/app/dashboard`);
                    }}
                    variant='contained'
                    style={{ marginRight: SPACING.space20 }}
                  >
                    <Intl id='backToDashboard' />
                  </Button>
                )}
                {onBack && (
                  <Button
                    onClick={() => {
                      onBack();
                    }}
                    variant='contained'
                    style={{ marginRight: SPACING.space20 }}
                  >
                    <Intl id='cancel' />
                  </Button>
                )}
                <Button type='submit' variant='contained'>
                  <Intl id='submit' />
                </Button>
              </div>
            </form>
          </>
        )}
        <CallModal
          open={modalData.open}
          content={modalData.content}
          status={modalData.status}
          successCb={modalData.successCb}
          buttonClickHandle={buttonClickHandle}
          handleClose={() => {
            setModalData({ ...modalData, open: false });
          }}
        />
      </div>
    </div>
  );
};

export default FormRender;
